import Link from "next/link";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <TbError404 size={150} />
      <span className="pl-3 font-extrabold font-mono text-3xl">
        Page Not Found
      </span>
      <Link href="/">
      <button className="bg-violet-300 rounded-full px-5 font-mono font-semibold text-gray-700 m-5 py-2 text-md border border-violet-500 cursor-pointer">Go Back</button></Link>
    </div>
  );
};

export default NotFound;
