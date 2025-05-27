"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/libs/client";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function Side() {
  const [archives, setArchives] = useState<{ month: string; count: number }[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await client.get({ endpoint: "category" });
        setCategories(categoryData.contents);

        const query = selectedCategory ? { filters: `category[equals]${selectedCategory}` } : {};
        const articleData = await client.get({ endpoint: "article", queries: query });

        const archiveMap = new Map<string, number>();
        articleData.contents.forEach((article: { publishedAt: string }) => {
          const month = article.publishedAt.slice(0, 7);
          archiveMap.set(month, (archiveMap.get(month) || 0) + 1);
        });

        const sortedArchives = Array.from(archiveMap.entries())
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([month, count]) => ({ month, count }));

        setArchives(sortedArchives);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setIsLoading(false);
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
    <aside className="w-full ~px-4/8 md:~w-52/64 md:~mx-4/8 md:~px-4/10 lg:px-6 bg-opacity-60 shadow rounded-lg backdrop-blur-[2px] h-full py-6 border dark:border-neutral-600 duration-300">
      <h2 className="~text-xl/2xl font-normal mb-4 font-ElenaShine text-[#171717] dark:text-white duration-300">Search</h2>
        <div className="flex items-center border border-gray-300 dark:border-neutral-400 rounded-lg overflow-hidden w-full duration-300">
          <input
            type="text"
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 w-full text-sm bg-white text-black dark:bg-[#111111] dark:text-white focus:outline-none transition duration-300"
          />
          <button
            onClick={handleSearch}
            className="p-2 border-l border-gray-300 dark:border-neutral-400 transition text-neutral-500 hover:text-neutral-800 dark:text-neutral-600 hover:dark:text-neutral-50 duration-300"
            aria-label="検索"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      <h2 className="~text-xl/2xl font-normal mb-4 font-ElenaShine text-[#171717] dark:text-white mt-6 duration-300">Category</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-16">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map(({ id, name }) => (
            <li key={id}>
              <Link
                href={`/category/${id}`}
                className="block p-2 bg-white text-[#171717] shadow ~text-xs/sm rounded-lg text-center dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors duration-300"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="~text-xl/2xl font-medium mb-4 mt-6 font-ElenaShine text-[#171717] dark:text-white duration-300">Monthly Archive</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-16">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {archives.map(({ month, count }) => {
            const [year, m] = month.split("-");
            const formattedMonth = `${year}年${parseInt(m)}月`;
            return (
              <li key={month}>
                <Link
                  href={`/archive/${month}`}
                  className="block p-2 bg-white text-[#171717] shadow ~text-xs/sm rounded-lg text-center dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-colors duration-300"
                >
                  {formattedMonth}（{count}）
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
