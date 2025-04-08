"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
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
  publishedAt: string;
  category: { name: string };
}

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = Array.isArray(id) ? id[0] : id;
  const [article, setArticle] = useState<Article | null>(null);
  const [prevArticle, setPrevArticle] = useState<{ id: string; title: string } | null>(null);
  const [nextArticle, setNextArticle] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      try {
        const data = await client.get({ endpoint: "article", contentId: articleId });
        setArticle(data);
        fetchAdjacentArticles(data.publishedAt);
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
      }
    };

    const fetchAdjacentArticles = async (publishedAt: string) => {
      try {
        const prevData = await client.get({
          endpoint: "article",
          queries: { filters: `publishedAt[less_than]${publishedAt}`, orders: "-publishedAt", limit: 1 },
        });
        const nextData = await client.get({
          endpoint: "article",
          queries: { filters: `publishedAt[greater_than]${publishedAt}`, orders: "publishedAt", limit: 1 },
        });

        setPrevArticle(prevData.contents.length > 0 ? prevData.contents[0] : null);
        setNextArticle(nextData.contents.length > 0 ? nextData.contents[0] : null);
      } catch (error) {
        console.error("前後の記事の取得に失敗しました", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div className="text-center py-10">記事が見つかりませんでした。</div>;
  }

  return (
    <div className="min-h-screen relative">
      <Header/>
      <BackGround/>
      <div className="container mx-auto px-6 flex flex-col lg:flex-row flex-1 relative z-10">
        <main className="flex-1 p-6">
          <article className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
            {article.thumbnail && (
              <Image src={article.thumbnail.url} alt={article.title} width={800} height={400} className="w-full rounded-md mb-6" />
            )}
            <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
            <p className="text-gray-700 text-sm mb-4 dark:text-gray-400">
              公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="text-base font-semibold text-gray-500 mb-4 dark:text-gray-400">カテゴリ: {article.category.name}</p>
            <div className="prose max-w-full dark:prose-invert">
              {parse(article.content)}
            </div>
          </article>
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg">
            <div className="flex justify-between">
              {prevArticle ? (
                <Link href={`/article/${prevArticle.id}`} className="text-blue-500 hover:underline">
                  ← {prevArticle.title}
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link href={`/article/${nextArticle.id}`} className="text-blue-500 hover:underline">
                  {nextArticle.title} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </main>
        <Side/>
      </div>
      <Footer/>
    </div>
  );
}