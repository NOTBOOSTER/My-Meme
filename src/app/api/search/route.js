import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    const connection = await createConnection();
    const [users] = await connection.execute(`SELECT id, username, first_name, last_name, avatar_url
  FROM users
  WHERE username LIKE ? OR first_name LIKE ? OR last_name LIKE ?
  LIMIT 20`, [data.search, data.search, data.search]);
    return NextResponse.json({ users })
}