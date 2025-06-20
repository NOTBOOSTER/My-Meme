"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useRef } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import { toast } from "sonner"

const Create = () => {
  const ref = useRef(null);
  let err = "";
  const submitPost = async () => {
    if (ref.current.value === "" || ref.current.value.length < 12) {
      return toast("ⓘ Prompt must be at least 12 characters long.", { duration: 3000 });
    }
    const response = await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ref.current.value),
      credentials: "include",
    });
    console.log(await response.json());

    ref.current.value = "";
  };
  
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
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
          className="flex justify-center items-center gap-3 mt-12 bg-gradient-to-r from-violet-200 to-pink-200 p-4 rounded-4xl"
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
