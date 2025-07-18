import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import VideoSearchBox from './video-search/VideoSearchBox'
import VideoCard from '@/components/cards/VideoCard'
import axios from 'axios'

const ShowVideos = () => {
  const [mostViewed, setMostViewed] = useState([])
  const [newest, setNewest] = useState([])
  const [categoryVideos, setCategoryVideos] = useState([])
  const [allVideos, setAllVideos] = useState([])

  const [expandedSection, setExpandedSection] = useState<null | 'viewed' | 'newest' | 'category'>(null)
  const [showAllVideos, setShowAllVideos] = useState(false)

  const categoryName = 'Machine Learning'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [viewedRes, newestRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:3000/videos/most-viewed'),
          axios.get('http://localhost:3000/videos/newest'),
          axios.get(`http://localhost:3000/videos/category/${encodeURIComponent(categoryName)}`),
        ])

        setMostViewed(viewedRes.data)
        setNewest(newestRes.data)
        setCategoryVideos(categoryRes.data)
      } catch (err) {
        console.error('Error fetching videos:', err)
      }
    }

    fetchData()
  }, [])

  const handleShowAllVideos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/videos')
      setAllVideos(res.data)
      setShowAllVideos(true)
    } catch (err) {
      console.error('Failed to fetch all videos:', err)
    }
  }

  const isCollapsed = expandedSection !== null || showAllVideos

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

        {(expandedSection === 'category' || !isCollapsed) && (
          <Section
            title={`ویدیوهای «${categoryName}»`}
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
            بیشتر
            <ChevronLeft size={17} />
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm hover:text-rose-700 cursor-pointer"
            >
              بازگشت
              <ChevronLeft size={18} />
            </button>
          </div>
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
