"use client";

import Loading from "@/components/loading";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaHeart,
  FaThumbsDown,
  FaSmile,
  FaSadCry,
  FaComment,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosSend } from "react-icons/io";
import Comments from "./comments";

const Meme = ({ params }) => {
  const [memes, setmemes] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchMeme = async () => {
      const { meme } = await params;
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meme),
        credentials: "include",
      });

      const data = await res.json();
      setmemes(data.meme);
    };

    fetchMeme();
  }, [params]);

  const handleShare = async (meme) => {
  const url = `${window.location.origin}/meme/${meme.id}`;
  try {
    await navigator.clipboard.writeText(url);
    setCopiedMemes(prev => ({ ...prev, [meme.id]: true }));
    setTimeout(() => {
      setCopiedMemes(prev => ({ ...prev, [meme.id]: false }));
    }, 2000);
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

  if (memes && memes.length === 0) {
    notFound();
  } else if (memes) {
    const meme = memes[0];
    return (
      <div className="flex justify-between md:px-8 md:flex-row flex-col mb-10 md:mb-1">
        <div className="rounded-lg overflow-hidden transition-shadow duration-300 flex flex-col w-full md:bg-white ">
          <div className="flex justify-between p-8">
            <Link title="back" href="/" className="p-1 rounded-full hover:bg-violet-200">
              <IoIosArrowBack size={30} />
            </Link>
            <button title="shere" onClick={() => handleShare(meme)} className="p-1 rounded-full hover:bg-violet-200 cursor-pointer">
              <IoIosSend size={30} />
            </button>
          </div>

          <div className="flex items-center p-4 md:hidden">
            <Image
              src={meme.avatar_url}
              width={40}
              height={40}
              alt={`${meme.username}'s profile picture`}
              className="rounded-full object-cover"
            />
            <span className="ml-3 font-semibold text-gray-900">
              {meme.username}
            </span>
          </div>

          <div className="p-4 flex-grow hidden md:flex">
            <p className="text-gray-700 text-sm line-clamp-2">{meme.caption}</p>
          </div>

          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={meme.result_url}
              fill
              alt={meme.caption}
              className="object-cover transition-transform duration-300"
            />
          </div>

          <div className="p-4 flex-grow md:hidden">
            <p className="text-gray-700 text-sm line-clamp-2">{meme.caption}</p>
          </div>

          <div className="flex justify-evenly items-center p-4 border-t border-gray-200 md:hidden">
            <button
              onClick={() => handleReaction(meme.id, "like")}
              className={`flex items-center text-gray-600 hover:text-red-500 cursor-pointer transition-colors ${
                meme.user_reaction === "like" ? "text-red-500" : ""
              }`}
              title="Like"
            >
              <FaHeart size={30} />
              <span className="ml-1 text-sm">{meme.likes}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "dislike")}
              className={`flex items-center text-gray-600 hover:text-blue-500 cursor-pointer transition-colors ${
                meme.user_reaction === "dislike" ? "text-blue-500" : ""
              }`}
              title="Dislike"
            >
              <FaThumbsDown size={30} />
              <span className="ml-1 text-sm">{meme.dislikes}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "happy")}
              className={`flex items-center text-gray-600 hover:text-yellow-500 cursor-pointer transition-colors ${
                meme.user_reaction === "happy" ? "text-yellow-500" : ""
              }`}
              title="Happy"
            >
              <FaSmile size={30} />
              <span className="ml-1 text-sm">{meme.happy}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "crying")}
              className={`flex items-center text-gray-600 hover:text-teal-500 cursor-pointer transition-colors ${
                meme.user_reaction === "crying" ? "text-teal-500" : ""
              }`}
              title="Crying"
            >
              <FaSadCry size={30} />
              <span className="ml-1 text-sm">{meme.crying}</span>
            </button>
          </div>
          <div className="md:hidden h-screen">
            <Comments />
          </div>
        </div>

{/* some shit here */}

        <div className="w-full ">
          <div className="md:flex items-center p-4 hidden mx-10">
            <Image
              src={meme.avatar_url}
              width={40}
              height={40}
              alt={`${meme.username}'s profile picture`}
              className="rounded-full object-cover"
            />
            <span className="ml-3 font-semibold text-gray-900">
              {meme.username}
            </span>
          </div>

          <div className="md:flex justify-between items-center mx-10 p-4 rounded-3xl border-t border-gray-200 hidden  bg-white">
            <button
              onClick={() => handleReaction(meme.id, "like")}
              className={`flex items-center text-gray-600 hover:text-red-500 cursor-pointer transition-colors ${
                meme.user_reaction === "like" ? "text-red-500" : ""
              }`}
              title="Like"
            >
              <FaHeart size={30} />
              <span className="ml-1 text-sm">{meme.likes}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "dislike")}
              className={`flex items-center text-gray-600 hover:text-blue-500 cursor-pointer transition-colors ${
                meme.user_reaction === "dislike" ? "text-blue-500" : ""
              }`}
              title="Dislike"
            >
              <FaThumbsDown size={30}/>
              <span className="ml-1 text-sm">{meme.dislikes}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "happy")}
              className={`flex items-center text-gray-600 hover:text-yellow-500 cursor-pointer transition-colors ${
                meme.user_reaction === "happy" ? "text-yellow-500" : ""
              }`}
              title="Happy"
            >
              <FaSmile size={30} />
              <span className="ml-1 text-sm">{meme.happy}</span>
            </button>
            <button
              onClick={() => handleReaction(meme.id, "crying")}
              className={`flex items-center text-gray-600 hover:text-teal-500 cursor-pointer transition-colors ${
                meme.user_reaction === "crying" ? "text-teal-500" : ""
              }`}
              title="Crying"
            >
              <FaSadCry size={30} />
              <span className="ml-1 text-sm">{meme.crying}</span>
            </button>
          </div>
          <div className="md:flex justify-between items-center mx-10 p-4 rounded-3xl border-t border-gray-200 hidden  bg-white h-screen my-3">
            <Comments />
          </div>
        </div>
      </div>
    );
  }
  return <Loading />;
};

export default Meme;
