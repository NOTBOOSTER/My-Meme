"use client"

import { useSession, signIn} from "next-auth/react";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
const Login = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />; 
  }

  if (session) {
    redirect("/")
  }
  return <div className="flex flex-col justify-center items-center mt-14">
    <span className="font-mono font-extrabold text-7xl text-gray-700">
        AUTH
    </span>
    <button className="bg-gradient-to-r from-gray-600 to-gray-900 rounded-full flex text-white p-2 justify-center items-center gap-3 px-5 mt-8 cursor-pointer" onClick={() => signIn("github")}>
        <FaGithub size={30}/>
        <span className="">
            Login With Github
        </span>
    </button>
    <button className="bg-gradient-to-r from-blue-300 to-pink-200 rounded-full flex text-white p-2 justify-center items-center gap-3 px-5 mt-8 cursor-pointer" onClick={() => signIn("google")}>
        <FaGoogle size={30}/>
        <span className="">
            Login With Google
        </span>
    </button>
    {/* <button className="bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full flex text-white p-2 justify-center items-center gap-3 px-5 mt-8 cursor-pointer" onClick={() => signIn("discord")}>
        <FaDiscord size={30}/>
        <span className="">
            Login With Discord
        </span>
    </button> */}
  </div>;
};

export default Login;
