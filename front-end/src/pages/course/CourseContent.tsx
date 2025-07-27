import ArticleCard from "./course-content-items/ArticleCard";
import VideoCard from "./course-content-items/VideoCard";
import { useNavigate, useParams } from "react-router-dom";
import type { CourseContent } from "types/course";
import type { ArticleShort } from "types/article";
import type { VideoShort } from "types/video";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchCourseContent = async (id: string) => {
  const res = await fetch(`http://localhost:3000/course/content/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch course content');
  }
  const data = await res.json();
  return { content: data.content as CourseContent[], title: data.title as string };
};

const CourseContent = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courseContent", id],
    queryFn: () => fetchCourseContent(id!),
    enabled: !!id,
  });

  const isArticle = (item: CourseContent): item is CourseContent & { itemId: ArticleShort } => {
    return item.itemType === "Article" && 'itemId' in item && typeof item.itemId === 'object' && 'title' in item.itemId && 'thumbnail' in item.itemId && 'description' in item.itemId;
  };

  const isVideo = (item: CourseContent): item is CourseContent & { itemId: VideoShort } => {
    return item.itemType === "Video" && 'itemId' in item && typeof item.itemId === 'object' && 'title' in item.itemId && 'thumbnail' in item.itemId && 'visits' in item.itemId && 'createdAt' in item.itemId;
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading course content</div>;
  }

  const { content, title } = data;

  return (
    <div className="w-full max-w-[90%] lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen rounded-xl mt-8 shadow-xl bg-white">
      <div className="w-full flex justify-between">
        <button onClick={() => nav(`/course/${id}`)} className="hover:-translate-x-0.5 cursor-pointer transition-transform">
          <ChevronLeft size={25} />
        </button>
        <p className="leading-[300%] text-xs md:text-lg font-bold">{title}</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {content && content.map((item, index) => (
          <div className="w-full" key={`${item.itemId.title} - ${index}`}>
            {isArticle(item) && (
              <ArticleCard article={item.itemId} />
            )}
            {isVideo(item) && (
              <VideoCard video={item.itemId} />
            )}
            <div className="w-full h-px bg-neutral-200 md:hidden"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;