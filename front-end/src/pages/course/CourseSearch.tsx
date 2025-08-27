import { useLocation } from 'react-router-dom'
import axios from 'axios'
import type { CourseShort } from 'types/course'
import CourseCard from '@/components/cards/CourseCard'
import CourseSearchBox from './course-search/CourseSearchBox'
import { useQuery } from '@tanstack/react-query'

const fetchCourseSearchResults = async (query: string | null) => {
  if (!query) return []
  const response = await axios.get(`/api/courses/search?query=${encodeURIComponent(query)}`)
  return response.data as CourseShort[]
}

const CourseSearch = () => {
  const location = useLocation()
  const searchTerm = new URLSearchParams(location.search).get('search_query')

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['courseSearch', searchTerm],
    queryFn: () => fetchCourseSearchResults(searchTerm),
    enabled: !!searchTerm,
  })

  if (isLoading) return <div className="pt-20">Loading...</div>

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-10 px-4">
      <div className="w-full max-w-3xl">
        <CourseSearchBox initSearchTerm={searchTerm || ''} />
      </div>
      <div className="w-full max-w-7xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-6 sm:p-10">
        {results.length > 0 ? (
          results.map((course, index) => (
            <CourseCard key={`course-${index}`} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">هیچ دوره‌ای پیدا نشد</div>
        )}
      </div>
    </div>
  )
}

export default CourseSearch
