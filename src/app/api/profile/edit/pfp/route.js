import { auth } from "@/lib/auth";
import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";
import UpdatePfp from "@/app/profile/edit/updatePfp";
import { uploadPfp } from "@/server/cloudinary/updatePfp";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const { image } = await request.json();
  const connection = await createConnection();
  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }
  try {
    const result = await uploadPfp(image, {
      folder: "profile_pictures",
    });
    const [rows] = await connection.execute(
      `UPDATE users SET avatar_url = ? WHERE email = ?`,
      [result.secure_url, session.user.email]
    );
    return NextResponse.json({ success: "success" });
  } catch (err) {
    console.error("DB error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
