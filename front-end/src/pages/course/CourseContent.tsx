import ArticleCard from "./course-content-items/ArticleCard";
import VideoCard from "./course-content-items/VideoCard";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import type { CourseContent } from "types/course";
import type { ArticleShort } from "types/article";
import type { VideoShort } from "types/video";
import { ChevronLeft } from "lucide-react";

const CourseContent = () => {
  const { id } = useParams();
  const [content, setContent] = useState<null | CourseContent[]>(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/course/content/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch course content');
        }
        const data = await res.json();
        setContent(data.content);
        setTitle(data.title)
      } catch (error) {
        console.error('Error fetching course content:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchCourseContent();
  }, [])

  const isArticle = (item: CourseContent): item is CourseContent & { itemId: ArticleShort } => {
    return item.itemType === "Article" && 'itemId' in item && typeof item.itemId === 'object' && 'title' in item.itemId && 'thumbnail' in item.itemId && 'description' in item.itemId;
  }
  const isVideo = (item: CourseContent): item is CourseContent & { itemId: VideoShort } => {
    return item.itemType === "Video" && 'itemId' in item && typeof item.itemId === 'object' && 'title' in item.itemId && 'thumbnail' in item.itemId && 'visits' in item.itemId && 'createdAt' in item.itemId;
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="w-full max-w-[90%] lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen rounded-xl mt-8 shadow-xl bg-white">
      <div className="w-full flex justify-between">
        <button onClick={() => nav(`/course/${id}`)} className="hover:-translate-x-0.5 cursor-pointer transition-transform">
          <ChevronLeft size={25}/>
        </button>
        <p className="leading-[300%] text-lg font-bold">{title}</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 ">
        {content && content.map((item, index) => (
          <div className="w-full" key={`${item.itemId.title} - ${index}`}>
            {
              isArticle(item) && (
                <ArticleCard article={item.itemId} />
              )
            }
            {
              isVideo(item) && (
                <VideoCard video={item.itemId} />
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseContent