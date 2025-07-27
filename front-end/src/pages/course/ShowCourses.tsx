import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import CourseCard from '@/components/cards/CourseCard';
import CourseSearchBox from './course-search/CourseSearchBox';
import type { CourseShort } from 'types/course';

interface Category {
  _id: string;
  name: string;
}

const fetchMostPopular = async (): Promise<CourseShort[]> =>
  (await fetch('http://localhost:3000/courses/most-popular')).json();

const fetchNewest = async (): Promise<CourseShort[]> =>
  (await fetch('http://localhost:3000/courses/newest')).json();

const fetchCategories = async (): Promise<Category[]> =>
  (await fetch('http://localhost:3000/categories')).json().then(res => res.categories);

const fetchCategoryCourses = async (categoryId: string): Promise<CourseShort[]> =>
  (await fetch(`http://localhost:3000/courses/category/${categoryId}`)).json();

const fetchAllCourses = async (): Promise<CourseShort[]> =>
  (await fetch('http://localhost:3000/courses')).json();

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

  // Initialize selected category + fetch categoryCourses when categories arrive
  if (!selectedCategory && categoriesLoaded && categories.length > 0) {
    setSelectedCategory(categories[0]);
  }

  const isCollapsed = expandedSection !== null || showAllCourses;

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center pt-16">
      {!isCollapsed && <CourseSearchBox />}

      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16" dir="rtl">
        {(expandedSection === 'popular' || !isCollapsed) && (
          <Section
            title="محبوب‌ترین دوره‌ها"
            courses={mostPopular}
            showAll={expandedSection === 'popular'}
            onShowAll={() => setExpandedSection('popular')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(expandedSection === 'newest' || !isCollapsed) && (
          <Section
            title="جدیدترین دوره‌ها"
            courses={newest}
            showAll={expandedSection === 'newest'}
            onShowAll={() => setExpandedSection('newest')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {selectedCategory && (expandedSection === 'category' || !isCollapsed) && (
          <Section
            title={`دوره‌های ${selectedCategory.name}`}
            courses={categoryCourses}
            showAll={expandedSection === 'category'}
            onShowAll={() => setExpandedSection('category')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {showAllCourses && (
          <Section
            title="همه دوره‌ها"
            courses={allCourses}
            showAll={true}
            onShowAll={() => { }}
            onBack={() => setShowAllCourses(false)}
          />
        )}

        {!isCollapsed && (
          <button
            onClick={() => fetchAll()}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
          >
            نمایش همه دوره‌ها
          </button>
        )}
      </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayedCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default ShowCourses;
