import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import ArticleSearchBox from "./article-search/ArticleSearchBox";
import ArticleCard from "@/components/cards/ArticleCard";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

const fetchMostViewed = () => axios.get("http://localhost:3000/articles/most-viewed").then(res => res.data);
const fetchNewest = () => axios.get("http://localhost:3000/articles/newest").then(res => res.data);
const fetchCategories = () => axios.get("http://localhost:3000/categories").then(res => res.data.categories);
const fetchArticlesByCategory = (id: string) => axios.get(`http://localhost:3000/articles/category/${id}`).then(res => res.data);
const fetchAllArticles = () => axios.get("http://localhost:3000/articles").then(res => res.data);

const ShowArticles = () => {
  const [expandedSection, setExpandedSection] = useState<null | "viewed" | "newest" | "category">(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllArticles, setShowAllArticles] = useState(false);

  const isCollapsed = expandedSection !== null || showAllArticles;

  const { data: mostViewed = [], isLoading: loadingViewed } = useQuery({
    queryKey: ["articles", "mostViewed"],
    queryFn: fetchMostViewed,
  });

  const { data: newest = [], isLoading: loadingNewest } = useQuery({
    queryKey: ["articles", "newest"],
    queryFn: fetchNewest,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);


  const {
    data: categoryArticles = [],
    isLoading: loadingCategoryArticles,
  } = useQuery({
    queryKey: ["articles", "category", selectedCategory?._id],
    queryFn: () => fetchArticlesByCategory(selectedCategory!._id),
    enabled: !!selectedCategory,
  });

  const {
    data: allArticles = [],
    isLoading: loadingAllArticles,
    refetch: refetchAllArticles,
  } = useQuery({
    queryKey: ["articles", "all"],
    queryFn: fetchAllArticles,
    enabled: false,
  });

  const handleShowAllArticles = async () => {
    await refetchAllArticles();
    setShowAllArticles(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center pt-16">
      {!isCollapsed && <ArticleSearchBox />}

      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16" dir="rtl">
        {(expandedSection === "viewed" || !isCollapsed) && (
          <Section
            title="مقاله‌های پربازدید"
            articles={mostViewed}
            loading={loadingViewed}
            showAll={expandedSection === "viewed"}
            onShowAll={() => setExpandedSection("viewed")}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(expandedSection === "newest" || !isCollapsed) && (
          <Section
            title="جدیدترین مقاله‌ها"
            articles={newest}
            loading={loadingNewest}
            showAll={expandedSection === "newest"}
            onShowAll={() => setExpandedSection("newest")}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {selectedCategory && (expandedSection === "category" || !isCollapsed) && (
          <Section
            title={`مقاله‌های ${selectedCategory.name}`}
            articles={categoryArticles}
            loading={loadingCategoryArticles}
            showAll={expandedSection === "category"}
            onShowAll={() => setExpandedSection("category")}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {showAllArticles && (
          <Section
            title="همه مقاله‌ها"
            articles={allArticles}
            loading={loadingAllArticles}
            showAll={true}
            onShowAll={() => { }}
            onBack={() => setShowAllArticles(false)}
          />
        )}

        {!isCollapsed && (
          <button
            onClick={handleShowAllArticles}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
          >
            مشاهده همه مقاله‌ها
          </button>
        )}
      </div>
    </div>
  );
};

const Section = ({
  title,
  articles,
  loading,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string;
  articles: any[];
  loading: boolean;
  showAll: boolean;
  onShowAll: () => void;
  onBack: () => void;
}) => {
  const displayedArticles = showAll ? articles : articles.slice(0, 4);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">{title}</p>

        {!showAll ? (
          <p className="text-sm flex items-center gap-1 cursor-pointer hover:text-slate-700" onClick={onShowAll}>
            مشاهده بیشتر
            <ChevronLeft size={17} />
          </p>
        ) : (
          <button onClick={onBack} className="flex items-center gap-1 text-sm hover:text-rose-700 cursor-pointer">
            بازگشت
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowArticles;
