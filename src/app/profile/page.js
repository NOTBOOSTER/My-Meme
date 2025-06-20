"use client";

import Image from "next/image";
import Statics from "./statics";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      redirect("/auth");
    }
  }, [status]);    


  if (status === "loading" || !userData) {
    return <Loading />; 
  }


  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <div className="rounded-full overflow-hidden border-4 border-violet-300">
        <Image src={userData.image || "/images.jpeg"} height={200} width={200} alt="profile" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <span className="font-semibold">{userData.name || "No Name"}</span>
        <span className="text-sm">{userData.username || "@noname"}</span>
      </div>
      <Statics userData={userData}/>
    </div>
  );
};

export default Profile;