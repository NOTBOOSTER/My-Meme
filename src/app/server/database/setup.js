const setupDB = async (connection) => {
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`
    );
    await connection.query(`USE ${process.env.DATABASE_NAME}`);
    await connection.query(`CREATE TABLE IF NOT EXISTS test (username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    console.log("table created")
  } catch (err) {
    console.error("ERROR : " + err);
  }
};

export default setupDB;
