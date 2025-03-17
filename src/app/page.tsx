"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";
import DOMPurify from "dompurify";

const MICROCMS_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;

if (!MICROCMS_SERVICE_DOMAIN || !MICROCMS_API_KEY) {
  throw new Error("MicroCMS の環境変数が設定されていません");
}

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN, 
  apiKey: MICROCMS_API_KEY,
});

export default function Home() {
  const [articles, setArticles] = useState<{ id: string; title: string; content: string; thumbnail?: { url: string }; category: { name: string }; publishedAt: string }[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await client.get({ endpoint: "article" });
        const sortedArticles = data.contents.sort((a: { publishedAt: string }, b: { publishedAt: string }) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex flex-col`}>
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">どげんせTechログ</h1>
        <div>
          <input 
            type="text" 
            placeholder="記事を検索..." 
            className="mx-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
            <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} className="w-36 px-4 py-2 bg-gray-500 text-white rounded dark:bg-gray-300 dark:text-black">
            {isAccordionOpen ? "▼ テーマ選択" : "▶ テーマ選択"}
          </button>
          {isAccordionOpen && (
            <div className="absolute right-10 w-36 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10">
              <button onClick={() => { setDarkMode(false); setIsAccordionOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700">ライトモード</button>
              <button onClick={() => { setDarkMode(true); setIsAccordionOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700">ダークモード</button>
              <button onClick={() => { setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches); setIsAccordionOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700">デバイス設定</button>
            </div>
          )}
        </div>
      </header>
      <div className="container mx-auto px-6 flex flex-col md:flex-row flex-1">
        <main className="flex-1 p-6">
          <section className="text-center py-16 px-6">
            <h2 className="text-3xl font-medium mb-4">どげんせやんやったっけ？という時に見るブログ</h2>
            <p className="text-gray-500 max-w-2xl mx-auto dark:text-gray-400">福岡弁でよかかもしれん情報ばまとめとーよ。</p>
          </section>
          <section className="px-6 py-12 bg-gray-300 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl">記事一覧</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="p-6 bg-white shadow rounded-lg dark:bg-gray-700">
                  {article.thumbnail && (
                    <Image src={article.thumbnail.url} alt={article.title} width={600} height={300} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  <h4 className="text-lg font-bold mb-1">{article.title}</h4>
                  <p className="text-gray-700 text-base mb-2 dark:text-gray-300">{new Date(article.publishedAt).toLocaleDateString("ja-JP")}</p>
                  <p className="text-gray-500 text-xs mb-2 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.slice(0, 100)) }}></p>
                  <p className="text-base mb-1">{article.category.name}</p>
                  <Link href={`/article/${article.id}`} className="text-blue-400 hover:underline">
                    続きを読む →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="w-full md:w-1/4 p-6 border-gray-300 dark:border-gray-700">
          <h3 className="text-2xl font-medium mb-4 mt-10">カテゴリ</h3>
          <ul className="space-y-2">
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">プログラミング</li>
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">CG / UE5</li>
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">開発メモ</li>
          </ul>
          <h3 className="text-2xl font-medium mb-4 mt-10">月別アーカイブ</h3>
          <ul className="space-y-2">
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">2025年3月</li>
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">2025年2月</li>
            <li className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700">2025年1月</li>
          </ul>
        </aside>
      </div>
      <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700">
        <div className="text-gray-500 dark:text-gray-400">© 2025 どげんせTechログ</div>
      </footer>
    </div>
  );
}
