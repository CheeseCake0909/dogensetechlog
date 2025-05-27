import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";
import HonbunRenderer from "@/components/HonbunRenderer";
import { notFound } from "next/navigation";

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

interface AdjacentArticle {
  id: string;
  title: string;
}

async function getArticle(id: string): Promise<Article> {
  try {
    const data = await client.get({ endpoint: "article", contentId: id });
    return data;
  } catch {
    notFound();
  }
}

async function getAdjacentArticles(publishedAt: string): Promise<{
  prevArticle: AdjacentArticle | null;
  nextArticle: AdjacentArticle | null;
}> {
  const [prevData, nextData] = await Promise.all([
    client.get({
      endpoint: "article",
      queries: { filters: `publishedAt[less_than]${publishedAt}`, orders: "-publishedAt", limit: 1 },
    }),
    client.get({
      endpoint: "article",
      queries: { filters: `publishedAt[greater_than]${publishedAt}`, orders: "publishedAt", limit: 1 },
    }),
  ]);

  return {
    prevArticle: prevData.contents[0] || null,
    nextArticle: nextData.contents[0] || null,
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getArticle(params.id);
  return {
    title: `${data.title} | Dogense Tech Log`,
    description: `${data.title} の記事ページです`,
    openGraph: {
      title: data.title,
      description: `${data.title} の記事ページです`,
      images: data.thumbnail ? [data.thumbnail.url] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  const { prevArticle, nextArticle } = await getAdjacentArticles(article.publishedAt);

  return (
    <div className="min-h-screen relative">
      <Header />
      <BackGround />
      <div className="container lg:~w-[60rem]/[75rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
        <main className="flex-1 bg-white dark:bg-neutral-800 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px] duration-300">
          <article className="max-w-4xl mx-auto p-6">
            {article.thumbnail && (
              <Image src={article.thumbnail.url} alt={article.title} width={800} height={400} className="w-full rounded-md mb-6" />
            )}
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white duration-300">{article.title}</h2>
            <p className="text-gray-700 text-sm dark:text-gray-400 duration-300">
              公開日: {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="text-base font-semibold text-gray-500 mb-4 dark:text-gray-400 duration-300">カテゴリ: {article.category.name}</p>
            <HonbunRenderer honbun={article.honbun} />
          </article>
          <div className="border-b my-8"></div>
          <div className="max-w-4xl mx-auto p-2">
            <div className="flex justify-between">
              {prevArticle ? (
                <Link
                  href={`/article/${prevArticle.id}`}
                  className="text-black hover:text-neutral-300 dark:text-white dark:hover:text-neutral-500 duration-300"
                >
                  &lt;&lt; {prevArticle.title}
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link
                  href={`/article/${nextArticle.id}`}
                  className="text-black hover:text-neutral-300 dark:text-white dark:hover:text-neutral-500 duration-300"
                >
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
