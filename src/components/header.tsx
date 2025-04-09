"use client"

import Link from "next/link";
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { setTheme } = useTheme();

      return (
        <header className="flex justify-between items-center ~px-6/12 py-6 border-b border-gray-600 dark:border-neutral-400 bg-white dark:bg-[#111111] z-20 relative transition-colors duration-500">
          <Link href="/">
            <h1 className="~text-3xl/4xl font-ElenaShine font-medium text-[#171717] dark:text-white">
              Dogense Tech Log
            </h1>
          </Link>
          <div className="flex items-center">
            {/* <div className="flex items-center border border-gray-300 dark:border-neutral-400 rounded-lg overflow-hidden mr-4">
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 ~w-32/52 bg-white text-black dark:bg-[#111111] dark:text-white focus:outline-none transition"
              />
              <button
                onClick={handleSearch}
                className="p-2 border-l border-gray-300 dark:text-white dark:border-neutral-400 transition"
                aria-label="検索"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div> */}
            <div className="relative">
              <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="~w-28/32 px-2 py-2 bg-white dark:bg-[#111111] text-black border rounded-lg dark:text-white dark:border-neutral-400 ~text-xs/sm"
              >
                {isAccordionOpen ? "▼ テーマ選択" : "▶ テーマ選択"}
              </button>
              {isAccordionOpen && (
                <div className="absolute right-0 ~w-28/32 bg-white border-[1px] dark:bg-[#111111] dark:border-neutral-400 p-4 rounded-lg shadow-lg z-10 space-y-3">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300 ~text-xs/sm"
                  >
                    ライトモード
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300 ~text-xs/sm"
                  >
                    ダークモード
                  </button>
                  <button
                    onClick={() => {
                      setTheme("system");
                      setIsAccordionOpen(false);
                    }}
                    className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-300 ~text-xs/sm"
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