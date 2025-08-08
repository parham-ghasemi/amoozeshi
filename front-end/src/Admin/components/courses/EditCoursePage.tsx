import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import authAxios from "@/lib/authAxios";
import CourseCard from "@/components/cards/CourseCard";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import type { CourseShort } from "types/course"; // _id, title, shortDesc, thumbnail

// Fetcher function
const fetchSearchedCourses = async (query: string): Promise<CourseShort[]> => {
  if (!query) return [];
  const { data } = await authAxios.get(`/courses/search?query=${query}`);
  return data;
};

export default function EditCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["searchCourses", searchTerm],
    queryFn: () => fetchSearchedCourses(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4" dir="rtl">
      {/* Page title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        ویرایش دوره
      </motion.h1>

      {/* Search bar */}
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

      {/* Loading indicator */}
      {isLoading && <p className="text-center text-gray-500">در حال جستجو...</p>}

      {/* Courses grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {courses?.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CourseCard
              course={course}
              editButton
              onEdit={() => navigate(`/admin/course/edit/${course._id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
