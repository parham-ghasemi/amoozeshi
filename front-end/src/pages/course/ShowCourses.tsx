import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import CourseCard from '@/components/cards/CourseCard'
import CourseSearchBox from './course-search/CourseSearchBox'
import type { CourseShort } from 'types/course'

interface Category {
  _id: string
  name: string
}

const ShowCourses = () => {
  const [mostPopular, setMostPopular] = useState<CourseShort[]>([])
  const [newest, setNewest] = useState<CourseShort[]>([])
  const [categoryCourses, setCategoryCourses] = useState<CourseShort[]>([])
  const [allCourses, setAllCourses] = useState<CourseShort[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [expandedSection, setExpandedSection] = useState<null | 'popular' | 'newest' | 'category'>(null)
  const [showAllCourses, setShowAllCourses] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, newestRes, categoryList] = await Promise.all([
          axios.get('http://localhost:3000/courses/most-popular'),
          axios.get('http://localhost:3000/courses/newest'),
          axios.get('http://localhost:3000/categories'),
        ])

        setMostPopular(popularRes.data)
        setNewest(newestRes.data)
        setCategories(categoryList.data.categories)

        if (categoryList.data.categories.length > 0) {
          const firstCategory = categoryList.data.categories[0]
          setSelectedCategory(firstCategory)

          const categoryRes = await axios.get(`http://localhost:3000/courses/category/${firstCategory._id}`)
          setCategoryCourses(categoryRes.data)
        }
      } catch (err) {
        console.error('خطا در دریافت دوره‌ها:', err)
      }
    }

    fetchData()
  }, [])

  const handleShowAllCourses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/courses')
      setAllCourses(res.data)
      setShowAllCourses(true)
    } catch (err) {
      console.error('خطا در دریافت همه دوره‌ها:', err)
    }
  }

  const isCollapsed = expandedSection !== null || showAllCourses

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

        {(selectedCategory && (expandedSection === 'category' || !isCollapsed)) && (
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
            onClick={handleShowAllCourses}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
          >
            نمایش همه دوره‌ها
          </button>
        )}
      </div>
    </div>
  )
}

const Section = ({
  title,
  courses,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string
  courses: any[]
  showAll: boolean
  onShowAll: () => void
  onBack: () => void
}) => {
  const displayedCourses = showAll ? courses : courses.slice(0, 4)

  return (
    <div className="flex flex-col gap-7">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayedCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default ShowCourses
