"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/libs/client";

export default function Side() {
  const [archives, setArchives] = useState<{ month: string; count: number }[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory] = useState(null);

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
      }
    };

    fetchData();
  }, [selectedCategory]);
    
    return(
        <aside className="lg:w-1/4 mx-auto lg:mx-8 px-10 lg:px-6 bg-opacity-60 shadow rounded-lg backdrop-blur-[2px] h-full py-6 border dark:border-neutral-600">
        {/* カテゴリ */}
        <h3 className="text-3xl font-normal mb-4 font-ElenaShine text-[#171717] dark:text-white">Category</h3>
        <ul className="space-y-2">
  {categories.map(({ id, name }) => (
    <li key={id}>
      <Link href={`/category/${id}`} className="block p-2 bg-white text-[#171717] shadow text-sm rounded-lg text-center dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors duration-300">
        {name}
      </Link>
    </li>
  ))}
</ul>
        {/* 月別アーカイブ */}
        <h3 className="text-3xl font-medium mb-4 mt-10 font-ElenaShine text-[#171717] dark:text-white">Monthly Archive</h3>
        <ul className="space-y-2">
  {archives.map(({ month, count }) => (
    <li key={month}>
      <Link href={`/archive/${month}`} className="block p-2 bg-white text-[#171717] shadow text-sm rounded-lg text-center dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-colors duration-300">
        {month}（{count}）
      </Link>
    </li>
  ))}
</ul>
      </aside>
    )
}