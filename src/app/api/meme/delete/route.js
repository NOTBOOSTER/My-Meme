import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const data = await request.json();
  const connection = await createConnection();
  const [meme] = await connection.execute(`DELETE FROM memes WHERE id = ? AND user_id = ?`, [
    data.memeId,
    data.userId
  ]);
  return NextResponse.json({ meme });
}