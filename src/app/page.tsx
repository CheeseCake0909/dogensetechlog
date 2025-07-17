import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";

// --- 型定義 ---
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
  category: { id: string; name: string };
  publishedAt: string;
}

export default async function HomePage() {
  let articles: Article[] = [];

  try {
    const articleData = await client.get<{ contents: Article[] }>({ endpoint: "article" });
    articles = articleData.contents.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("記事の取得に失敗しました", error);
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <BackGround />
      <div className="container lg:~w-[60rem]/[75rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
        <main className="flex-1 dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px] duration-300">
          <h2 className="~text-xl/2xl font-normal ~py-4/7 text-[#171717] font-ElenaShine dark:text-white duration-300">Articles</h2>
          {articles.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">記事が見つかりませんでした。</p>
          ) : (
            <section className="grid lg:grid-cols-2 gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white shadow-lg dark:bg-neutral-700 rounded-md transition hover:bg-neutral-300 dark:hover:bg-neutral-400 duration-300"
                >
                  <Link href={`/article/${article.id}`} className="block">
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
                      <p className="text-gray-500 text-xs dark:text-gray-300 duration-300">
                        {Array.isArray(article.honbun)
                          ? (
                              article.honbun.find(
                                (block) => block.fieldId === "richEditor" && block.richEditor
                              )?.richEditor?.replace(/<[^>]+>/g, "").slice(0, 100) + "..."
                            ) || "本文がありません"
                          : "本文がありません"}
                      </p>
                    </div>
                  </Link>
                  <div className="mb-3 ml-3">
                    <Link
                      href={`/category/${article.category.id}`}
                      className="inline-block px-3 py-2 bg-white text-[#171717] shadow ~text-xs/sm rounded-lg dark:bg-neutral-700 dark:text-white cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors duration-300"
                    >
                      {article.category.name}
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
        <Side />
      </div>
      <Footer />
    </div>
  );
}
