"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  IoSearchOutline,
  IoAddSharp,
  IoLogOut,
  IoClose,
} from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { BsGithub } from "react-icons/bs";

const Header = () => {
  const pathname = usePathname();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchQuery }),
      });
      const data = await res.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  useEffect(() => {
    if (mobileSearchOpen) {
      setSearchQuery("");
      setMobileSearchOpen(false);
      setSearchResults([]);
    }
    if (searchResults.length > 0) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [pathname])

  return (
    <>
      <div className="flex h-16 items-center justify-between w-full md:px-12 shadow-md relative">
        <Link href="/" className="flex items-center gap-1 pl-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="font-bold text-lg">My Meme</span>
        </Link>

        <div className="relative hidden md:flex items-center w-80">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 pl-4 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResults([]);
            }}
          />
          <button
            className="absolute right-3 text-gray-600 hover:text-gray-800"
            onClick={handleSearch}
          >
            <IoSearchOutline size={20} />
          </button>

          {searchResults.length > 0 && (
            <div className="absolute top-12 w-full  border rounded shadow-lg max-h-60 overflow-hidden z-50">
              <div className="px-4 py-2 bg-violet-50 border-b flex items-center justify-between rounded-md">
                <span className="font-semibold">Search Results</span>
                <button onClick={() => setSearchResults([])}>
                  <IoClose size={25} />
                </button>
              </div>
              {searchResults.map((user) => (
                <Link
                  href={`/profile/${user.username}`}
                  className="px-4 py-2 bg-violet-50 border-b flex"
                  key={user.id}
                >
                  <div className="rounded-full bg-gray-300 overflow-hidden">
                    <Image
                      src={user.avatar_url}
                      alt={user.username}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="ml-2">
                    <p className="font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-gray-500">{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3 pr-2">
          <button onClick={() => setMobileSearchOpen((prev) => !prev)}>
            <IoSearchOutline size={25} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/post/create"
            className="bg-violet-300 p-1 rounded-full border border-violet-400"
          >
            <IoAddSharp size={25} color="#30355d" />
          </Link>
          <Link
            href="/profile/edit"
            className={pathname === "/profile" ? "" : "hidden"}
          >
            <IoMdSettings size={25} color="#30355d" />
          </Link>
          <Link
            href="/profile"
            className={`${pathname === "/profile" ? "hidden" : ""}`}
          >
            <HiOutlineUserCircle size={25} color="#30355d" />
          </Link>
          <Link href="https://github.com/NOTBOOSTER/">
            <BsGithub size={22} color="#30355d" />
          </Link>
          <button
            onClick={() => signOut()}
            className={`${pathname === "/profile" ? "flex" : "hidden"}`}
          >
            <IoLogOut size={25} color="#30355d" />
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="flex md:hidden px-4 py-2  shadow border-t">
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResults([]);
            }}
          />
          <button className="ml-2 text-violet-600" onClick={handleSearch}>
            <IoSearchOutline size={22} />
          </button>
        </div>
      )}
      {searchResults.length > 0 && mobileSearchOpen && (
        <div className="md:hidden flex flex-col rounded-md w-full border shadow-lg overflow-hidden z-50">
          <div className="px-4 py-2 bg-violet-50 border-b flex items-center justify-between rounded-md">
            <span className="font-semibold">Search Results</span>
            <button onClick={() => setSearchResults([])}>
              <IoClose size={25} />
            </button>
          </div>
          {searchResults.map((user) => (
            <Link
              href={`/profile/${user.username}`}
              className="px-4 py-2 bg-violet-50 border flex mb-1"
              key={user.id}
            >
              <div className="rounded-full bg-gray-300 overflow-hidden">
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={50}
                  height={50}
                />
              </div>
              <div className="ml-2">
                <p className="font-semibold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-gray-500">{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Header;
