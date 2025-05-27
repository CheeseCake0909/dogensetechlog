"use client";

import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import Link from "next/link";
import Script from "next/script";

export default function Home() {

  return (
    <>
      <title>404-ページが見つかりません | Dogense Tech Log</title>
      <meta name="description" content="お探しのページが見つかりませんでした。" />
      <Script id="theme-init" strategy="beforeInteractive">
  {`
    try {
      const theme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (!theme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  `}
</Script>
      <div className="min-h-screen relative">
        <Header/>
        <BackGround />
        <div className="container lg:~w-[60rem]/[75rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
          <main className="flex-1 dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px] duration-300">
            <p className="~text-lg/xl font-normal ~py-8/12 text-[#171717] text-center dark:text-white duration-300">お探しのページが見つかりませんでした。<br/>URLを改めてご確認ください。</p>
            <Link href="/" className="~text-lg/xl justify-center flex text-black hover:text-neutral-300 dark:text-white dark:hover:text-neutral-500 duration-300">記事一覧に戻る</Link>
          </main>
          <Side/>
        </div>
        <Footer />
      </div>
    </>
  );
}
