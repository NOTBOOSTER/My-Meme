"use client";

import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditProfile = () => {
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  const [userData, setUserData] = useState();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setUserData(data);
        setUpdatedUser({
          username: data.username || "",
          first_name: data.name ? data.name.split(" ")[0] : "",
          last_name: data.name ? data.name.split(" ")[1] || "" : "",
        });
        
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

  const updateProfile = async () => {
    const response = await fetch("/api/profile/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    const data = await response.json();
    if (!response.ok) toast(data.error, { duration: 3000 });

    if (response.ok) redirect("/profile");
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-center flex-col gap-3">
        <span className="pl-3 font-extrabold font-mono text-3xl">
          Edit Profile
        </span>
        <div className="flex items-center justify-center flex-col gap-3 mt-7">
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm pl-3">Username</span>
            <input
              type="text"
              placeholder="Username"
              className="p-1 pl-5 rounded-md text-gray-800 bg-violet-200 w-72 border border-violet-400"
              value={updatedUser.username}
              onChange={(e) => setUpdatedUser(prev => ({
                ...prev,
                username: e.target.value
              }))}
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm pl-3">First Name</span>
            <input
              type="text"
              placeholder="First Name"
              className="p-1 pl-5 rounded-md text-gray-800 bg-violet-200 w-72 border border-violet-400"
              value={updatedUser.first_name}
              onChange={(e) => setUpdatedUser(prev => ({
                ...prev,
                first_name: e.target.value
              }))}
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm pl-3">Last Name</span>
            <input
              type="text"
              placeholder="Last Name"
              className="p-1 pl-5 rounded-md text-gray-800 bg-violet-200 w-72 border border-violet-400"
              value={updatedUser.last_name}
              onChange={(e) => setUpdatedUser(prev => ({
                ...prev,
                last_name: e.target.value
              }))}
            />
          </div>
          <button 
            className="bg-violet-300 rounded-full px-5 font-mono font-semibold text-gray-700 m-5 py-2 text-md border border-violet-500 cursor-pointer" 
            onClick={updateProfile}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;