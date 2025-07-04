import { auth } from "@/lib/auth";
import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const limit = parseInt(data.limit);
    const offset = parseInt(data.start);
    const connection = await createConnection();
    const session = await auth();

    if (!session || !session.user?.id) {
      const [memes] = await connection.execute(
        `
        SELECT 
          m.id,
          m.caption,
          m.result_url,
          m.created_at,
          u.username,
          u.avatar_url,
          u.first_name,
          u.last_name,
          COUNT(DISTINCT c.id) AS comments,
    COUNT(DISTINCT CASE WHEN r.emoji = 'like' THEN r.id END) AS likes,
    COUNT(DISTINCT CASE WHEN r.emoji = 'dislike' THEN r.id END) AS dislikes,
    COUNT(DISTINCT CASE WHEN r.emoji = 'happy' THEN r.id END) AS happy,
    COUNT(DISTINCT CASE WHEN r.emoji = 'crying' THEN r.id END) AS crying
        FROM memes m
        INNER JOIN users u ON m.user_id = u.id
        LEFT JOIN reactions r ON m.id = r.meme_id
        LEFT JOIN comments c ON m.id = c.meme_id
        WHERE m.status = ?
        GROUP BY m.id, m.caption, m.result_url, m.created_at, u.username, u.first_name, u.last_name, u.avatar_url
        ORDER BY m.id DESC
        LIMIT ${limit}
        OFFSET ${offset};
      `,
        ["completed"]
      );
      return NextResponse.json({ memes });
    } else {
      const [memes] = await connection.execute(
        `
        SELECT 
          m.id,
          m.caption,
          m.result_url,
          m.created_at,
          u.id as user_id,
          u.username,
          u.avatar_url,
          u.first_name,
          u.last_name,
          COUNT(DISTINCT c.id) AS comments,
          COUNT(DISTINCT CASE WHEN r.emoji = 'like' THEN r.id END) AS likes,
          COUNT(DISTINCT CASE WHEN r.emoji = 'dislike' THEN r.id END) AS dislikes,
          COUNT(DISTINCT CASE WHEN r.emoji = 'happy' THEN r.id END) AS happy,
          COUNT(DISTINCT CASE WHEN r.emoji = 'crying' THEN r.id END) AS crying,
          (SELECT r2.emoji 
           FROM reactions r2 
           WHERE r2.meme_id = m.id AND r2.user_id = ? 
           LIMIT 1) AS user_reaction,
          CASE 
            WHEN u.id = ? THEN 'own_post'
            WHEN (SELECT COUNT(*) FROM followers f WHERE f.follower_id = ? AND f.following_id = u.id) > 0 THEN 'following'
            ELSE 'not_following'
          END AS follow_status
        FROM memes m
        INNER JOIN users u ON m.user_id = u.id
        LEFT JOIN reactions r ON m.id = r.meme_id
        LEFT JOIN comments c ON m.id = c.meme_id
        WHERE m.status = ?
        GROUP BY m.id, m.caption, m.result_url, m.created_at, u.id, u.username, u.first_name, u.last_name, u.avatar_url
        ORDER BY m.id DESC
        LIMIT ${limit} OFFSET ${offset};
      `,
        [session.user.id, session.user.id, session.user.id, "completed"]
      );
      return NextResponse.json({ memes });
    }
  } catch (error) {
    console.error("Error fetching memes:", error);
    return NextResponse.json(
      { error: "Failed to fetch memes" },
      { status: 500 }
    );
  }
}