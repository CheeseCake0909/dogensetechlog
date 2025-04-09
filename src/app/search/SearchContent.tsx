"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { client } from "@/libs/client";

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail?: { url: string };
  category: { name: string };
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
    <main className="flex-1 dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px]">
      <h3 className="~text-xl/2xl font-normal ~py-4/7 text-[#171717] dark:text-white">「{query}」の検索結果</h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <section className="grid lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="p-6 bg-white shadow-lg dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-500"
            >
              {article.thumbnail && (
                <Image
                  src={article.thumbnail.url}
                  alt={article.title}
                  width={600}
                  height={300}
                  className="w-full ~h-48/52 sm:~h-52/60 lg:~h-32/48  object-cover mb-4 rounded-md"
                />
              )}
              <h4 className="~text-sm/base font-normal mb-1 text-[#171717] dark:text-white">{article.title}</h4>
              <p className="text-gray-700 text-sm mb-2 dark:text-gray-300">
                公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
              </p>
              <p
                className="text-gray-500 text-xs mb-2 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content.slice(0, 100)),
                }}
              ></p>
              <p className="text-base text-[#171717] dark:text-gray-300">{article.category.name}</p>
            </Link>
          ))}
          {articles.length === 0 && (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 col-span-2">該当する記事は見つかりませんでした。</p>
          )}
        </section>
      )}
    </main>
  );
}
