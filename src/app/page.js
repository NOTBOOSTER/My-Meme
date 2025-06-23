"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaThumbsDown, FaSmile, FaSadCry, FaComment, FaRegShareSquare } from "react-icons/fa";

export default function Home() {
  // Hardcoded meme data
  const meme = {
    id: 1,
    result_url: "/images.jpeg",
    caption: "When you realize it's Monday tomorrow 😅",
    username: "MemeLord123",
    pfp_url: "/images.jpeg",
    likes: 42,
    dislikes: 5,
    happy: 15,
    crying: 8,
    comments: 20,
  };

  const handleReaction = (memeId, reactionType) => {
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* User Info */}
            <div className="flex justify-between items-center ">
              <div className="flex items-center p-4">
              <Image
                src={meme.pfp_url}
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

            {/* Meme Image */}
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

            {/* Caption */}
            <div className="p-4">
              <p className="text-gray-700 text-sm line-clamp-2">
                {meme.caption}
              </p>
            </div>

            {/* Reactions */}
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
        </div>
      </div>
    </div>
  );
}