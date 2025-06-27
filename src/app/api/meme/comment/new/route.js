import { auth } from "@/lib/auth";
import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }
    const connection = await createConnection();
    const data = await request.json();
    const meme_id = parseInt(data.memeId)

    await connection.execute(`INSERT INTO comments (meme_id, user_id, content) VALUES (?, ?, ?)`, [meme_id, session.user.id, data.comment]);
    return NextResponse.json({response: "success"});
}