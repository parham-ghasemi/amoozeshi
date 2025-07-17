import VideoCard from "@/components/cards/VideoCard";
import { SquareCheck, SquareX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Video, VideoShort } from "types/video";

const VideoShowcase = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video>();
  const [relatedVideos, setRelatedVideos] = useState<VideoShort[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/video/${id}`);
        const data = await res.json();
        setVideo(data.video);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      if (!video?.related || video.related.length === 0) return;

      try {
        const videos: VideoShort[] = await Promise.all(
          video.related.map(async (relatedVideoId) => {
            const res = await fetch(`http://localhost:3000/video/short/${relatedVideoId}`);
            const data = await res.json();
            return data.videoObject;
          })
        );
        setRelatedVideos(videos);
      } catch (error: any) {
        console.error("Error fetching related videos:", error);
      }
    };

    fetchRelatedVideos();
  }, [video]);

  const renderEditorContent = (content: any) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header":
          const Tag = `h${Math.min(Math.max(block.data.level, 1), 6)}` as keyof React.JSX.IntrinsicElements;
          return (
            <Tag key={index} className="font-semibold text-gray-800 my-2 sm:my-4 text-lg sm:text-xl">
              {block.data.text}
            </Tag>
          );

        case "paragraph":
          return (
            <p key={index} className="text-gray-700 leading-7 my-1 sm:my-2 text-sm sm:text-base">
              {block.data.text}
            </p>
          );

        case "list":
          if (block.data.style === "unordered") {
            return (
              <ul key={index} className="list-disc pr-4 my-1 space-y-1 text-sm sm:text-base text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ul>
            );
          } else if (block.data.style === "ordered") {
            return (
              <ol key={index} className="list-decimal pr-4 my-1 space-y-1 text-sm sm:text-base text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ol>
            );
          } else if (block.data.style === "checklist") {
            return (
              <ol key={index} className="pr-4 my-1 space-y-1 text-sm sm:text-base text-gray-700">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    {item.meta.checked ? (
                      <SquareCheck className="text-green-500 mt-0.5 w-4 h-4" />
                    ) : (
                      <SquareX className="text-rose-600 mt-0.5 w-4 h-4" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ol>
            );
          }
          break;

        case "image":
          return (
            <div key={index} className="my-4 self-center w-full">
              <img
                src={block.data.file?.url}
                alt={block.data.caption || "Image"}
                className="rounded-lg w-full max-w-[90%] sm:max-w-[800px] mx-auto"
              />
              {block.data.caption && (
                <p className="text-center text-xs text-gray-500 mt-1">{block.data.caption}</p>
              )}
            </div>
          );

        default:
          return null;
      }
    });
  };

  if (loading) return <div className="p-4 text-center text-sm">Loading...</div>;
  if (!video) return <div className="p-4 text-center text-sm">Video not found.</div>;

  const longDesc = typeof video.longDesc === "string" ? JSON.parse(video.longDesc) : video.longDesc;

  const test = new Array(9).fill(relatedVideos);
  return (
    <div className="w-full max-w-[90%] lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-6 flex items-center justify-center flex-col min-h-screen">
      {/* Top Background Thumbnail */}
      <div className="absolute top-0 left-0 right-0 opacity-20 -z-10">
        <img src={video.thumbnail} alt="thumbnail" className="w-full h-auto object-cover" />
        <div className="relative z-10 w-full h-full -translate-y-[50vh] sm:-translate-y-96">
          <div className="bg-gradient-to-t from-[#f1f1f1] h-[50vh] sm:h-96 absolute top-0 left-0 right-0 z-[-1]" />
        </div>
      </div>

      {/* Title */}
      <h1 className="max-w-[90%] sm:max-w-[600px] text-center text-2xl sm:text-3xl font-bold leading-[150%]">
        {video.title}
      </h1>

      {/* Short Description */}
      <h2 className="text-base sm:text-lg font-normal max-w-[90%] sm:max-w-[700px] text-center" dir="rtl">
        {video.shortDesc}
      </h2>

      {/* Video Player */}
      <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-gray-300 bg-black">
        <video controls className="w-full h-auto max-h-[480px] bg-black">
          <source src={video.content} type="video/mp4" />
          مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>

      {/* Long Description */}
      <div className="bg-gray-50 p-6 border border-gray-300 rounded-xl w-full flex flex-col min-h-[300px]" dir="rtl">
        {renderEditorContent(longDesc)}
      </div>

      {/* Related Videos */}
      {video.related && video.related.length > 0 && relatedVideos?.length ? (
        <div className="bg-gray-50 py-10 px-6 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
          <h1 className="text-xl font-bold mb-8">ویدیوهای مشابه</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {test.map((related, i) => (
              <VideoCard key={`relatedVideo-${i}`} video={related} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoShowcase;
