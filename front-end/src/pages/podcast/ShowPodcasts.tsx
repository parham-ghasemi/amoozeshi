import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import PodcastCard from '@/components/cards/PodcastCard'
import PodcastSearchBox from './search/PodcastSearchBox'

interface Category {
  _id: string
  name: string
}

const fetchMostListened = () => axios.get('/api/podcasts/most-listened').then(res => res.data)
const fetchNewest = () => axios.get('/api/podcasts/newest').then(res => res.data)
const fetchCategories = () => axios.get('/api/categories').then(res => res.data.categories)
const fetchCategoryPodcasts = (id: string) => axios.get(`/api/podcasts/category/${id}`).then(res => res.data)
const fetchAllPodcasts = () => axios.get('/api/podcasts').then(res => res.data)

const ShowPodcasts = () => {
  const [expandedSection, setExpandedSection] = useState<null | 'listened' | 'newest' | 'category'>(null)
  const [showAllPodcasts, setShowAllPodcasts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const {
    data: mostListened = [],
    isLoading: loadingListened,
    isError: errorListened,
  } = useQuery({ queryKey: ['mostListenedPodcasts'], queryFn: fetchMostListened })

  const {
    data: newest = [],
    isLoading: loadingNewest,
    isError: errorNewest,
  } = useQuery({ queryKey: ['newestPodcasts'], queryFn: fetchNewest })

  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  useEffect(() => {
    console.log(categories, selectedCategory)
  }, [categories, selectedCategory])

  const {
    data: categoryPodcasts = [],
    isLoading: loadingCategoryPodcasts,
    isError: errorCategoryPodcasts,
  } = useQuery({
    queryKey: ['categoryPodcasts', selectedCategory?._id],
    queryFn: () => fetchCategoryPodcasts(selectedCategory!._id),
    enabled: !!selectedCategory,
  })

  const {
    data: allPodcasts = [],
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['allPodcasts'],
    queryFn: fetchAllPodcasts,
    enabled: false,
  })

  const handleShowAllPodcasts = async () => {
    await refetchAll()
    setShowAllPodcasts(true)
  }

  const isCollapsed = expandedSection !== null || showAllPodcasts

  if (loadingListened || loadingNewest || loadingCategories || (selectedCategory && loadingCategoryPodcasts))
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 text-center">
        در حال بارگذاری...
      </motion.div>
    )

  if (errorListened || errorNewest || errorCategories || errorCategoryPodcasts)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 text-center text-red-600">
        خطا در دریافت اطلاعات
      </motion.div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col gap-10 items-center pt-10 px-4 sm:px-6 lg:px-8"
    >
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl flex justify-center"
          >
            <PodcastSearchBox />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-6xl bg-slate-50 rounded-2xl flex flex-col gap-8 sm:gap-10 p-6 sm:p-10 lg:p-16"
        dir="rtl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {(expandedSection === 'listened' || !isCollapsed) && (
            <Section
              title="پر شنیده‌شده‌ترین پادکست‌ها"
              podcasts={mostListened}
              showAll={expandedSection === 'listened'}
              onShowAll={() => setExpandedSection('listened')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {(expandedSection === 'newest' || !isCollapsed) && (
            <Section
              title="جدیدترین پادکست‌ها"
              podcasts={newest}
              showAll={expandedSection === 'newest'}
              onShowAll={() => setExpandedSection('newest')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {(selectedCategory && (expandedSection === 'category' || !isCollapsed)) && (
            <Section
              title={`پادکست‌های ${selectedCategory.name}`}
              podcasts={categoryPodcasts}
              showAll={expandedSection === 'category'}
              onShowAll={() => setExpandedSection('category')}
              onBack={() => setExpandedSection(null)}
            />
          )}

          {showAllPodcasts && (
            <Section
              title="همه پادکست‌ها"
              podcasts={allPodcasts}
              showAll={true}
              onShowAll={() => { }}
              onBack={() => setShowAllPodcasts(false)}
            />
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <motion.button
            onClick={handleShowAllPodcasts}
            className="mt-6 sm:mt-10 mb-10 w-full py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 self-center rounded-2xl hover:shadow-2xl text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            نمایش همه پادکست‌ها
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

const Section = ({
  title,
  podcasts,
  showAll,
  onShowAll,
  onBack,
}: {
  title: string
  podcasts: any[]
  showAll: boolean
  onShowAll: () => void
  onBack: () => void
}) => {
  const displayedPodcasts = showAll ? podcasts : podcasts.slice(0, 4)

  return (
    <motion.div
      className="flex flex-col gap-5 sm:gap-7"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center flex-wrap gap-2">
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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
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
        {displayedPodcasts.map((podcast) => (
          <motion.div
            key={podcast._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <PodcastCard podcast={podcast} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ShowPodcasts
