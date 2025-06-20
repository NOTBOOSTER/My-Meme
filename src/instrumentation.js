import createConnection from "./server/database/mysql"

export async function register() {
  await createConnection()
  console.log("test starting server")
}