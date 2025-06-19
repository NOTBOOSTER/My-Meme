import mysql from "mysql2/promise";
import setupDB from "./setup";

let connection;

const createConnection = async () => {
  if (!connection) {
      console.log("💾DB | Connecting to database");
      connection = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
      });
      await setupDB(connection);
      console.log("💾DB | Connected to database");
  }
  return connection;
};

export default createConnection;
