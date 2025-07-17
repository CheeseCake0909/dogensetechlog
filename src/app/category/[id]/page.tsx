import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import BackGround from "@/components/background";
import Footer from "@/components/footer";
import Side from "@/components/side";
import { client } from "@/libs/client";

interface Article {
  id: string;
  title: string;
  honbun: string;
  thumbnail?: { url: string };
  category: { id: string; name: string };
  publishedAt: string;
}

interface Category {
  id: string;
  name: string;
}

// カテゴリデータ取得
async function getCategory(id: string): Promise<Category> {
  try {
    const data = await client.get({ endpoint: "category", contentId: id });
    return data;
  } catch {
    notFound();
  }
}

// カテゴリの記事一覧取得
async function getArticlesByCategory(id: string): Promise<Article[]> {
  const data = await client.get({
    endpoint: "article",
    queries: { filters: `category[equals]${id}` },
  });

  return data.contents.sort(
    (a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Metadata設定（任意・必要なら追加）
export async function generateMetadata({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id);
  return {
    title: `${category.name}の記事一覧 | Dogense Tech Log`,
    description: `${category.name}カテゴリに含まれる記事一覧ページです。`,
  };
}

// メインコンポーネント
export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id);
  const articles = await getArticlesByCategory(params.id);

  return (
    <div className="min-h-screen relative">
      <Header />
      <BackGround />
      <div className="container lg:~w-[60rem]/[75rem] mx-auto md:flex relative z-10 mt-10 p-6 min-h-[80vh]">
        <main className="flex-1 dark:bg-opacity-60 border dark:border-neutral-600 px-8 py-2 pb-10 mb-10 shadow rounded-lg backdrop-blur-[2px] duration-300">
          <h2 className="~text-xl/2xl font-normal ~py-4/7 text-[#171717] dark:text-white duration-300">
            {category.name}の記事一覧
          </h2>

          {articles.length === 0 ? (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 col-span-2 duration-500">
              該当する記事は見つかりませんでした。
            </p>
          ) : (
            <section className="grid lg:grid-cols-2 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="group bg-white shadow-lg dark:bg-neutral-700 rounded-md transition hover:bg-neutral-300 dark:hover:bg-neutral-400 duration-300">
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
                      {article.honbun.replace(/<[^>]+>/g, "").slice(0, 100)}...
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
