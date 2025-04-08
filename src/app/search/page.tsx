"use client"

import React, { Suspense } from "react";
import SearchContent from "./SearchContent";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";

export default function SearchPage() {

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Header/>
      <BackGround/>
      <div className="container mx-auto px-6 flex flex-col lg:flex-row flex-1 relative z-10">
      <Suspense fallback={<div className="text-center py-10">読み込み中...</div>}>
        <SearchContent />
      </Suspense>
      <Side/>
      </div>
      <Footer/>
    </div>
  );
}
