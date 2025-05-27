"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/client";
import Script from "next/script";

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail?: { url: string };
  category: { id: string; name: string };
  publishedAt: string;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 ローディング状態追加

  useEffect(() => {
    if (!query) return;

    const fetchArticles = async () => {
      try {
        const data = await client.get({
          endpoint: "article",
          queries: { filters: `title[contains]${query}` },
        });

        const sorted = data.contents.sort(
          (a: { publishedAt: string }, b: { publishedAt: string }) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        setArticles(sorted);
      } catch (error) {
        console.error("検索結果の取得に失敗しました", error);
      } finally {
        setIsLoading(false); // ✅ 読み込み完了
      }
    };
    fetchArticles();
  }, [query]);

  return (
    <>
    <title>
    {!query
      ? "検索キーワードが指定されていません。 | Dogense Tech Log"
      : isLoading
      ? `「${query}」の検索結果 | Dogense Tech Log`
      : articles.length === 0}
    </title>
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
    <main className="flex-1 dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px] duration-300">
      <h2 className="~text-xl/2xl font-normal ~py-4/7 text-[#171717] dark:text-white duration-500">「{query}」の検索結果</h2>
      {!query ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 col-span-2 duration-500">
          検索キーワードが指定されていません。
        </p>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 col-span-2 duration-500">
          該当する記事は見つかりませんでした。
        </p>
      ) : (
        <section className="grid lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group bg-white shadow-lg dark:bg-neutral-700 rounded-md transition hover:bg-neutral-300 dark:hover:bg-neutral-400 duration-300"
            >
              {article.thumbnail && (
                  <Image
                    src={article.thumbnail.url}
                    alt={article.title}
                    width={600}
                    height={300}
                    className="w-full ~h-48/52 sm:~h-52/60 lg:~h-32/48 object-cover rounded-t-md transition group-hover:brightness-75 duration-300"
                  />
                )}
                <div className="px-4 py-3 transition-colors">
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                  </p>
                  <h3 className="~text-sm/base font-normal mb-2 text-[#171717] dark:text-white duration-500">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2 dark:text-gray-300 duration-300">
                    {article.content.replace(/<[^>]+>/g, "").slice(0, 100)}
                  </p>
                  <button className="my-3">
                    <Link
                      href={`/category/${article.category.id}`}
                      className="inline-block px-3 py-2 bg-white text-[#171717] shadow ~text-xs/sm rounded-lg dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors duration-300"
                    >
                      {article.category.name}
                    </Link>
                  </button>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
    </>
  );
}
