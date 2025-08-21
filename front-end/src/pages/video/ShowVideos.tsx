import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import VideoCard from '@/components/cards/VideoCard'
import VideoSearchBox from './video-search/VideoSearchBox'

interface Category {
  _id: string
  name: string
}

const fetchMostViewed = () => axios.get('/api/videos/most-viewed').then(res => res.data)
const fetchNewest = () => axios.get('/api/videos/newest').then(res => res.data)
const fetchCategories = () => axios.get('/api/categories').then(res => res.data.categories)
const fetchCategoryVideos = (id: string) => axios.get(`/api/videos/category/${id}`).then(res => res.data)
const fetchAllVideos = () => axios.get('/api/videos').then(res => res.data)

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
    return <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20"
    >
      در حال بارگذاری...
    </motion.div>

  if (errorViewed || errorNewest || errorCategories || errorCategoryVideos)
    return <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 text-red-600"
    >
      خطا در دریافت اطلاعات
    </motion.div>

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
            <VideoSearchBox />
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
        </AnimatePresence>

        {!isCollapsed && (
          <motion.button
            onClick={handleShowAllVideos}
            className="mt-10 mb-20 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            نمایش همه ویدیوها
          </motion.button>
        )}
      </motion.div>
    </motion.div>
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

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {displayedVideos.map((video) => (
          <motion.div
            key={video._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <VideoCard video={video} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ShowVideos