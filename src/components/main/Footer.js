import Link from "next/link";
import { RiHome2Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Footer = () => {
  return (
    <div className="md:hidden flex fixed bottom-6 items-center justify-center w-full">
      <div className="bg-gradient-to-r from-indigo-300 to-violet-300 flex gap-9 p-2 rounded-full px-12">
        <Link className="p-2" href="/hey">
          <RiHome2Fill size={30} color="30355d"/>
        </Link>
        <Link className="bg-gray-200 p-1 rounded-full border border-violet-400" href="/hey">
          <IoMdAdd size={40} color="30355d"/>
        </Link>
        <Link className="p-2" href="/hey">
          <MdAccountCircle size={30} color="30355d"/>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
