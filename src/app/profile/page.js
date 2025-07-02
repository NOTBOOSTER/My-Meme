"use client";

import Image from "next/image";
import Statics from "./statics";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import UpdatePfp from "./edit/updatePfp";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [pfp , setPfp] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setUserData(data);
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
      <UpdatePfp userData={userData} pfp={pfp} setPfp={setPfp}/>
      <div className=" relative rounded-full  border-4 border-violet-300">
        <div className="overflow-hidden rounded-full">
          <Image src={userData.image || "/images.jpeg"} height={200} width={200} alt="profile" />
        </div>
        <button onClick={() => setPfp(true)} className="absolute bottom-3 left-3 bg-violet-300 p-1 rounded-full cursor-pointer hover:bg-violet-400 hover:scale-110 hover:border-violet-500"><MdOutlineEdit size={20}/></button>
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