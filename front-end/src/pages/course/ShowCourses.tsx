import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '@/components/cards/CourseCard';
import CourseSearchBox from './course-search/CourseSearchBox';
import type { CourseShort } from 'types/course';

interface Category {
  _id: string;
  name: string;
}

// Fetchers
const fetchMostPopular = async (): Promise<CourseShort[]> =>
  (await fetch('/api/courses/most-popular')).json();

const fetchNewest = async (): Promise<CourseShort[]> =>
  (await fetch('/api/courses/newest')).json();

const fetchCategories = async (): Promise<Category[]> =>
  (await fetch('/api/categories')).json().then(res => res.categories);

const fetchCategoryCourses = async (categoryId: string): Promise<CourseShort[]> =>
  (await fetch(`/api/courses/category/${categoryId}`)).json();

const fetchAllCourses = async (): Promise<CourseShort[]> =>
  (await fetch('/api/courses')).json();

const ShowCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedSection, setExpandedSection] = useState<null | 'popular' | 'newest' | 'category'>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const { data: mostPopular = [] } = useQuery({ queryKey: ['mostPopularCourses'], queryFn: fetchMostPopular });
  const { data: newest = [] } = useQuery({ queryKey: ['newestCourses'], queryFn: fetchNewest });
  const { data: categories = [], isSuccess: categoriesLoaded } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const {
    data: categoryCourses = [],
    refetch: refetchCategoryCourses,
  } = useQuery({
    queryKey: ['categoryCourses', selectedCategory?._id],
    queryFn: () => fetchCategoryCourses(selectedCategory!._id),
    enabled: !!selectedCategory,
  });

  const {
    mutate: fetchAll,
    data: allCourses = [],
  } = useMutation({
    mutationFn: fetchAllCourses,
    onSuccess: () => setShowAllCourses(true),
  });

  // Initialize selected category
  if (!selectedCategory && categoriesLoaded && categories.length > 0) {
    setSelectedCategory(categories[0]);
  }

  const isCollapsed = expandedSection !== null || showAllCourses;

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center pt-16">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="searchbox"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CourseSearchBox />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16"
        dir="rtl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {(expandedSection === 'popular' || !isCollapsed) && (
            <Section
              key="popular"
              title="محبوب‌ترین دوره‌ها"
              courses={mostPopular}
              showAll={expandedSection === 'popular'}
              onShowAll={() => setExpandedSection('popular')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {(expandedSection === 'newest' || !isCollapsed) && (
            <Section
              key="newest"
              title="جدیدترین دوره‌ها"
              courses={newest}
              showAll={expandedSection === 'newest'}
              onShowAll={() => setExpandedSection('newest')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {selectedCategory && (expandedSection === 'category' || !isCollapsed) && (
            <Section
              key="category"
              title={`دوره‌های ${selectedCategory.name}`}
              courses={categoryCourses}
              showAll={expandedSection === 'category'}
              onShowAll={() => setExpandedSection('category')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {showAllCourses && (
            <Section
              key="allcourses"
              title="همه دوره‌ها"
              courses={allCourses}
              showAll={true}
              onShowAll={() => { }}
              onBack={() => setShowAllCourses(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              key="showallbtn"
              onClick={() => fetchAll()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
            >
              نمایش همه دوره‌ها
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Section = ({
  title,
  courses,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string;
  courses: any[];
  showAll: boolean;
  onShowAll: () => void;
  onBack: () => void;
}) => {
  const displayedCourses = showAll ? courses : courses.slice(0, 4);

  return (
    <motion.div
      className="flex flex-col gap-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">{title}</p>

        {!showAll ? (
          <p
            className="text-sm flex items-center gap-1 cursor-pointer hover:text-slate-700"
            onClick={onShowAll}
          >
            مشاهده بیشتر
            <ChevronLeft size={17} />
          </p>
        ) : (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm hover:text-rose-700 cursor-pointer"
          >
            بازگشت
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07 },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {displayedCourses.map((course) => (
          <motion.div
            key={course._id}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.25 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ShowCourses;
