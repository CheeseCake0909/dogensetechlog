"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || "", 
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || ""
});

export default function Home() {
  const [articles, setArticles] = useState<{ id: string; title: string; content: string; thumbnail?: { url: string }; category: { name: string }; publishedAt: string }[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await client.get({ endpoint: "article" });
        setArticles(data.contents.map((article: { id: string; title: string; content: string; thumbnail?: { url: string }; category: { name: string }; publishedAt: string }) => ({
          id: article.id,
          title: article.title,
          content: article.content.replace(/<[^>]*>?/gm, ''),
          thumbnail: article.thumbnail ? { url: article.thumbnail.url } : undefined,
          category: article.category || { name: "未分類" },
          publishedAt: article.publishedAt || "",
        })));
      } catch (error) {
        console.error("記事の取得に失敗しました.", error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="flex justify-between items-center p-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold">どげんせTechログ</h1>
      </header>
      <div className="container mx-auto px-6 flex flex-col md:flex-row flex-1">
        <main className="flex-1 p-6">
          <section className="text-center py-20 px-6">
            <h2 className="text-3xl font-extrabold mb-4">どげんせやんやったっけ？という時に見るブログ</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">福岡弁でよかかもしれん情報ばまとめとーよ。</p>
          </section>
          <section className="px-6 py-12 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-semibold">記事一覧</h3>
              <input 
                type="text" 
                placeholder="🔍 検索..." 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="p-6 bg-white shadow rounded-lg">
                  {article.thumbnail && (
                    <Image src={article.thumbnail.url} alt={article.title} width={600} height={300} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  <h4 className="text-lg font-bold mb-1">{article.title}</h4>
                  <p className="text-gray-700 text-base mb-2">公開日: {new Date(article.publishedAt).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-xs mb-2">{article.content.slice(0, 100)}...</p>
                  <p className="text-base mb-1">{article.category.name}</p>
                  <Link href={`/blog/${article.id}`} className="text-blue-400 hover:underline">
                    続きを読む →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 p-6 border-t md:border-t-0 md:border-l border-gray-300"> 
          <h3 className="text-2xl font-semibold mb-4">カテゴリ</h3>
          <ul className="space-y-2">
            <li className="p-2 bg-white shadow rounded-lg text-center">プログラミング</li>
            <li className="p-2 bg-white shadow rounded-lg text-center">CG / UE5</li>
            <li className="p-2 bg-white shadow rounded-lg text-center">開発メモ</li>
          </ul>
          <h3 className="text-2xl font-semibold mt-6 mb-4">月別アーカイブ</h3>
          <ul className="space-y-2">
            <li className="p-2 bg-white shadow rounded-lg text-center">2025年3月</li>
            <li className="p-2 bg-white shadow rounded-lg text-center">2025年2月</li>
            <li className="p-2 bg-white shadow rounded-lg text-center">2025年1月</li>
          </ul>
        </aside>
      </div>
      <footer className="text-center py-6 border-t border-gray-300">
        <div className="mt-4">
          <Link href="/contact" className="text-blue-400 hover:underline mr-4">お問い合わせ</Link>
          <Link href="/privacy-policy" className="text-blue-400 hover:underline mr-4">プライバシーポリシー</Link>
          <Link href="/disclaimer" className="text-blue-400 hover:underline">免責事項</Link>
        </div>
        <div className="mt-4 text-gray-500">© 2025 どげんせTechログ</div>
      </footer>
    </div>
  );
}