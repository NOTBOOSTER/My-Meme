"use server"

import { NextResponse } from "next/server";
import createConnection from "@/server/database/mysql";
import runQueue from "@/lib/queueWorker";
import { auth } from "@/lib/auth";

export async function POST(request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  } else {
    const prompt = await request.json();
    try {
      const connection = await createConnection();
      const [user] = await connection.execute(`SELECT * FROM users WHERE email = ?`,
        [session.user.email]
      )
      const db = await connection.execute(`INSERT INTO memes (user_id, prompt, status) VALUES (?, ?, ?)`,
        [session.user.id, prompt, "pending"]
      )
      runQueue();
    } catch (err) {
      console.log(err);
      
    }
    return NextResponse.json({response: "success"});
  }
}
