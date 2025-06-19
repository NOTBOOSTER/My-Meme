"use server"

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  } else {
    const data = await request.json();
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    return NextResponse.json({ ct: "ok" });
  }
}
