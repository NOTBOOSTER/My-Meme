import { auth } from "@/lib/auth";
import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }
    try {
        const data = await request.json();
        console.log(data)
        console.log(session);
        const connection = await createConnection();
        const [user] = await connection.execute(`SELECT * FROM users WHERE username = ?`, [data.username]);
        if (user.length > 0 && user[0].email !== session.user.email) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }
        const [rows] = await connection.execute(`UPDATE users SET first_name = ?, last_name = ?, username = ? WHERE email = ?`, [data.first_name, data.last_name, data.username, session.user.email]);
        return NextResponse.json({success: "success"});
    } catch (err) {
        console.error("DB error", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}