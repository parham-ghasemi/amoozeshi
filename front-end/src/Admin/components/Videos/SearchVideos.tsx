import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import authAxios from "@/lib/authAxios";
import VideoCard from "@/components/cards/VideoCard";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import type { VideoShort } from "types/video";

const fetchSearchedVideos = async (query: string): Promise<VideoShort[]> => {
  if (!query) return [];
  const { data } = await authAxios.get(`/videos/search?query=${query}`);
  return data;
};

export default function EditVideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: videos, isLoading } = useQuery({
    queryKey: ["searchVideos", searchTerm],
    queryFn: () => fetchSearchedVideos(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4" dir="rtl">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        ویرایش ویدیو
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <Input
          placeholder="جستجو بر اساس عنوان یا توضیحات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-right"
        />
      </motion.div>

      {isLoading && <p className="text-center text-gray-500">در حال جستجو...</p>}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {videos?.map((video) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VideoCard
              video={video}
              editButton
              onEdit={() => navigate(`/admin/video/edit/${video._id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
