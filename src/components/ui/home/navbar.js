"use client";

import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { redirect, usePathname, useRouter } from "next/navigation";
import tokenCoin from "@/../public/tokenCoin.png";
import userPic from "@/../public/userProfile.png";
import { MdExpandMore } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/lib/auth";
import Cookies from 'js-cookie';
import { setInitialTokenValue } from "@/redux/tokenSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState(["React", "Tailwind", "JavaScript", "Node.js"]);
    const dropdownRef = useRef(null); 
    const router = useRouter();

    const localUser = Cookies.get("user");

    let user = null;
    try {
        user = localUser ? JSON.parse(localUser) : null;
    } catch (error) {
        console.error("Error parsing user from cookies:", error);
        user = null;
    }
    
    const isLoggedIn = Cookies.get("isLoggedin") === "true";
    const token = useSelector((state) => state.token?.token ?? 0);

    useEffect(() => {
        // Initialize token from cookie if not already set
        const localToken = Cookies.get("token");
        if (localToken && user && token === 0) {
            dispatch(setInitialTokenValue(parseInt(localToken)));
        }
    }, [dispatch, user, token]);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const logoutHandler = async () => {
        await handleLogout(dispatch);
        setDropdownOpen(false);
        router.push("/auth");
    };

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
        <div className="w-full h-[60px] bg-white shadow-[0_4px_40px_rgba(0,0,0,0.04)] px-4 fixed z-30">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center h-full">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <h1 className="font-public-sans text-[20px] md:text-[24px] font-bold">
                            Seo Engine
                        </h1>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex gap-14 relative  max-w-[562px]">
                    <Link href="/">
                        <span
                            className={`${
                                pathname === "/" ? "text-primaryYellow" : "text-[#9D9D9D]"
                            }`}
                        >
                            Dashboard
                        </span>
                    </Link>
                    <Link href="/documents">
                        <span
                            className={`${
                                pathname === "/documents" ? "text-primaryYellow" : "text-[#9D9D9D]"
                            }`}
                        >
                            Documents
                        </span>
                    </Link>
                    {/* <Link href="/whats-new">
                        <span
                            className={`${
                                pathname === "/whats-new" ? "text-primaryYellow" : "text-[#9D9D9D]"
                            } `}
                        >
                            What&apos;s New
                        </span>
                    </Link> */}
                </div>

                {/* Search and Other Controls */}
                <div className="flex items-center gap-4 flex-wrap justify-end">
                    {/* <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 w-full md:w-auto">
                        <span className="text-gray-500">
                            <CiSearch />
                        </span>
                        <input
                            className="ml-2 text-sm w-16 md:w-16 focus:md:w-24 focus:outline-none transition-all duration-300"
                            placeholder="Search..."
                        />
                    </div> */}
                    {isLoggedIn && (
                        <Link href="/pricing"><button className="border border-primaryYellow bg-paleYellow text-black rounded-full px-1 py-1 text-sm flex justify-center items-center">
                            {/* <HiMiniCurrencyDollar className="text-white bg-yellow-400 rounded-full mx-1 w-5 h-5" /> */}
                            <Image src={tokenCoin} alt="User Profile" width={15} height={15} />
                            <span className="mx-1 text-gray-500">{token}</span>
                        </button>
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link href="/help">
                            <span className="rounded-full bg-primaryYellow text-white font-bold w-7 h-7 flex items-center justify-center cursor-pointer">
                                ?
                            </span>
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <div ref={dropdownRef} className="relative">
                            <span className="flex items-center gap-2">
                                <Link href="/profile">
                                <Image
                                    src={userPic}
                                    alt="User Profile"
                                    width={25}
                                    height={25}
                                    className="rounded-full cursor-pointer"
                                />
                                </Link>
                                <button className="text-lg" onClick={toggleDropdown}>
                                    <MdExpandMore />
                                </button>
                            </span>
                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                                    <ul className="flex flex-col">
                                        <Link href="/profile"><li className="hover:bg-gray-100 px-4 py-2">
                                            <button>Profile</button>
                                        </li></Link>
                                        <li onClick={logoutHandler} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                                            <button>Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth">
                            <button className="rounded-full px-4 py-1 text-base flex justify-center items-center bg-primaryYellow text-white cursor-pointer hover:bg-yellow-600">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
