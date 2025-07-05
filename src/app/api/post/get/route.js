"use server";

import { NextResponse } from "next/server";
import createConnection from "@/server/database/mysql";
import runQueue from "@/lib/queueWorker";
import { auth } from "@/lib/auth";

export async function POST(request) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  } else {
    try {
      const connection = await createConnection();
      const [generating] = await connection.execute(
        `SELECT * FROM memes WHERE user_id = ? AND status = ? AND status= ? `,
        [session.user.id, "pending", "processing"]
      );
      return NextResponse.json((generating.length > 0 ? true : false));
      // return NextResponse.json(true);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
