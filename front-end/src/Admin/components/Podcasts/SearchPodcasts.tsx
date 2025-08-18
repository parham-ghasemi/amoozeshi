import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import authAxios from "@/lib/authAxios";
import PodcastCard from "@/components/cards/PodcastCard";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import type { PodcastShort } from "types/podcast";

const fetchSearchedPodcasts = async (query: string): Promise<PodcastShort[]> => {
  if (!query) return [];
  const { data } = await authAxios.get(`/podcasts/search?query=${query}`);
  return data;
};

export default function SearchPodcasts() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: podcasts, isLoading } = useQuery({
    queryKey: ["searchPodcasts", searchTerm],
    queryFn: () => fetchSearchedPodcasts(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4" dir="rtl">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        ویرایش پادکست
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
        {podcasts?.map((podcast) => (
          <motion.div
            key={podcast._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PodcastCard
              podcast={podcast}
              editButton
              onEdit={() => navigate(`/admin/podcast/edit/${podcast._id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}