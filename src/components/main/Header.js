"use client"

import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";
import { IoAddSharp, IoLogOut  } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { IoMdSettings } from "react-icons/io";
import { signOut } from "next-auth/react";

const Header = () => {
  const pathname = usePathname()
  return (
    <div className="flex h-16 items-center 
    justify-between w-full md:px-12">
      <Link href="/" className="flex items-center gap-1 ">
        <Image src="/logo.svg" alt="Logo" width={70} height={70} />
        <span className="font-bold">My Meme</span>
      </Link>
      <div className="flex items-center gap-2 pr-3">
        <div className="relative hidden md:flex w-auto flex-row items-center gap-1">
          <input type="text" placeholder="Search" className="p-1 pl-5 bg-white rounded-full text-gray-800" />
          <button className="absolute right-4 cursor-pointer">
            <IoSearchOutline size={20} />
          </button>
        </div>
        <div className="px-4 md:hidden">
          <IoSearchOutline size={25} />
        </div>
        <div className="flex ">
          <Link href="/post/create" className="bg-violet-300 p-0.5 text-gray-800 rounded-full border border-violet-400">
            <IoAddSharp size={30} />
          </Link>
        </div>
        <div className={`${pathname === "/profile" ? "" : "hidden"}`}>
          <IoMdSettings size={30} color="30355d"/>
        </div>
        <div className={`${pathname === "/profile" ? "hidden" : "md:flex"} hidden  ml-8 `}>
          <Link href="/profile" className=" p-0.5 text-gray-800 rounded-full">
            <HiOutlineUserCircle size={30} color="30355d"/>
          </Link>
        </div>
        <button onClick={() => signOut()} className={`${pathname === "/profile" ? "flex" : "hidden"} md:ml-8 `}>
            <IoLogOut size={30} color="30355d"/>
        </button>
      </div>
    </div>
  );
};

export default Header;
