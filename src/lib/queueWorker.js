import uploadMeme from "@/server/cloudinary/uploadMeme";
import generateMeme from "./gemini";
import createConnection from "@/server/database/mysql";

let isRunning = false;

const runQueue = async () => {
  if (isRunning) return;
  isRunning = true;
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM memes WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    );
    if (rows.length === 0) return (isRunning = false);
    const { id, prompt } = rows[0];
    await connection.query("UPDATE memes SET status = 'processing' WHERE id = ?", [
      id,
    ]);
    const { caption, image } = await generateMeme(prompt);
    if (!image) {
      await connection.execute(
        "UPDATE memes SET status = 'failed' WHERE id = ?",
        [id]
      );
      isRunning = false;
      return;
    }
    const uploadResult = await uploadMeme(image, id);
    await connection.query(
      "UPDATE memes SET status = 'completed' , result_url = ?, caption = ? WHERE id = ?",
      [uploadResult.secure_url, caption, id]
    );
    isRunning = false;
    runQueue();
  } catch (error) {
    console.error(error);
    isRunning = false;
  }
};

export default runQueue;
