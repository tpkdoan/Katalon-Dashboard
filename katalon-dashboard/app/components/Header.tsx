"use client";
import Image from "next/image";
import { HiMenu } from "react-icons/hi"; // Hamburger icon

interface HeaderProps {
    onOpenSidebar: () => void;
    onReset?: () => void;
}

export function Header({ onOpenSidebar, onReset }: HeaderProps) {
    return (
        <>
            <header className="z-10 sticky top-0 flex flex-wrap items-center gap-2 bg-[#FFFFFF] py-2 px-2 md:px-12 justify-start dark:bg-[#212121] border-b border-gray-200 dark:border-gray-700">
                {/* Hamburger bar */}
                <div className="flex items-center gap-2">
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={onOpenSidebar}
                        aria-label="Open sidebar">
                        <HiMenu className="text-2xl text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Logo and Title */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onReset}
                >
                    <Image
                        src="/Katalon-Logomark_LightMode.png"
                        alt="Katalon Logo"
                        width={20}
                        height={20}
                        priority
                        className="dark:hidden"
                    />
                    <Image
                        src="/Katalon-Logomark_DarkMode.png"
                        alt="Katalon Logo"
                        width={20}
                        height={20}
                        priority
                        className="hidden dark:block"
                    />
                    <span className="text-xl font-semibold dark:text-white">
                        Assistant <span className="text-xl font-light">Dashboard</span>
                    </span>
                </div>
            </header>
        </>
    );
}
