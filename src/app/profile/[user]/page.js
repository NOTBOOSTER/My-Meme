"use client";

import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import Statics from "./statics";


const Profile = ({params}) => {
  const [userData, setUserData] = useState();
  const { data: session, status } = useSession();

  
    

  useEffect(() => {
    const fetchUserData = async () => {
    const {user} = await params;
      try {
        const response = await fetch("/api/profile/user",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

    }, [params]);

    const handleFollow = async (username) => {
    await fetch(`/api/user/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    }).catch((error) => {
      console.error("Failed to follow meme:", error);
    });
    
    setUserData((prevUserData) =>
      prevUserData.isfollowing ? { ...prevUserData, isfollowing: false } : { ...prevUserData, isfollowing: true }
    );
  };
 


  if (status === "loading" || !userData) {
    return <Loading />; 
  }

  if (userData?.error) {
    notFound();
  }

  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <div className=" relative rounded-full  border-4 border-violet-300">
        <div className="overflow-hidden rounded-full">
          <Image src={userData.image || "/images.jpeg"} height={200} width={200} alt="profile" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <span className="font-semibold">{userData.name || "No Name"}</span>
        <span className="text-sm">{userData.username || "@noname"}</span>
        {status === "unauthenticated" ? "" :(userData?.isfollowing ? <button onClick={() => {handleFollow(userData.username)}} className="border border-violet-300 rounded-md px-6 font-semibold text-gray-700 m-5 py-2 text-md">Unfollow</button> : <button onClick={() => {handleFollow(userData.username)}} className="border border-violet-300 rounded-md px-6 font-semibold text-gray-700 m-5 py-2 text-md">Follow</button>)}
      </div>
      <Statics userData={userData}/>
    </div>
  );
};

export default Profile;