"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData = await client.get({ endpoint: "article" });
        const sortedArticles = articleData.contents.sort(
          (a: { publishedAt: string }, b: { publishedAt: string }) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen relative">
      <Header/>
      <BackGround />
      <div className="container mx-auto px-6 flex flex-col lg:flex-row flex-1 relative z-10 mt-10 p-6">
        <main className="flex-1">
          <div className="dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px]">
            <h3 className="text-2xl font-medium py-7 text-[#171717] dark:text-white">記事一覧</h3>
            <section className="grid lg:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <div className="p-6 bg-white shadow-lg dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-400 transition-color duration-500">
                    {article.thumbnail && (
                      <Image
                        src={article.thumbnail.url}
                        alt={article.title}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                    )}
                    <h4 className="text-lg font-normal mb-1 text-[#171717] dark:text-white">{article.title}</h4>
                    <p className="text-gray-700 text-sm mb-2 dark:text-gray-300">
                      公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                    </p>
                    <p
                      className="text-gray-500 text-xs mb-2 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.slice(0, 100)) }}
                    ></p>
                    <p className="text-base text-[#171717] dark:text-gray-300">{article.category.name}</p>
                  </div>
                </Link>
              ))}
            </section>
          </div>
        </main>
        <Side/>
      </div>
      <Footer />
    </div>
  );
}
