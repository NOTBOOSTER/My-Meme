"use client";

import Link from "next/link";
import { RiHome2Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useSession } from "next-auth/react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Image from "next/image";

const Footer = () => {
  const { data: session, status } = useSession();
  return (
    <div className="md:hidden flex fixed bottom-6 items-center justify-center w-full z-50">
      <div className="bg-gradient-to-r from-indigo-300 to-violet-300 flex gap-9 p-2 rounded-full px-12">
        <Link className="p-2" href="/">
          <RiHome2Fill size={30} color="30355d"/>
        </Link>
        <Link className="bg-gray-200 p-1 rounded-full border border-violet-400" href="/post/create">
          <IoMdAdd size={40} color="30355d"/>
        </Link>
        <Link
            href="/profile"
            className="flex items-center justify-center p-2"
          >
            {status === "loading" ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
            ) : status === "unauthenticated" ? (
              <HiOutlineUserCircle size={35} color="#30355d" />
            ) : (
              <div className="flex items-center border-2 border-violet-400 rounded-full">
                <Image
                  src={session.user.image}
                  alt={session.user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
          </Link>
      </div>
    </div>
  );
};

export default Footer;
