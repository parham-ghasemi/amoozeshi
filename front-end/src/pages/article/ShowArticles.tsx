import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  if (loadingViewed || loadingNewest || loadingCategories || loadingCategoryArticles) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-20"
      >
        در حال بارگذاری...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col gap-15 items-center pt-16"
    >
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleSearchBox />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16"
        dir="rtl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
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
              onShowAll={() => {}}
              onBack={() => setShowAllArticles(false)}
            />
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <motion.button
            onClick={handleShowAllArticles}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            مشاهده همه مقاله‌ها
          </motion.button>
        )}
      </motion.div>
    </motion.div>
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
    <motion.div
      className="flex flex-col gap-7"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <motion.p
          className="font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.p>

        {!showAll ? (
          <motion.p
            className="text-sm flex items-center gap-1 cursor-pointer hover:text-slate-700"
            onClick={onShowAll}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            مشاهده بیشتر
            <ChevronLeft size={17} />
          </motion.p>
        ) : (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-1 text-sm hover:text-rose-700 cursor-pointer"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            بازگشت
            <ChevronLeft size={18} />
          </motion.button>
        )}
      </div>

      {loading ? (
        <motion.p
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          در حال بارگذاری...
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {displayedArticles.map((article) => (
            <motion.div
              key={article._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ShowArticles;