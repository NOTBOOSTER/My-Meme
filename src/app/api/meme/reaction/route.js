import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import createConnection from "@/server/database/mysql";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }
    const connection = await createConnection();
    const data = await request.json();
    const [reaction] = await connection.execute(`SELECT * FROM reactions WHERE meme_id = ? AND user_id = ?`, [data.memeId, session.user.id]);
    if (reaction.length > 0 && reaction[0].emoji === data.reactionType) {
        await connection.execute(`DELETE FROM reactions WHERE meme_id = ? AND user_id = ?`, [data.memeId, session.user.id]);
    } else if (reaction.length > 0) {
        await connection.execute(`DELETE FROM reactions WHERE meme_id = ? AND user_id = ?`, [data.memeId, session.user.id]);
        await connection.execute(`INSERT INTO reactions (meme_id, user_id, emoji) VALUES (?, ?, ?)`, [data.memeId, session.user.id, data.reactionType]);
    } else {
        await connection.execute(`INSERT INTO reactions (meme_id, user_id, emoji) VALUES (?, ?, ?)`, [data.memeId, session.user.id, data.reactionType]);
    }
    return NextResponse.json({response: "success"});
}