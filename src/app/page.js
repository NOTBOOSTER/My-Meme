"use client";

import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  FaHeart,
  FaThumbsDown,
  FaSmile,
  FaSadCry,
  FaComment,
  FaRegShareSquare,
} from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8;
  const observerRef = useRef(null);

  const fetchMemes = async (currentOffset) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/memes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start: currentOffset, limit }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch memes");
      setMemes((prevMemes) => [...prevMemes, ...data.memes]);
      setHasMore(data.memes.length === limit);
    } catch (error) {
      console.error("Failed to fetch memes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(offset);
  }, [offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setOffset((prevOffset) => prevOffset + limit);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loading]);

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

    setMemes((prevMemes) =>
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

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 h-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="flex justify-between items-center mx-4">
                <Link href={`/profile/${meme.username === session?.user?.username ? "" : meme.username}`} className="flex items-center py-4">
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
                {/* <button className=" text-gray-600 hover:text-gray-800 transition-colors">
                    <FaRegShareSquare size={20} />
                  </button> */}
              </div>

              <Link href={`/meme/${meme.id}`}>
                <div className="relative aspect-square">
                  <Image
                    src={meme.result_url}
                    fill
                    alt={meme.caption}
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-4 flex-grow">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {meme.caption}
                </p>
              </div>

              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => handleReaction(meme.id, "like")}
                  className={`flex items-center text-gray-600 hover:text-red-500 transition-colors ${
                    meme.user_reaction === "like" ? "text-red-500" : ""
                  }`}
                  title="Like"
                >
                  <FaHeart className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.likes}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "dislike")}
                  className={`flex items-center text-gray-600 hover:text-blue-500 transition-colors ${
                    meme.user_reaction === "dislike" ? "text-indigo-500" : ""
                  }`}
                  title="Dislike"
                >
                  <FaThumbsDown className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.dislikes}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "happy")}
                  className={`flex items-center text-gray-600 hover:text-yellow-500 transition-colors ${
                    meme.user_reaction === "happy" ? "text-yellow-500" : ""
                  }`}
                  title="Happy"
                >
                  <FaSmile className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.happy}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "crying")}
                  className={`flex items-center text-gray-600 hover:text-teal-500 transition-colors ${
                    meme.user_reaction === "crying" ? "text-teal-500" : ""
                  }`}
                  title="Crying"
                >
                  <FaSadCry className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.crying}</span>
                </button>
                <Link
                  href={`/meme/${meme.id}#comments`}
                  className="flex items-center text-gray-600 hover:text-purple-500 transition-colors"
                  title="Comment"
                >
                  <FaComment className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.comments}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={observerRef}
          className="h-full flex justify-center items-center"
        >
          {loading && <Loading />}
          {!hasMore && memes.length > 0 && <p>No more memes to load</p>}
        </div>
      </div>
    </div>
  );
}
