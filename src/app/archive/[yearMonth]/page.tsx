"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";

/* const MICROCMS_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY; */

interface Article {
    id: string;
    title: string;
    content: string;
    thumbnail?: { url: string };
    publishedAt: string;
  }

export default function ArchivePage() {
  const { yearMonth } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await client.get({
          endpoint: "article",
          queries: { filters: `publishedAt[begins_with]${yearMonth}` },
        });
        setArticles(data.contents);
      } catch (error) {
        console.error("アーカイブ記事の取得に失敗しました", error);
      }
    };

    fetchArticles();
  }, [yearMonth]);

  return (
    <div className="min-h-screen relative">
      <Header/>
      <BackGround/>
      <div className="container mx-auto px-6 flex flex-col lg:flex-row flex-1 relative z-10">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mt-6">{yearMonth} の記事一覧</h2>
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
          {articles.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">この月には記事がありません。</p>}
        </section>
      </main>
      <Side/>
      </div>
      <Footer />
    </div>
  );
}
