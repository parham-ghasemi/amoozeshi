import ArticleCard from "@/components/cards/ArticleCard";
import { SquareCheck, SquareX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ArticleShort, Article } from "types/article";

const ArticleShowcase = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article>();
  const [relatedArticles, setRelatedArticles] = useState<ArticleShort[]>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/articles/${id}`);
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!article?.related || article.related.length === 0) return;

      try {
        const articles: ArticleShort[] = await Promise.all(
          article.related.map(async (relatedArticleId) => {
            const res = await fetch(`http://localhost:3000/articles/short/${relatedArticleId}`);
            const data = await res.json();
            return data.articleObject;
          })
        );
        setRelatedArticles(articles);
      } catch (error: any) {
        console.error('Error fetching related articles:', error);
      }
    };

    fetchRelatedArticles();
  }, [article]);

  const renderEditorContent = (content: any) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header": {
          const level = Math.min(Math.max(block.data.level, 1), 6);
          const Tag = `h1${level}` as keyof React.JSX.IntrinsicElements;

          return (
            <Tag key={index} className="font-semibold text-gray-800 my-4">
              {block.data.text}
            </Tag>
          );
        }

        case "paragraph":
          return (
            <p
              key={index}
              className="text-gray-700 leading-7 my-2"
            >
              {block.data.text}
            </p>
          );

        case "list":
          if (block.data.style === "unordered") {
            return (
              <ul key={index} className="list-disc pr-6 my-2 space-y-1 text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ul>
            );
          } else if (block.data.style === "ordered") {
            return (
              <ol key={index} className="list-decimal pr-6 my-2 space-y-1 text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ol>
            );
          } else if (block.data.style === "checklist") {
            return (
              <ol key={index} className="pr-6 my-2 space-y-1 text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    {item.meta.checked ? (
                      <SquareCheck className="text-green-500 mt-0.5 w-5 h-5" />
                    ) : (
                      <SquareX className="text-rose-600 mt-0.5 w-5 h-5" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ol>
            );
          } else {
            return (
              <p className="text-red-500 text-center text-sm">
                AN ERROR OCCURED
                <br />
                <span className="text-red-400 text-xs">this text couldn't be rendered</span>
              </p>
            );
          }

        case "image":
          return (
            <div key={index} className="my-4 self-center">
              <img
                src={block.data.file?.url}
                alt={block.data.caption || "Image"}
                className="rounded-lg max-w-[800px]"

              />
              {block.data.caption && (
                <p className="text-center text-sm text-gray-500 mt-1">{block.data.caption}</p>
              )}
            </div>
          );

        default:
          return null;
      }
    });
  };



  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!article) return <div className="p-6 text-center">Article not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 flex items-center justify-center flex-col">
      <div className="absolute top-0 left-0 right-0 opacity-20 -z-10">
        <img src={article.thumbnail} alt="thumbnail" />
        <div className="relative z-10 w-full h-full -translate-y-96">
          <div className="bg-gradient-to-t from-[#f1f1f1] h-96 from-0% absolute top-0 left-0 right-0 z-[-1]"></div>
        </div>
      </div>

      <h1 className="max-w-[600px] wrap-anywhere text-center text-3xl/[150%] font-bold">{article.title}</h1>
      <h2 className="text-lg font-normal max-w-[700px] wrap-anywhere text-center text" dir="rtl">{article.description}</h2>
      <div className="min-h-[300px] bg-gray-50 p-4 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
        {renderEditorContent(article.content)}
      </div>
      {
        article.related && article.related.length > 0 && (
          <div className="min-h-[300px] bg-gray-50 py-10 px-10 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
            <h1 className="text-xl font-bold mb-10">مقالات مشابه</h1>
            <div className="grid grid-cols-3 gap-4">
              {
                relatedArticles?.map((relatedArticle, index) => (
                  <ArticleCard key={`relatedArticle-${index}`} article={relatedArticle} />
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ArticleShowcase;
