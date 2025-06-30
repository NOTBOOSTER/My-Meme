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
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Meme = ({ params }) => {
  const { data: session } = useSession();
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

  const handleReaction = (memeId, reactionType) => {
    if (!session) return redirect("/auth");

    const meme = memes.find((m) => m.id === memeId);
    if (!meme) return;

    const reactionToColumnMap = {
      like: "likes",
      dislike: "dislikes",
      crying: "crying",
      happy: "happy",
    };

    const updatedCounts = {
      likes: parseInt(meme.likes) || 0,
      dislikes: parseInt(meme.dislikes) || 0,
      happy: parseInt(meme.happy) || 0,
      crying: parseInt(meme.crying) || 0,
    };

    let newReaction;

    if (meme.user_reaction) {
      const oldColumnName = reactionToColumnMap[meme.user_reaction];
      if (oldColumnName) {
        updatedCounts[oldColumnName] = Math.max(
          0,
          updatedCounts[oldColumnName] - 1
        );
      }
    }

    if (meme.user_reaction === reactionType) {
      newReaction = null;
    } else {
      const newColumnName = reactionToColumnMap[reactionType];
      if (newColumnName) {
        updatedCounts[newColumnName] = updatedCounts[newColumnName] + 1;
        newReaction = reactionType;
      }
    }

    setmemes((prevMemes) =>
      prevMemes.map((m) =>
        m.id === memeId
          ? { ...m, ...updatedCounts, user_reaction: newReaction }
          : m
      )
    );

    fetch(`/api/meme/reaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memeId, reactionType }),
    }).catch((error) => {
      console.error("Failed to update reaction:", error);
    });
  };

  const handleShare = async (meme) => {
    const url = `${window.location.origin}/meme/${meme.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedMemes((prev) => ({ ...prev, [meme.id]: true }));
      setTimeout(() => {
        setCopiedMemes((prev) => ({ ...prev, [meme.id]: false }));
      }, 2000);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
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
            <Link
              title="back"
              href="/"
              className="p-1 rounded-full hover:bg-violet-200"
            >
              <IoIosArrowBack size={30} />
            </Link>
            <button
              title="shere"
              onClick={() => handleShare(meme)}
              className="p-1 rounded-full hover:bg-violet-200 cursor-pointer"
            >
              <IoIosSend size={30} />
            </button>
          </div>

          <Link
            href={`/profile/${
              meme.username === session?.user?.username ? "" : meme.username
            }`}
            className="flex items-center p-4 md:hidden"
          >
            <Image
              src={meme.avatar_url}
              width={40}
              height={40}
              alt={`${meme.username}'s profile picture`}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="ml-3 font-semibold text-gray-900 text-sm">
                {meme.first_name + " " + (meme.last_name ? meme.last_name : "")}
              </span>
              <span className="ml-3 font-semibold text-gray-500 text-[12px]">
                {meme.username}
              </span>
            </div>
          </Link>

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
                meme.user_reaction === "dislike" ? "text-indigo-500" : ""
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
          <div className="md:flex justify-between items-center mx-10 p-4 rounded-3xl border-t border-gray-200 hidden">
            <Link
              href={`/profile/${
                meme.username === session?.user?.username ? "" : meme.username
              }`}
              className="md:flex"
            >
              <Image
                src={meme.avatar_url}
                width={40}
                height={40}
                alt={`${meme.username}'s profile picture`}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="ml-3 font-semibold text-gray-900 text-sm">
                  {meme.first_name +
                    " " +
                    (meme.last_name ? meme.last_name : "")}
                </span>
                <span className="ml-3 font-semibold text-gray-500 text-[12px]">
                  {meme.username}
                </span>
              </div>
            </Link>
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
                meme.user_reaction === "dislike" ? "text-indigo-500" : ""
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
          <div className="md:flex mx-10 p-4 rounded-3xl border-t border-gray-200 hidden h-screen bg-white mb-48 md:mb-2 my-3 ">
            <Comments memeId={meme.id} />
          </div>
        </div>
      </div>
    );
  }
  return <Loading />;
};

export default Meme;
