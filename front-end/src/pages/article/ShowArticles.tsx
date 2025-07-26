import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import ArticleSearchBox from './article-search/ArticleSearchBox'
import ArticleCard from '@/components/cards/ArticleCard'
import axios from 'axios'

interface Category {
  _id: string
  name: string
}

const ShowArticles = () => {
  const [mostViewed, setMostViewed] = useState([])
  const [newest, setNewest] = useState([])
  const [categoryArticles, setCategoryArticles] = useState([])
  const [allArticles, setAllArticles] = useState([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [expandedSection, setExpandedSection] = useState<null | 'viewed' | 'newest' | 'category'>(null)
  const [showAllArticles, setShowAllArticles] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [viewedRes, newestRes, categoryList] = await Promise.all([
          axios.get('http://localhost:3000/articles/most-viewed'),
          axios.get('http://localhost:3000/articles/newest'),
          axios.get('http://localhost:3000/categories'),
        ])

        setMostViewed(viewedRes.data)
        setNewest(newestRes.data)
        setCategories(categoryList.data.categories)

        if (categoryList.data.categories.length > 0) {
          const firstCategory = categoryList.data.categories[0]
          setSelectedCategory(firstCategory)

          const categoryRes = await axios.get(`http://localhost:3000/articles/category/${firstCategory._id}`)
          setCategoryArticles(categoryRes.data)
        }
      } catch (err) {
        console.error('خطا در دریافت مقالات:', err)
      }
    }

    fetchData()
  }, [])

  const handleShowAllArticles = async () => {
    try {
      const res = await axios.get('http://localhost:3000/articles')
      setAllArticles(res.data)
      setShowAllArticles(true)
    } catch (err) {
      console.error('خطا در دریافت همه مقالات:', err)
    }
  }

  const isCollapsed = expandedSection !== null || showAllArticles

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center pt-16">
      {!isCollapsed && <ArticleSearchBox />}

      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16" dir="rtl">
        {(expandedSection === 'viewed' || !isCollapsed) && (
          <Section
            title="مقاله‌های پربازدید"
            articles={mostViewed}
            showAll={expandedSection === 'viewed'}
            onShowAll={() => setExpandedSection('viewed')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(expandedSection === 'newest' || !isCollapsed) && (
          <Section
            title="جدیدترین مقاله‌ها"
            articles={newest}
            showAll={expandedSection === 'newest'}
            onShowAll={() => setExpandedSection('newest')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(selectedCategory && (expandedSection === 'category' || !isCollapsed)) && (
          <Section
            title={`مقاله‌های ${selectedCategory.name}`}
            articles={categoryArticles}
            showAll={expandedSection === 'category'}
            onShowAll={() => setExpandedSection('category')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {showAllArticles && (
          <Section
            title="همه مقاله‌ها"
            articles={allArticles}
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
  )
}

const Section = ({
  title,
  articles,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string
  articles: any[]
  showAll: boolean
  onShowAll: () => void
  onBack: () => void
}) => {
  const displayedArticles = showAll ? articles : articles.slice(0, 4)

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
        {displayedArticles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  )
}

export default ShowArticles
