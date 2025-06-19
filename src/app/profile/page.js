"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import Statics from "./statics";
import { useSession } from "next-auth/react";

const profile = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex items-center justify-center flex-col gap-3">
        <div className="rounded-full overflow-hidden border-4 border-violet-300">
          <Image src="/images.jpeg" height={200} width={200} alt="profile" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <span className="font-semibold">FULL NAME</span>
          <span className="text-sm">@username</span>
        </div>
        <Statics />
      </div>
    );
  } else {
    redirect("/auth")
  }
};

export default profile;
