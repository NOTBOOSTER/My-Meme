"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect, useRef, useState } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import { toast } from "sonner"

const Create = () => {
  const ref = useRef(null);
  let err = "";
  const submitPost = async () => {
    if (ref.current.value === "") return
    if (ref.current.value.length < 12) return toast("ⓘ Prompt must be at least 12 characters long.", { duration: 3000 });

    const response = await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ref.current.value),
      credentials: "include",
    });
    const res = await response.json();

    toast("Generating... it may take a while", { duration: 10000 });
    if (res.response === "success") setGenerating(true);

    ref.current.value = "";
  };
  
  const { data: session, status } = useSession();
  const [generating, setGenerating] = useState(false); 

  const isgenerating = async () => {
    const data = await fetch("/api/post/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const res = await data.json();
    setGenerating(res);
  };

  useEffect(() => {
    isgenerating();
  }, []);

  if (status === "loading") {
    return <Loading />;
  }

  if (generating) {
    return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="flex space-x-2 items-end gap-2">
        <div className="w-5 h-7 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
        <div className="w-5 h-10 bg-gradient-to-t from-pink-500 to-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-5 h-12 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-5 h-10 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
        <div className="w-5 h-7 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
      </div>
       <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-2 mt-10">
            Generating
          </h2>
          <p className="text-gray-600 animate-pulse">
            Crafting the perfect meme just for you...
          </p>
          <button className="bg-violet-300 rounded-md px-5 font-mono font-semibold text-gray-700 m-5 py-2 text-md border border-violet-500 cursor-pointer hover:bg-violet-400" onClick={() => redirect("/")} >Home</button>
        </div>
    </div>
    );
  }

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="w-full flex justify-center items-center mt-20">
      <div className="flex flex-col border-2 border-gray-300 rounded-lg p-8 bg-gradient-to-b from-gray-100 to-indigo-50">
        <span className="font-semibold text-gray-700 py-3">Prompt</span>
        <textarea
          placeholder="Enter prompt here... "
          ref={ref}
          className="min-w-56 max-h-100 min-h-36 border-2 border-violet-300 rounded-lg p-2"
        ></textarea>
        <button
          className="flex justify-center items-center gap-3 mt-12 bg-gradient-to-r from-violet-200 to-pink-200 p-4 rounded-4xl transition delay-150 duration-500 ease-in-out hover:scale-110 hover:-translate-y-1 hover:border-violet-400 border"
          onClick={submitPost}
        >
          <RiAiGenerate2 size={25} color="30355d" />
          <span className="font-semibold text-gray-700">Generate</span>
        </button>
      </div>
    </div>
  );
};

export default Create;