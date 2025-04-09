"use client"

import React, { Suspense } from "react";
import SearchContent from "./SearchContent";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";

export default function SearchPage() {

  return (
    <div className="min-h-screen relative">
      <Header/>
      <BackGround/>
      <div className="container lg:~w-[60rem]/[80rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
      <Suspense fallback={<div className="text-center py-10">読み込み中...</div>}>
        <SearchContent />
      </Suspense>
      <Side/>
      </div>
      <Footer/>
    </div>
  );
}
