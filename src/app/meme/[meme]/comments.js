"use client"

import { ArrowRightSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react"
import { IoMdSend } from "react-icons/io";

const Comments = ({memeId}) => {
  const session = useSession();
  const comment = useRef(null);
  const [comments, setComments] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const commentsContainerRef = useRef(null);
  const observer = useRef(null);
  const limit = 10;

  const loadMoreComments = useCallback(() => {
    if (isLoading || !hasMore) return;
    setOffset(prev => prev + limit);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (!commentsContainerRef.current || !hasMore) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreComments();
        }
      },
      { 
        root: commentsContainerRef.current,
        threshold: 0.8,
        rootMargin: '100px'
      }
    );

    const sentinel = commentsContainerRef.current.querySelector('#sentinel');
    if (sentinel) observer.current.observe(sentinel);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore, isLoading, loadMoreComments]);

  const submitComment = async () => {
    if (!session) return redirect("/auth");
    if (comment.current.value === "") return;
    const response = await fetch("/api/meme/comment/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({comment: comment.current.value, memeId}),
      credentials: "include",
    });
    comment.current.value = "";
    const res = await fetch("/api/meme/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({limit: 1, offset: 0, memeId}),
      credentials: "include",
    });
    const data = await res.json();
    if (data.comments.length > 0) {
      setComments(prev => [data.comments[0], ...prev]);
    }
  };

  const fetchComments = async (limit, offset, memeId) => {
    setIsLoading(true);
    const res = await fetch("/api/meme/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({limit, offset, memeId}),
      credentials: "include",
    });
    const data = await res.json();
    setIsLoading(false);
    setComments(prev => offset === 0 ? data.comments : [...prev, ...data.comments]);
    setHasMore(data.comments.length === limit);
  };

  useEffect(() => {
    if (hasMore) {
      fetchComments(limit, offset, memeId);
    }
  }, [memeId, offset]);

  return (
    <div className="w-full h-screen">
      <div className="flex text-xl font-semibold border-b-2 border-gray-300 w-full pb-2">
        Comments
      </div>
      <div className="mt-3 relative flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Comment" 
          className="p-1 pl-5 bg-purple-50 rounded-lg text-black w-full border-purple-200 border-2" 
          ref={comment} 
        />
        <button onClick={submitComment} className="absolute right-2 cursor-pointer">
          <IoMdSend size={20} color="30355d"/>
        </button>
      </div>
      <div 
        className="flex flex-col mt-4 gap-2 h-[80vh] overflow-y-scroll" 
        ref={commentsContainerRef}
      >
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="flex items-center gap-2 mt-3"
          >
            <Image 
              src={comment.avatar_url} 
              alt="user" 
              className="w-10 h-10 rounded-full" 
              width={50} 
              height={50}
            />
            <div className="flex flex-col">
              <span className="font-semibold">{comment.username}</span>
              <span className="text-gray-600">{comment.content}</span>
            </div>
          </div>
        ))}
        {hasMore && (
          <div id="sentinel" className="h-10"></div>
        )}
        {isLoading && <div className="text-center py-2">Loading more comments...</div>}
        {(!isLoading && comments.length === 0) && <div className="flex items-center justify-center">No comments yet</div>}
      </div>
    </div>
  )
}

export default Comments