"use server";

const setupDB = async (connection) => {
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`
    );
    await connection.query(`USE ${process.env.DATABASE_NAME}`);
    await connection.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(25),
      last_name VARCHAR(25),
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT,
      avatar_url TEXT,
      followers INT NOT NULL DEFAULT 0,
      following INT NOT NULL DEFAULT 0,
      memes INT NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS memes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      prompt TEXT NOT NULL,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      caption TEXT,
      result_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS reactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      meme_id INT NOT NULL,
      user_id INT NOT NULL,
      emoji ENUM('like', 'dislike', 'happy', 'crying') NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (meme_id, user_id, emoji),
      FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      meme_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS followers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      follower_id INT NOT NULL,
      following_id INT NOT NULL,
      followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
  } catch (err) {
    console.error("💾DB | Failed to set up database: ", err);
    throw err;
  }
};

export default setupDB;