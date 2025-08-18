import { useState } from "react";
import type { PodcastShort } from "types/podcast";

type Props = {
  allPodcasts: PodcastShort[];
  relatedPodcasts: string[];
  setRelatedPodcasts: React.Dispatch<React.SetStateAction<string[]>>;
};

export function RelatedPodcastsSelector({
  allPodcasts,
  relatedPodcasts,
  setRelatedPodcasts,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const togglePodcast = (id: string) => {
    setRelatedPodcasts((prev) =>
      prev.includes(id) ? prev.filter((pod) => pod !== id) : [...prev, id]
    );
  };

  const filteredPodcasts = allPodcasts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 border p-5 rounded-lg" dir="rtl">
      <label className="block text-gray-800 font-semibold text-sm">
        انتخاب پادکست‌های مرتبط
      </label>

      <input
        type="text"
        placeholder="جستجو بین پادکست‌ها..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredPodcasts.map((podcast) => {
          const isSelected = relatedPodcasts.includes(podcast._id);
          return (
            <div
              key={podcast._id}
              onClick={() => togglePodcast(podcast._id)}
              className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                ${isSelected
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              <img
                src={podcast.thumbnail}
                alt={podcast.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800">{podcast.title}</h3>
                <p className="text-xs text-gray-500">
                  شنیده‌شده: {podcast.listens} | {new Date(podcast.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}