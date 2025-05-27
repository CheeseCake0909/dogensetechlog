"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes"; // next-themes を使用

export default function Header() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 初回マウントチェック（next-themesの推奨）
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex justify-between items-center ~px-6/12 py-6 border-b border-gray-600 dark:border-neutral-400 bg-white dark:bg-[#111111] z-20 relative transition-colors duration3500">
      <Link href="/">
        <h1 className="~text-3xl/4xl font-ElenaShine font-medium text-[#0384C0] dark:text-[#00ffff] duration-300">
          Dogense Tech Log
        </h1>
      </Link>
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="~w-28/32 px-2 py-2 bg-white dark:bg-[#111111] text-black border rounded-lg dark:text-white dark:border-neutral-400 ~text-xs/sm duration-300"
          >
            {isAccordionOpen ? "▼ テーマ選択" : "▶ テーマ選択"}
          </button>
          {isAccordionOpen && (
            <div className="absolute right-0 ~w-28/32 bg-white border-[1px] dark:bg-[#111111] dark:border-neutral-400 p-4 rounded-lg shadow-lg z-10 space-y-3 duration-300">
              <button
                onClick={() => {
                  setTheme("light");
                  setIsAccordionOpen(false);
                }}
                className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-colors ~text-xs/sm duration-300"
              >
                ライトモード
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setIsAccordionOpen(false);
                }}
                className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-colors ~text-xs/sm duration-300"
              >
                ダークモード
              </button>
              <button
                onClick={() => {
                  setTheme("system");
                  setIsAccordionOpen(false);
                }}
                className="block w-full text-center text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-colors ~text-xs/sm duration-300"
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
