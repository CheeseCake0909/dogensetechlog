"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = Array.isArray(id) ? id[0] : id; // `string` に変換
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    thumbnail?: { url: string };
    category: { name: string };
    publishedAt: string;
  } | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!articleId) return;
        const data = await client.get({ endpoint: "article", contentId: articleId });
        setArticle(data);
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <p className="text-center py-10">記事を読み込んでいます...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold">どげんせTechログ</h1>
      </header>

      <div className="container mx-auto px-6 flex flex-col md:flex-row flex-1">
        <main className="flex-1 p-6">
          {article.thumbnail && (
            <img src={article.thumbnail.url} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          )}
          <h2 className="text-3xl font-bold mb-2">{article.title}</h2>
          <p className="text-gray-500 mb-4">公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}</p>
          <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}></div>
          <p className="text-base mb-1 font-semibold">カテゴリ: {article.category.name}</p>
          <a href="/" className="text-blue-500 hover:underline">← 記事一覧に戻る</a>
        </main>
      </div>

      <footer className="text-center py-6 border-t border-gray-300">
        <div className="text-gray-500">© 2025 どげんせTechログ</div>
      </footer>
    </div>
  );
}
