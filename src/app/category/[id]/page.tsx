"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";
import { useRouter } from "next/navigation";

const MICROCMS_SERVICE_DOMAIN = "dogensetech";
const MICROCMS_API_KEY = "IEuon3gxGGPrMo96Ymmzx3sus1XlJoD5H7tC";

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
  }
  

export default function CategoryPage() {
  const { id } = useParams();
  const categoryId = Array.isArray(id) ? id[0] : id;
  const [categoryName, setCategoryName] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
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
        const categoryData = await client.get({ endpoint: "category", contentId: categoryId });
        setCategoryName(categoryData.name);

        const articlesData = await client.get({
          endpoint: "article",
          queries: { filters: `category[equals]${categoryId}` },
        });
        setArticles(articlesData.contents);
      } catch (error) {
        console.error("カテゴリの記事の取得に失敗しました", error);
      }
    };

    fetchArticles();
  }, [categoryId]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <header className="flex justify-between items-center px-12 py-6 border-b border-gray-300 dark:border-gray-700">
        <Link href="/"><h1 className="text-4xl font-ElenaShine font-medium">Dogense Tech Log</h1></Link>
        <div>
          <input
            type="text"
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">検索</button>
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

      <div className="container mx-auto px-6 flex flex-col">
        <h2 className="text-3xl font-bold mt-6">{categoryName} の記事一覧</h2>
        <section className="grid md:grid-cols-2 gap-6 mt-6">
          {articles.map((article) => (
            <Link href={`/article/${article.id}`} key={article.id}>
              <div className="p-6 bg-white shadow rounded-lg dark:bg-gray-700">
                {article.thumbnail && (
                  <Image src={article.thumbnail.url} alt={article.title} width={600} height={300} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <h4 className="text-lg font-bold mb-1">{article.title}</h4>
                <p className="text-gray-700 text-base mb-2 dark:text-gray-300">
                  公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </Link>
          ))}
          {articles.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">このカテゴリには記事がありません。</p>}
        </section>
      </div>
    </div>
  );
}
