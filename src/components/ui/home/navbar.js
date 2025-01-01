"use client";

import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { redirect, usePathname, useRouter } from "next/navigation";
import userPic from "@/../public/userProfile.png";
import { MdExpandMore } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { handleLogout } from "@/lib/auth";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniCurrencyDollar } from "react-icons/hi2";

const Navbar = () => {
    const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn)
    const dispatchLogout=useDispatch()
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState([
        "React",
        "Tailwind",
        "JavaScript",
        "Node.js",
    ]);
    const dropdownRef = useRef(null); // Reference for the dropdown
    const router=useRouter()

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const logoutHandler=async ()=>{
        await handleLogout(dispatchLogout);
        setDropdownOpen(!dropdownOpen)
        router.push('/auth')
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return pathname === "/auth" ? null : (
        <div className="w-full h-[60px] flex justify-between items-center bg-white shadow-[0_4px_40px_rgba(0,0,0,0.04)] px-4 md:px-8">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <h1 className="font-public-sans text-[20px] md:text-[24px] font-bold">
                        Seo Engine
                    </h1>
                </Link>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex gap-24">
                <Link href="/">
                    <span
                        className={`${
                            pathname === "/" ? "text-black" : "text-gray-300"
                        }`}
                    >
                        Dashboard
                    </span>
                </Link>
                <Link href="/documents">
                    <span
                        className={`${
                            pathname === "/documents" ? "text-black" : "text-gray-300"
                        }`}
                    >
                        Documents
                    </span>
                </Link>
                <Link href="/whats-new">
                    <span
                        className={`${
                            pathname === "/whats-new" ? "text-black" : "text-gray-300"
                        } `}
                    >
                        What&apos;s New
                    </span>
                </Link>
            </div>
            {/* Search and Other Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1">
                    <span className="text-gray-500">
                        <CiSearch />
                    </span>
                    <input
                        className="ml-2 focus:outline-none text-sm w-24 md:w-40 focus:wd-[900px]"
                        placeholder="Search..."
                    />
                </div>
                {isLoggedIn && <button className="border border-primaryYellow bg-paleYellow text-black rounded-full px-4 py-1 text-sm flex">
                    <HiMiniCurrencyDollar className="text-white bg-yellow-400 rounded-[100%] mx-1 w-5 h-5" /> 300 
                </button>}
                {isLoggedIn && <span className="rounded-full bg-primaryYellow text-white font-bold w-8 h-8 flex items-center justify-center">
                    ?
                </span>}
                {isLoggedIn? <div ref={dropdownRef} className="relative">
                    <span className="flex items-center gap-2">
                        <Image
                            src={userPic}
                            alt="User Profile"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <button className="text-lg" onClick={toggleDropdown}>
                            <MdExpandMore />
                        </button>
                    </span>
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                            <ul className="flex flex-col">
                                <li className="hover:bg-gray-100 px-4 py-2">
                                    <Link href="/profile">Profile</Link>
                                </li>
                                <li className="hover:bg-gray-100 px-4 py-2">
                                    <Link href="/settings">Settings</Link>
                                </li>
                                <li className="hover:bg-gray-100 px-4 py-2">
                                    <button onClick={logoutHandler}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                :
                <Link href="/auth"><button className="px-6 w-[6rem] py-1 mr-2 ml-2 text-xl rounded bg-primaryYellow text-white cursor-pointer">Login</button></Link>
                }
                
            </div>
        </div>
    );
};

export default Navbar;
