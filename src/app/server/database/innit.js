import mysql from "mysql2/promise";

let connection;

const createConnection = async () => {
  if (!connection) {
    connection = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    });
  }
  return connection;
};

console.log("ffff");

export default createConnection;
