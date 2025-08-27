import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const VideoSearchBox = ({ initSearchTerm }: { initSearchTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initSearchTerm || '')
  const [searchError, setSearchError] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const encodedQuery = encodeURIComponent(searchTerm)
      navigate(`/videos/search?search_query=${encodedQuery}`)
    } else {
      setSearchError(true)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={clsx(
        "w-full max-w-2xl h-12 sm:h-14 flex justify-between items-center rounded-xl p-2 sm:p-3 overflow-hidden shadow-md hover:shadow-lg transition bg-slate-50",
        searchError && 'shadow-red-300'
      )}
    >
      <input
        type="text"
        className="h-full w-full px-2 sm:px-3 border-none outline-none text-sm sm:text-base"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        dir="rtl"
        placeholder="جستجو..."
      />
      <button className="p-2 sm:p-3 cursor-pointer flex-shrink-0" type="submit">
        <Search size={22} className=" hover:text-slate-700" />
      </button>
    </form>
  )
}

export default VideoSearchBox
