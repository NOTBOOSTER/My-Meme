"use client";

import Loading from "@/components/loading";
import Image from "next/image";
import Link from "next/link";
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

  const handleReaction = (memeId, reactionType) => {};

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 h-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center p-4">
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
                  <button className="ml-3 text-gray-600 hover:text-gray-800 transition-colors">
                    <FaRegShareSquare size={20} />
                  </button>
                </div>
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
                  className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                  title="Like"
                >
                  <FaHeart className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.likes}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "dislike")}
                  className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                  title="Dislike"
                >
                  <FaThumbsDown className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.dislikes}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "happy")}
                  className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors"
                  title="Happy"
                >
                  <FaSmile className="h-5 w-5" />
                  <span className="ml-1 text-sm">{meme.happy}</span>
                </button>
                <button
                  onClick={() => handleReaction(meme.id, "crying")}
                  className="flex items-center text-gray-600 hover:text-teal-500 transition-colors"
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