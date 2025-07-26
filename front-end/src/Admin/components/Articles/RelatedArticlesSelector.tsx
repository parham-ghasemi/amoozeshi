import { useState } from "react";
import type { ArticleShort } from "types/article";

type Props = {
  allArticles: ArticleShort[];
  relatedArticles: string[];
  setRelatedArticles: React.Dispatch<React.SetStateAction<string[]>>;
};

export function RelatedArticlesSelector({
  allArticles,
  relatedArticles,
  setRelatedArticles,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleArticle = (id: string) => {
    setRelatedArticles((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  // Filter articles by title (case insensitive)
  const filteredArticles = allArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 border p-5 rounded-lg" dir="rtl">
      <label className="block text-gray-800 font-semibold text-sm">
        مقاله های مشابه را انتخاب کنید
      </label>

      {/* Search input */}
      <input
        type="text"
        placeholder="سرچ مقاله بر اساس عنوان"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredArticles.map((article) => {
          const isSelected = relatedArticles.includes(article._id);
          return (
            <div
              key={article._id}
              onClick={() => toggleArticle(article._id)}
              className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                ${isSelected
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {article.description || "No description"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
