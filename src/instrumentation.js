import runQueue from "./lib/queueWorker"
import createConnection from "./server/database/mysql"

export async function register() {
  console.log("SERVER | Starting Server")
  await createConnection()
  runQueue();
}