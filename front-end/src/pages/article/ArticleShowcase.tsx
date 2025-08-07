import ArticleCard from "@/components/cards/ArticleCard";
import { Heart, HeartCrack, SquareCheck, SquareX } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ArticleShort, Article } from "types/article";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import authAxios from "@/lib/authAxios";

const fetchArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`http://localhost:3000/article/${id}`);
  const data = await res.json();
  return data.article;
};

const fetchRelatedArticles = async (relatedIds: string[]): Promise<ArticleShort[]> => {
  const articles = await Promise.all(
    relatedIds.map(async (relatedId) => {
      const res = await fetch(`http://localhost:3000/articles/short/${relatedId}`);
      const data = await res.json();
      return data.articleObject;
    })
  );
  return articles;
};

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await authAxios.get(`/user/me`);
    return res.data;
  } catch {
    return false;
  }
}

const ArticleShowcase = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: article,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });

  const {
    data: currentUser,
  } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
    enabled: !!localStorage.getItem("token"),
  });
  // @ts-ignore
  const isFavorited = currentUser?.favoriteArticles?.some(a => a._id === id);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/user/favorite/article/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در افزودن مقاله به علاقه‌مندی‌ها");
      return data;
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["me"]);
    },
    onError: (err: any) => {
      toast.error(err.message || "مشکلی در تغییر وضعیت علاقه‌مندی پیش آمد");
    },
  });

  const {
    data: relatedArticles,
    isLoading: isRelatedLoading,
    isError: isRelatedError,
  } = useQuery<ArticleShort[]>({
    queryKey: ["relatedArticles", article?.related],
    queryFn: () => fetchRelatedArticles(article?.related || []),
    enabled: !!article?.related?.length,
  });

  const renderEditorContent = (content: any) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header": {
          const level = Math.min(Math.max(block.data.level, 1), 6);
          const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
          return (
            <Tag
              key={index}
              className={`font-bold text-gray-900 my-4 sm:my-6 text-${level === 1 ? "2xl" : level === 2 ? "xl" : "lg"}`}
            >
              {block.data.text}
            </Tag>
          );
        }
        case "paragraph":
          return (
            <p key={index} className="text-gray-800 leading-relaxed my-3 text-base sm:text-lg">
              {block.data.text}
            </p>
          );
        case "list":
          if (block.data.style === "unordered") {
            return (
              <ul key={index} className="list-disc pr-6 my-3 space-y-2 text-gray-800 text-base sm:text-lg">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ul>
            );
          } else if (block.data.style === "ordered") {
            return (
              <ol key={index} className="list-decimal pr-6 my-3 space-y-2 text-gray-800 text-base sm:text-lg">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ol>
            );
          } else if (block.data.style === "checklist") {
            return (
              <ol key={index} className="pr-6 my-3 space-y-2 text-gray-800 text-base sm:text-lg">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    {item.meta.checked ? (
                      <SquareCheck className="text-green-600 w-5 h-5" />
                    ) : (
                      <SquareX className="text-red-600 w-5 h-5" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <p className="text-red-600 text-center text-sm">Error: Unable to render this content.</p>
          );
        case "image":
          return (
            <motion.div
              key={index}
              className="my-6 w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={block.data.file?.url}
                alt={block.data.caption || "Article Image"}
                className="rounded-lg w-full object-cover"
              />
              {block.data.caption && (
                <p className="text-center text-sm text-gray-600 mt-2">{block.data.caption}</p>
              )}
            </motion.div>
          );
        default:
          return null;
      }
    });
  };

  if (isArticleLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
        Loading article...
      </div>
    );
  if (isArticleError || !article)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-600">
        Article not found.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Image with Frosted Glass Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={article.thumbnail}
          alt="Article background"
          className="w-full h-full object-cover opacity-10 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
      </div>
      {currentUser &&
        <button
          onClick={() => toggleFavoriteMutation.mutate()}
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-md flex items-center gap-2 text-sm font-medium cursor-pointer ${isFavorited ? "bg-red-600 text-white hover:bg-red-800" : "bg-white text-red-600 border border-red-600 hover:bg-red-200"
            }`}
        >
          {isFavorited ? <HeartCrack size={20} /> : <Heart size={20} fill="#dc2626" />}
          <span>{isFavorited ? " حذف از علاقه‌مندی‌ها" : "️ افزودن به علاقه‌مندی‌ها"}</span>
        </button>
      }


      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg sm:text-lg text-gray-700 max-w-3xl mx-auto" dir="rtl">
            {article.description}
          </p>
        </motion.div>

        {/* Article Content */}
        <motion.div
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          dir="rtl"
        >
          {renderEditorContent(article.content)}
        </motion.div>

        {/* Related Articles */}
        {article.related?.length > 0 && (
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            dir="rtl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالات مشابه</h2>
            {isRelatedLoading ? (
              <p className="text-center text-lg text-gray-700">Loading related articles...</p>
            ) : isRelatedError ? (
              <p className="text-center text-lg text-red-600">Failed to load related articles.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles?.map((relatedArticle, index) => (
                  <motion.div
                    key={`relatedArticle-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ArticleCard article={relatedArticle} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticleShowcase;