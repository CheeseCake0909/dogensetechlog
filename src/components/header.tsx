"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { setDarkMode } = useTheme();

    const handleSearch = () => {
        if (searchQuery.trim()) {
          router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
      };

      return (
        <header className="flex justify-between items-center px-12 py-6 border-b border-gray-600 dark:border-neutral-400 bg-white dark:bg-[#111111] z-20 relative transition duration-500">
          <Link href="/">
            <h1 className="~text-xl/4xl font-ElenaShine font-medium text-[#171717] dark:text-white">
              Dogense Tech Log
            </h1>
          </Link>
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 dark:border-neutral-400 rounded-lg overflow-hidden mr-4">
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-52 bg-white text-black dark:bg-[#111111] dark:text-white focus:outline-none transition"
              />
              <button
                onClick={handleSearch}
                className="p-2 border-l border-gray-300 dark:text-white dark:border-neutral-400 transition"
                aria-label="検索"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="w-36 px-4 py-2 bg-white dark:bg-[#111111] text-black border rounded-lg dark:text-white dark:border-neutral-400"
              >
                {isAccordionOpen ? "▼ テーマ選択" : "▶ テーマ選択"}
              </button>
    
              {isAccordionOpen && (
                <div className="absolute right-0 w-36 bg-white border-[1px] dark:bg-[#111111] dark:border-neutral-400 p-4 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setDarkMode(false);
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center py-2 text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300"
                  >
                    ライトモード
                  </button>
                  <button
                    onClick={() => {
                      setDarkMode(true);
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center py-2 text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300"
                  >
                    ダークモード
                  </button>
                  <button
                    onClick={() => {
                      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center py-2 text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300"
                  >
                    デバイス設定
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      );
    }