import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CounselCard from "@/components/cards/CounselCard";
import axios from "axios";
import CounselSearchBox from "./counsel-search/CounselSearchBox";

interface Category {
  _id: string;
  name: string;
}

const fetchMostViewed = () => axios.get("/api/counsels/most-viewed").then(res => res.data);
const fetchNewest = () => axios.get("/api/counsels/newest").then(res => res.data);
const fetchCategories = () => axios.get("/api/categories").then(res => res.data.categories);
const fetchCounselsByCategory = (id: string) => axios.get(`/api/counsels/category/${id}`).then(res => res.data);
const fetchAllCounsels = () => axios.get("/api/counsels").then(res => res.data);

const ShowCounsels = () => {
  const [expandedSection, setExpandedSection] = useState<null | "viewed" | "newest" | "category">(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllCounsels, setShowAllCounsels] = useState(false);

  const isCollapsed = expandedSection !== null || showAllCounsels;

  const { data: mostViewed = [], isLoading: loadingViewed } = useQuery({
    queryKey: ["counsels", "mostViewed"],
    queryFn: fetchMostViewed,
  });

  const { data: newest = [], isLoading: loadingNewest } = useQuery({
    queryKey: ["counsels", "newest"],
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
    data: categoryCounsels = [],
    isLoading: loadingCategoryCounsels,
  } = useQuery({
    queryKey: ["counsels", "category", selectedCategory?._id],
    queryFn: () => fetchCounselsByCategory(selectedCategory!._id),
    enabled: !!selectedCategory,
  });

  const {
    data: allCounsels = [],
    isLoading: loadingAllCounsels,
    refetch: refetchAllCounsels,
  } = useQuery({
    queryKey: ["counsels", "all"],
    queryFn: fetchAllCounsels,
    enabled: false,
  });

  const handleShowAllCounsels = async () => {
    await refetchAllCounsels();
    setShowAllCounsels(true);
  };

  if (loadingViewed || loadingNewest || loadingCategories || loadingCategoryCounsels) {
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
      className="min-h-screen w-full flex flex-col gap-10 items-center pt-16 px-4 sm:px-6 lg:px-12"
    >
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <CounselSearchBox />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-7xl bg-slate-50 rounded-2xl flex flex-col gap-10 p-6 sm:p-10 md:p-12 lg:p-16"
        dir="rtl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {(expandedSection === "viewed" || !isCollapsed) && (
            <Section
              title="مشاوره‌های پربازدید"
              counsels={mostViewed}
              loading={loadingViewed}
              showAll={expandedSection === "viewed"}
              onShowAll={() => setExpandedSection("viewed")}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {(expandedSection === "newest" || !isCollapsed) && (
            <Section
              title="جدیدترین مشاوره‌ها"
              counsels={newest}
              loading={loadingNewest}
              showAll={expandedSection === "newest"}
              onShowAll={() => setExpandedSection("newest")}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {selectedCategory && (expandedSection === "category" || !isCollapsed) && (
            <Section
              title={`مشاوره‌های ${selectedCategory.name}`}
              counsels={categoryCounsels}
              loading={loadingCategoryCounsels}
              showAll={expandedSection === "category"}
              onShowAll={() => setExpandedSection("category")}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {showAllCounsels && (
            <Section
              title="همه مشاوره‌ها"
              counsels={allCounsels}
              loading={loadingAllCounsels}
              showAll={true}
              onShowAll={() => { }}
              onBack={() => setShowAllCounsels(false)}
            />
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <motion.button
            onClick={handleShowAllCounsels}
            className="mt-6 sm:mt-10 mb-16 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            مشاهده همه مشاوره‌ها
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

const Section = ({
  title,
  counsels,
  loading,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string;
  counsels: any[];
  loading: boolean;
  showAll: boolean;
  onShowAll: () => void;
  onBack: () => void;
}) => {
  const displayedCounsels = showAll ? counsels : counsels.slice(0, 4);

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <motion.p
          className="font-bold text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.p>

        {!showAll ? (
          <motion.p
            className="text-xs sm:text-sm flex items-center gap-1 cursor-pointer hover:text-slate-700"
            onClick={onShowAll}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            مشاهده بیشتر
            <ChevronLeft size={16} />
          </motion.p>
        ) : (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-1 text-xs sm:text-sm hover:text-rose-700 cursor-pointer"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            بازگشت
            <ChevronLeft size={17} />
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
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {displayedCounsels.map((counsel) => (
            <motion.div
              key={counsel._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <CounselCard counsel={counsel} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ShowCounsels;