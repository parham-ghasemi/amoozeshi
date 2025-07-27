import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import VideoCard from '@/components/cards/VideoCard'
import VideoSearchBox from './video-search/VideoSearchBox'

interface Category {
  _id: string
  name: string
}

const fetchMostViewed = () => axios.get('http://localhost:3000/videos/most-viewed').then(res => res.data)
const fetchNewest = () => axios.get('http://localhost:3000/videos/newest').then(res => res.data)
const fetchCategories = () => axios.get('http://localhost:3000/categories').then(res => res.data.categories)
const fetchCategoryVideos = (id: string) => axios.get(`http://localhost:3000/videos/category/${id}`).then(res => res.data)
const fetchAllVideos = () => axios.get('http://localhost:3000/videos').then(res => res.data)

const ShowVideos = () => {
  const [expandedSection, setExpandedSection] = useState<null | 'viewed' | 'newest' | 'category'>(null)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const {
    data: mostViewed = [],
    isLoading: loadingViewed,
    isError: errorViewed,
  } = useQuery({ queryKey: ['mostViewedVideos'], queryFn: fetchMostViewed })

  const {
    data: newest = [],
    isLoading: loadingNewest,
    isError: errorNewest,
  } = useQuery({ queryKey: ['newestVideos'], queryFn: fetchNewest })

  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  useEffect(() => (
    console.log()
  ), [categories, selectedCategory])

  const {
    data: categoryVideos = [],
    isLoading: loadingCategoryVideos,
    isError: errorCategoryVideos,
  } = useQuery({
    queryKey: ['categoryVideos', selectedCategory?._id],
    queryFn: () => fetchCategoryVideos(selectedCategory!._id),
    enabled: !!selectedCategory,
  })

  const {
    data: allVideos = [],
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['allVideos'],
    queryFn: fetchAllVideos,
    enabled: false,
  })

  const handleShowAllVideos = async () => {
    await refetchAll()
    setShowAllVideos(true)
  }

  const isCollapsed = expandedSection !== null || showAllVideos

  if (loadingViewed || loadingNewest || loadingCategories || (selectedCategory && loadingCategoryVideos))
    return <div className="pt-20">در حال بارگذاری...</div>

  if (errorViewed || errorNewest || errorCategories || errorCategoryVideos)
    return <div className="pt-20 text-red-600">خطا در دریافت اطلاعات</div>

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center pt-16">
      {!isCollapsed && <VideoSearchBox />}

      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl flex flex-col gap-10 p-16" dir="rtl">
        {(expandedSection === 'viewed' || !isCollapsed) && (
          <Section
            title="پر بازدیدترین ویدیوها"
            videos={mostViewed}
            showAll={expandedSection === 'viewed'}
            onShowAll={() => setExpandedSection('viewed')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(expandedSection === 'newest' || !isCollapsed) && (
          <Section
            title="جدیدترین ویدیوها"
            videos={newest}
            showAll={expandedSection === 'newest'}
            onShowAll={() => setExpandedSection('newest')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {(selectedCategory && (expandedSection === 'category' || !isCollapsed)) && (
          <Section
            title={`ویدیوهای ${selectedCategory.name}`}
            videos={categoryVideos}
            showAll={expandedSection === 'category'}
            onShowAll={() => setExpandedSection('category')}
            onBack={() => setExpandedSection(null)}
          />
        )}

        {showAllVideos && (
          <Section
            title="همه ویدیوها"
            videos={allVideos}
            showAll={true}
            onShowAll={() => { }}
            onBack={() => setShowAllVideos(false)}
          />
        )}

        {!isCollapsed && (
          <button
            onClick={handleShowAllVideos}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
          >
            نمایش همه ویدیوها
          </button>
        )}
      </div>
    </div>
  )
}

const Section = ({
  title,
  videos,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string
  videos: any[]
  showAll: boolean
  onShowAll: () => void
  onBack: () => void
}) => {
  const displayedVideos = showAll ? videos : videos.slice(0, 4)

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
        {displayedVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  )
}

export default ShowVideos
