import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const CourseSearchBox = ({ initSearchTerm }: { initSearchTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initSearchTerm || '')
  const [searchError, setSearchError] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const encodedQuery = encodeURIComponent(searchTerm)
      navigate(`/courses/search?search_query=${encodedQuery}`)
    } else {
      setSearchError(true)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={clsx(
        'w-full max-w-2xl h-14 flex justify-between items-center rounded-xl p-3 overflow-hidden shadow-lg hover:shadow-xl bg-slate-50 transition',
        searchError && 'shadow-red-300'
      )}
    >
      <input
        type="text"
        className="h-full w-full px-3 border-none outline-none text-sm sm:text-base"
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setSearchError(false)
        }}
        dir="rtl"
        value={searchTerm}
        placeholder="جستجوی دوره..."
      />
      <button className="p-2 sm:p-3 cursor-pointer" type="submit">
        <Search size={22} className="hover:text-slate-700" />
      </button>
    </form>
  )
}

export default CourseSearchBox
