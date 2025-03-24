"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";
import Link from "next/link";
import parse from "html-react-parser";

const MICROCMS_SERVICE_DOMAIN = "dogensetech";
const MICROCMS_API_KEY = "IEuon3gxGGPrMo96Ymmzx3sus1XlJoD5H7tC";

if (!MICROCMS_SERVICE_DOMAIN || !MICROCMS_API_KEY) {
  throw new Error("MicroCMS の環境変数が設定されていません");
}

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail?: { url: string };
  publishedAt: string;
  category: { name: string };
}

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = Array.isArray(id) ? id[0] : id;
  const [article, setArticle] = useState<Article | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [prevArticle, setPrevArticle] = useState<{ id: string; title: string } | null>(null);
  const [nextArticle, setNextArticle] = useState<{ id: string; title: string } | null>(null);

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
    const fetchArticle = async () => {
      if (!articleId) return;
      try {
        const data = await client.get({ endpoint: "article", contentId: articleId });
        setArticle(data);
        fetchAdjacentArticles(data.publishedAt);
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
      }
    };

    const fetchAdjacentArticles = async (publishedAt: string) => {
      try {
        const prevData = await client.get({
          endpoint: "article",
          queries: { filters: `publishedAt[less_than]${publishedAt}`, orders: "-publishedAt", limit: 1 },
        });
        const nextData = await client.get({
          endpoint: "article",
          queries: { filters: `publishedAt[greater_than]${publishedAt}`, orders: "publishedAt", limit: 1 },
        });

        setPrevArticle(prevData.contents.length > 0 ? prevData.contents[0] : null);
        setNextArticle(nextData.contents.length > 0 ? nextData.contents[0] : null);
      } catch (error) {
        console.error("前後の記事の取得に失敗しました", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div className="text-center py-10">記事が見つかりませんでした。</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300 dark:border-gray-700">
        <Link href="/"><h1 className="text-2xl font-bold">どげんせTechログ</h1></Link>
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
          <article className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
            {article.thumbnail && (
              <Image src={article.thumbnail.url} alt={article.title} width={800} height={400} className="w-full rounded-md mb-6" />
            )}
            <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
            <p className="text-gray-700 text-sm mb-4 dark:text-gray-400">
              公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="text-base font-semibold text-gray-500 mb-4 dark:text-gray-400">カテゴリ: {article.category.name}</p>
            <div className="prose max-w-full dark:prose-invert">
              {parse(article.content)}
            </div>
          </article>

          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg">
            <div className="flex justify-between">
              {prevArticle ? (
                <Link href={`/article/${prevArticle.id}`} className="text-blue-500 hover:underline">
                  ← {prevArticle.title}
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link href={`/article/${nextArticle.id}`} className="text-blue-500 hover:underline">
                  {nextArticle.title} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
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