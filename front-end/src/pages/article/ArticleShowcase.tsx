import ArticleCard from "@/components/cards/ArticleCard";
import { SquareCheck, SquareX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ArticleShort, Article } from "types/article";

const ArticleShowcase = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article>();
  const [relatedArticles, setRelatedArticles] = useState<ArticleShort[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/article/${id}`);
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
          const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

          return (
            <Tag key={index} className="font-semibold text-gray-800 my-2 sm:my-4 text-lg sm:text-xl">
              {block.data.text}
            </Tag>
          );
        }

        case "paragraph":
          return (
            <p
              key={index}
              className="text-gray-700 leading-7 my-1 sm:my-2 text-sm sm:text-base"
            >
              {block.data.text}
            </p>
          );

        case "list":
          if (block.data.style === "unordered") {
            return (
              <ul key={index} className="list-disc pr-4 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ul>
            );
          } else if (block.data.style === "ordered") {
            return (
              <ol key={index} className="list-decimal pr-4 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ol>
            );
          } else if (block.data.style === "checklist") {
            return (
              <ol key={index} className="pr-4 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    {item.meta.checked ? (
                      <SquareCheck className="text-green-500 mt-0.5 w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <SquareX className="text-rose-600 mt-0.5 w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ol>
            );
          } else {
            return (
              <p className="text-red-500 text-center text-xs sm:text-sm">
                AN ERROR OCCURRED
                <br />
                <span className="text-red-400 text-[10px] sm:text-xs">this text couldn't be rendered</span>
              </p>
            );
          }

        case "image":
          return (
            <div key={index} className="my-2 sm:my-4 self-center w-full">
              <img
                src={block.data.file?.url}
                alt={block.data.caption || "Image"}
                className="rounded-lg w-full max-w-[90%] sm:max-w-[800px] mx-auto"
              />
              {block.data.caption && (
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">{block.data.caption}</p>
              )}
            </div>
          );

        default:
          return null;
      }
    });
  };

  if (loading) return <div className="p-4 sm:p-6 text-center text-sm sm:text-base">Loading...</div>;
  if (!article) return <div className="p-4 sm:p-6 text-center text-sm sm:text-base">Article not found.</div>;

  return (
    <div className="w-full max-w-[90%] lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-6 flex items-center justify-center flex-col min-h-screen">
      <div className="absolute top-0 left-0 right-0 opacity-20 -z-10">
        <img src={article.thumbnail} alt="thumbnail" className="w-full h-auto object-cover" />
        <div className="relative z-10 w-full h-full -translate-y-[50vh] sm:-translate-y-96">
          <div className="bg-gradient-to-t from-[#f1f1f1] h-[50vh] sm:h-96 from-0% absolute top-0 left-0 right-0 z-[-1]"></div>
        </div>
      </div>

      <h1 className="max-w-[90%] sm:max-w-[600px] wrap-anywhere text-center text-2xl sm:text-3xl font-bold leading-[150%]">
        {article.title}
      </h1>
      <h2 className="text-base sm:text-lg font-normal max-w-[90%] sm:max-w-[700px] wrap-anywhere text-center" dir="rtl">
        {article.description}
      </h2>
      <div className="min-h-[200px] sm:min-h-[300px] bg-gray-50 p-4 sm:p-6 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
        {renderEditorContent(article.content)}
      </div>
      {article.related && article.related.length > 0 && (
        <div className="min-h-[200px] sm:min-h-[300px] bg-gray-50 py-6 sm:py-10 px-4 sm:px-10 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
          <h1 className="text-lg sm:text-xl font-bold mb-6 sm:mb-10">مقالات مشابه</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles?.map((relatedArticle, index) => (
              <ArticleCard key={`relatedArticle-${index}`} article={relatedArticle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleShowcase;