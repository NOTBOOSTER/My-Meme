"use client"

import { useSession, signIn} from "next-auth/react";
import { FaGithub } from "react-icons/fa";
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
    <button className="bg-gradient-to-r from-gray-600 to-gray-900 rounded-full flex text-white p-2 justify-center items-center gap-3 px-5 mt-8" onClick={() => signIn("github")}>
        <FaGithub size={30}/>
        <span className="">
            Login With Github
        </span>
    </button>
  </div>;
};

export default Login;
