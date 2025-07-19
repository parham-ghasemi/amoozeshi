import { useState } from "react"
import type { CourseShort } from "types/course"

type Props = {
  allCourses: CourseShort[]
  relatedCourses: string[]
  setRelatedCourses: React.Dispatch<React.SetStateAction<string[]>>
}

export function RelatedCoursesSelector({
  allCourses,
  relatedCourses,
  setRelatedCourses,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const toggleCourse = (id: string) => {
    setRelatedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const filteredCourses = allCourses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 border p-5 rounded-lg" dir="rtl">
      <label className="block text-gray-800 font-semibold text-sm">
        انتخاب دوره‌های مرتبط
      </label>

      <input
        type="text"
        placeholder="جستجو بین دوره‌ها..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredCourses.map((course) => {
          const isSelected = relatedCourses.includes(course._id)
          return (
            <div
              key={course._id}
              onClick={() => toggleCourse(course._id)}
              className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                ${isSelected
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800">{course.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{course.shortDesc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
