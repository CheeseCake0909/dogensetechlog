import React, { Suspense } from "react";
import Link from "next/link";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300 dark:border-gray-700">
        <Link href="/">
          <h1 className="text-2xl font-bold">どげんせTechログ</h1>
        </Link>
      </header>

      <Suspense fallback={<div className="text-center py-10">読み込み中...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
