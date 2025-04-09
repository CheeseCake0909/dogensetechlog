"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";

interface HonbunBlock {
  fieldId: string;
  richEditor?: string;
  HTML?: string;
}

interface Article {
  id: string;
  title: string;
  honbun: HonbunBlock[];
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
      <Header />
      <BackGround />
      <div className="container lg:~w-[60rem]/[80rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
        <main className="flex-1 bg-white dark:bg-neutral-800 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px]">
          <article className="max-w-4xl mx-auto p-6">
            {article.thumbnail && (
              <Image src={article.thumbnail.url} alt={article.title} width={800} height={400} className="w-full rounded-md mb-6" />
            )}
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{article.title}</h2>
            <p className="text-gray-700 text-sm dark:text-gray-400">
              公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="text-base font-semibold text-gray-500 mb-4 dark:text-gray-400">カテゴリ: {article.category.name}</p>
            <div className="prose max-w-full dark:prose-invert">
              {article.honbun?.map((block, index) => {
                if (block.fieldId === "richEditor" && block.richEditor) {
                  return (
                    <div key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.richEditor) }} />
                  );
                }
                if (block.fieldId === "HTML" && block.HTML) {
                  return (
                    <div
                      key={index}
                      className="my-6 w-full aspect-video relative overflow-hidden rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(block.HTML, {
                          ADD_TAGS: ["iframe"],
                          ADD_ATTR: ["allowfullscreen", "scrolling"]
                        })
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
          </article>
          <div className="border-b my-8"></div>
          <div className="max-w-4xl mx-auto p-2">
            <div className="flex justify-between">
              {prevArticle ? (
                <Link href={`/article/${prevArticle.id}`} className="text-black hover:text-neutral-300 dark:text-white dark:hover:text-neutral-500 duration-500">
                  &lt;&lt; {prevArticle.title}
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link href={`/article/${nextArticle.id}`} className="text-black hover:text-neutral-300 dark:text-white dark:hover:text-neutral-500 duration-500">
                  {nextArticle.title} &gt;&gt;
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </main>
        <Side />
      </div>
      <Footer />
    </div>
  );
}
