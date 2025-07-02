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
    console.log(data);
    
    const [user] = await connection.execute(`SELECT * FROM users WHERE username = ?`, [data.username]);
    const [follow] = await connection.execute(`SELECT * FROM followers WHERE follower_id = ? AND following_id = ?`, [session.user.id, user[0].id]);
    if (follow.length > 0) {
        await connection.execute(`DELETE FROM followers WHERE follower_id = ? AND following_id = ?`, [session.user.id, user[0].id]);
        await connection.execute(`UPDATE users SET followers = followers - 1 WHERE id = ?`, [user[0].id]);
        await connection.execute(`UPDATE users SET following = following - 1 WHERE id = ?`, [session.user.id]);
    } else {
        await connection.execute(`INSERT INTO followers (follower_id, following_id) VALUES (?, ?)`, [session.user.id, user[0].id]);
        await connection.execute(`UPDATE users SET followers = followers + 1 WHERE id = ?`, [user[0].id]);
        await connection.execute(`UPDATE users SET following = following + 1 WHERE id = ?`, [session.user.id]);
    }
    return NextResponse.json({success: "success"});
    
}