"use client"

import Image from "next/image";
import Statics from "./statics";


const profile = () => {
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

export default profile;


{/* <div className="flex justify-between w-full px-20">
        <div className="flex flex-col items-center">
          <span className="font-bold">Memes</span>
          <span className="font-semibold">100</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Followers</span>
          <span className="font-semibold">100</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Following</span>
          <span className="font-semibold">100</span>
        </div>
        
      </div> */}