"use server";


import { NextResponse } from "next/server";
import createConnection from "@/server/database/mysql";
import { auth } from "@/lib/auth";

export async function GET(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  } else {
    const userDetails = {};
    try {
      const connection = await createConnection();
      const [user] = await connection.execute(
        `SELECT * FROM users WHERE email = ?`,
        [session.user.email]
      );

      userDetails.name = user[0].first_name + " " + (user[0].last_name === null ? "" : user[0].last_name);
      userDetails.username = user[0].username;
      userDetails.image = user[0].avatar_url;
      userDetails.followers = user[0].followers;
      userDetails.following = user[0].following;
      userDetails.memes = user[0].memes;
      userDetails.id = user[0].id;
      return NextResponse.json(userDetails);
    } catch (err) {
      console.error("DB error", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
