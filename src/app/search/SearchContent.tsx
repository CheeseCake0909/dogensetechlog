"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";

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

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!query) return;

    const fetchArticles = async () => {
      try {
        const data = await client.get({
          endpoint: "article",
          queries: { filters: `title[contains]${query}` },
        });
        setArticles(data.contents);
      } catch (error) {
        console.error("検索結果の取得に失敗しました", error);
      }
    };

    fetchArticles();
  }, [query]);

  return (
    <div className="container mx-auto px-6 flex flex-col ">
      <h2 className="text-3xl font-bold mt-6">「{query}」の検索結果 </h2>
      <section className="grid md:grid-cols-2 gap-6 mt-6">
        {articles.map((article) => (
          <Link href={`/article/${article.id}`} key={article.id}>
            <div className="p-6 bg-white shadow rounded-lg dark:bg-gray-700">
              {article.thumbnail && (
                <Image
                  src={article.thumbnail.url}
                  alt={article.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h4 className="text-lg font-bold mb-1">{article.title}</h4>
              <p className="text-gray-700 text-base mb-2 dark:text-gray-300">
                公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            該当する記事が見つかりませんでした。
          </p>
        )}
      </section>
    </div>
  );
}
