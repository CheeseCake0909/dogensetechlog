"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const MICROCMS_SERVICE_DOMAIN = "dogensetech";
const MICROCMS_API_KEY = "IEuon3gxGGPrMo96Ymmzx3sus1XlJoD5H7tC";

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

// 記事の型定義
interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail?: { url: string };
  category: { name: string };
  publishedAt: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [archives, setArchives] = useState<{ month: string; count: number }[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const router = useRouter();
  
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
    const fetchData = async () => {
      try {
        // カテゴリデータ取得
        const categoryData = await client.get({ endpoint: "category" });
        setCategories(categoryData.contents);

        // 記事データ取得
        const query = selectedCategory ? { filters: `category[equals]${selectedCategory}` } : {};
        const articleData = await client.get({ endpoint: "article", queries: query });

        const sortedArticles = articleData.contents.sort(
          (a: { publishedAt: string }, b: { publishedAt: string }) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);

        // アーカイブ処理
        const archiveMap = new Map<string, number>();

articleData.contents.forEach((article: { publishedAt: string }) => {
  const month = article.publishedAt.slice(0, 7);
  archiveMap.set(month, (archiveMap.get(month) || 0) + 1);
});

const sortedArchives = Array.from(archiveMap.entries()) // [ [month, count], [month, count], ... ]
.sort(([a], [b]) => b.localeCompare(a)) // 新しい月順にソート
.map(([month, count]) => ({ month, count })); // 必要な形に変換

setArchives(sortedArchives);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* ヘッダー */}
      <header className="flex justify-between items-center px-12 py-6 bg-white border-b border-gray-600 dark:border-gray-700 z-10 relative">
        <Link href="/"><h1 className="~text-xl/4xl font-ElenaShine font-medium">Dogense Tech Log</h1></Link>
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mr-4">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-52 dark:bg-gray-700 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-white border-l border-gray-300 dark:bg-gray-600 dark:text-white transition"
              aria-label="検索"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
  <button
    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
    className="w-36 px-4 py-2 bg-white text-black border-[1px] rounded-lg dark:bg-gray-300 dark:text-black"
  >
    {isAccordionOpen ? "▼ テーマ選択" : "▶ テーマ選択"}
  </button>

  {isAccordionOpen && (
    <div className="absolute right-0 w-36 bg-white border-[1px] dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10">
      <button
        onClick={() => {
          setDarkMode(false);
          setIsAccordionOpen(false);
        }}
        className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-color duration-300"
      >
        ライトモード
      </button>
      <button
        onClick={() => {
          setDarkMode(true);
          setIsAccordionOpen(false);
        }}
        className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-color duration-300"
      >
        ダークモード
      </button>
      <button
        onClick={() => {
          setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
          setIsAccordionOpen(false);
        }}
        className="block w-full text-center py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-color duration-300"
      >
        デバイス設定
      </button>
    </div>
  )}
</div>
        </div>
      </header>
      {/* サイバーグリッド背景（四隅+と中央に6x6の点） */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-white to-stone-300 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cyber-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <g stroke="#ff6600" strokeWidth="1">
                {/* 四隅の + 記号 */}
                <g>
                  <line x1="10" y1="5" x2="10" y2="15" />
                  <line x1="5" y1="10" x2="15" y2="10" />
                </g>
              </g>
              {/* 中央の6x6ドット */}
              {
                [...Array(6)].map((_, i) => [...Array(6)].map((_, j) => (
                  <circle key={`dot-${i}-${j}`} cx={27 + i * 25} cy={27 + j * 25} r="1.0" fill="#ff6600" />
                )))
              }
            </pattern>
          </defs>
          <rect width="160%" height="160%" fill="url(#cyber-grid)" opacity="0.7" className="dark:opacity-20" />
        </svg>
      </div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row flex-1 relative z-10">
        {/* 記事一覧 */}
      
        <main className="flex-1 p-6">
          <h2 className="~text-lg/3xl font-medium mx-auto w-2/3 text-center py-4 my-6 bg-opacity-60 bg-white shadow rounded-lg backdrop-blur-[2px]">どげんせやんやったっけ？という時に見るブログ</h2>
          <div className="bg-opacity-60 bg-white px-8 pt-4 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px]">
          <h3 className="text-2xl font-medium py-5 ">
              記事一覧
            </h3>
          <section className="grid md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <div className="p-6 bg-white shadow-xl dark:bg-gray-700 border-[1px] rounded-md hover:bg-gray-300 transition-color duration-300">
                  {article.thumbnail && (
                    <Image src={article.thumbnail.url} alt={article.title} width={600} height={300} className="w-full h-48 object-cover mb-4 rounded-md" />
                  )}
                  <h4 className="text-lg font-bold mb-1">{article.title}</h4>
                  <p className="text-gray-700 text-sm mb-2 dark:text-gray-300">公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}</p>
                  <p className="text-gray-500 text-xs mb-2 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.slice(0, 100)) }}></p>
                  <p className="text-base">{article.category.name}</p>
                </div>
              </Link>
            ))}
          </section>
          </div>
        </main>

        {/* サイドバー */}
        <aside className="w-full md:w-1/4 px-6 mt-10 bg-opacity-60 bg-white shadow rounded-lg backdrop-blur-[2px] h-full py-6">
          {/* カテゴリ */}
          <h3 className="text-3xl font-normal mb-4 font-ElenaShine">Category</h3>
          <ul className="space-y-2">
            {categories.map(({ id, name }) => (
              <li key={id} className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700 cursor-pointer hover:bg-gray-300 transition-color duration-300">
                <Link href={`/category/${id}`}>{name}</Link>
              </li>
            ))}
          </ul>
          {/* 月別アーカイブ */}
          <h3 className="text-3xl font-medium mb-4 mt-10 font-ElenaShine">Monthly Archive</h3>
          <ul className="space-y-2">
            {archives.map(({ month, count }) => (
              <li key={month} className="p-2 bg-white shadow text-sm rounded-lg text-center dark:bg-gray-700 cursor-pointer hover:bg-gray-300 transition-color duration-300">
                <Link href={`/archive/${month}`}>{month}（{count}）</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* フッター */}
      <footer className="text-center py-6 border-t border-gray-600 dark:border-gray-700 bg-white relative z-10">
        <div className="text-gray-500 dark:text-gray-400">© 2025 Dogense Tech Log</div>
      </footer>
    </div>
  );
}
