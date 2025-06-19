"use client";

import Image from "next/image";
import Statics from "./statics";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />; 
  }

  if (!session) {
    redirect("/auth");
  }

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
};

export default Profile;