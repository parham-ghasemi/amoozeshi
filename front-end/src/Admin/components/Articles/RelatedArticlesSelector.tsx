
type Article = {
  _id: string;
  title: string;
};

type Props = {
  allArticles: Article[];
  relatedArticles: string[];
  setRelatedArticles: React.Dispatch<React.SetStateAction<string[]>>; 
  excludeTitle?: string;
};

export function RelatedArticlesSelector({
  allArticles,
  relatedArticles,
  setRelatedArticles,
  excludeTitle,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-gray-800 font-semibold text-sm">Related Articles</label>
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
        {allArticles
          .filter((a) => a.title !== excludeTitle)
          .map((article) => (
            <div key={article._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={article._id}
                value={article._id}
                checked={relatedArticles.includes(article._id)}
                onChange={(e) => {
                  const value = e.target.value as string;
                  const checked = e.target.checked;

                  setRelatedArticles((prev: string[]) =>
                    checked ? [...prev, value] : prev.filter((id) => id !== value)
                  );
                }}

                className="w-4 h-4 accent-blue-600 rounded"
              />
              <label htmlFor={article._id} className="text-gray-700 text-sm">
                {article.title}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
}
