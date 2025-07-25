import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import type { CourseShort } from 'types/course'
import CourseCard from '@/components/cards/CourseCard'
import CourseSearchBox from './course-search/CourseSearchBox'

const CourseSearch = () => {
  const [results, setResults] = useState<CourseShort[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const searchTerm = new URLSearchParams(location.search).get('search_query')

  useEffect(() => {
    const fetchResults = async () => {
      const query = new URLSearchParams(location.search).get('search_query')
      if (query) {
        try {
          const response = await axios.get(`http://localhost:3000/courses/search?query=${encodeURIComponent(query)}`)
          setResults(response.data)
        } catch (error) {
          console.error('Error fetching course search results:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchResults()
  }, [location.search])

  if (loading) return <div>Loading...</div>

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-20">
      <CourseSearchBox initSearchTerm={searchTerm || ''} />
      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-4 gap-4 p-10">
        {results.length > 0 ? (
          results.map((course, index) => (
            <CourseCard key={`course-${index}`} course={course} />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">هیچ دوره‌ای پیدا نشد</div>
        )}
      </div>
    </div>
  )
}

export default CourseSearch
