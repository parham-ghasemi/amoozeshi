import { useState } from "react"
import type { VideoShort } from "types/video"

type Props = {
  allVideos: VideoShort[]
  relatedVideos: string[]
  setRelatedVideos: React.Dispatch<React.SetStateAction<string[]>>
}

export function RelatedVideosSelector({
  allVideos,
  relatedVideos,
  setRelatedVideos,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const toggleVideo = (id: string) => {
    setRelatedVideos((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    )
  }

  const filteredVideos = allVideos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 border p-5 rounded-lg" dir="rtl">
      <label className="block text-gray-800 font-semibold text-sm">
        انتخاب ویدیوهای مرتبط
      </label>

      <input
        type="text"
        placeholder="جستجو بین ویدیوها..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredVideos.map((video) => {
          const isSelected = relatedVideos.includes(video._id)
          return (
            <div
              key={video._id}
              onClick={() => toggleVideo(video._id)}
              className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                ${isSelected
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800">{video.title}</h3>
                <p className="text-xs text-gray-500">
                  بازدید: {video.visits} | {new Date(video.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
