"use server"

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createConnection from "@/server/database/mysql";

export async function POST(request) {
  const session = await getServerSession(authOptions);
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
    } catch (err) {

    }
    return NextResponse.json({response: "success"});
  }
}
