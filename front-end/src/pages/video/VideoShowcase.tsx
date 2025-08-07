import VideoCard from "@/components/cards/VideoCard";
import { Heart, HeartCrack, SquareCheck, SquareX } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Video, VideoShort } from "types/video";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import authAxios from "@/lib/authAxios";

const fetchVideo = async (id: string): Promise<Video> => {
  const res = await fetch(`http://localhost:3000/video/${id}`);
  const data = await res.json();
  return data.video;
};

const fetchRelatedVideo = async (id: string): Promise<VideoShort> => {
  const res = await fetch(`http://localhost:3000/video/short/${id}`);
  const data = await res.json();
  return data.videoObject;
};

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await authAxios.get(`/user/me`);
    return res.data;
  } catch {
    return false;
  }
}

const VideoShowcase = () => {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const plyrInstanceRef = useRef<Plyr | null>(null);

  const {
    data: video,
    isLoading: loadingVideo,
    isError: errorVideo,
  } = useQuery({
    queryKey: ["video", id],
    queryFn: () => fetchVideo(id),
    enabled: !!id,
  });

  const {
    data: relatedVideos,
    isLoading: loadingRelated,
  } = useQuery({
    queryKey: ["relatedVideos", video?.related],
    queryFn: async () => {
      if (!video?.related?.length) return [];
      return await Promise.all(video.related.map(fetchRelatedVideo));
    },
    enabled: !!video?.related?.length,
  });

  const {
    data: currentUser,
  } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
    enabled: !!localStorage.getItem("token"),
  });
  // @ts-ignore
  const isFavorited = currentUser?.favoriteVideos?.some(v => v._id === id);


  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/user/favorite/video/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در افزودن ویدیو به علاقه‌مندی‌ها");
      return data;
    },
    onSuccess: () => {
      toast.success("وضعیت علاقه‌مندی ویدیو تغییر کرد");
      // @ts-ignore
      queryClient.invalidateQueries(['get-user-w-jwt']);
    },
    onError: (err: any) => {
      toast.error(err.message || "مشکلی در افزودن علاقه‌مندی پیش آمد");
    },
  });

  // Plyr player setup
  useEffect(() => {
    if (!video?.content || !playerContainerRef.current) return;

    if (plyrInstanceRef.current) {
      plyrInstanceRef.current.destroy();
      plyrInstanceRef.current = null;
    }

    playerContainerRef.current.innerHTML = "";

    const videoElement = document.createElement("video");
    videoElement.className = "plyr w-full h-auto max-h-[480px]";
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("controls", "");

    const source = document.createElement("source");
    source.src = video.content;
    source.type = "video/mp4";

    videoElement.appendChild(source);
    playerContainerRef.current.appendChild(videoElement);

    const player = new Plyr(videoElement, {
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["speed", "captions"],
      speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] },
    });

    plyrInstanceRef.current = player;

    return () => {
      player.destroy();
      plyrInstanceRef.current = null;
    };
  }, [video?.content]);

  if (loadingVideo) return <div className="p-4 text-center text-sm">Loading...</div>;
  if (errorVideo || !video) return <div className="p-4 text-center text-sm">Video not found.</div>;

  const longDesc = typeof video.longDesc === "string" ? JSON.parse(video.longDesc) : video.longDesc;

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

  return (
    <div className="w-full max-w-[90%] lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-6 flex items-center justify-center flex-col min-h-screen">
      <div className="absolute top-0 left-0 right-0 opacity-20 -z-10">
        <img src={video.thumbnail} alt="thumbnail" className="w-full h-auto object-cover" />
        <div className="relative z-10 w-full h-full -translate-y-[50vh] sm:-translate-y-96">
          <div className="bg-gradient-to-t from-[#f1f1f1] h-[50vh] sm:h-96 absolute top-0 left-0 right-0 z-[-1]" />
        </div>
      </div>
      {currentUser &&
        <button
          onClick={() => toggleFavoriteMutation.mutate()}
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-md flex items-center gap-2 text-sm font-medium cursor-pointer ${isFavorited ? "bg-red-600 text-white hover:bg-red-800" : "bg-white text-red-600 border border-red-600 hover:bg-red-200"
            }`}
        >
          {isFavorited ? <HeartCrack size={20} /> : <Heart size={20} fill="#dc2626" />}
          <span>{isFavorited ? " حذف از علاقه‌مندی‌ها" : "️ افزودن به علاقه‌مندی‌ها"}</span>
        </button>
      }


      <h1 className="max-w-[90%] sm:max-w-[600px] text-center text-2xl sm:text-3xl font-bold leading-[150%]">
        {video.title}
      </h1>

      {video.content && (
        <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-gray-300 bg-black">
          <div ref={playerContainerRef} />
        </div>
      )}

      <div className="bg-gray-50 p-10 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
        <h4 className="font-bold text-lg mb-3">توضیحات کوتاه:</h4>
        <p>{video.shortDesc}</p>
      </div>

      <div className="bg-gray-50 p-10 border border-gray-300 rounded-xl w-full flex flex-col min-h-[300px]" dir="rtl">
        <p className="text-2xl font-bold mb-5">در این ویدئو:</p>
        {renderEditorContent(longDesc)}
      </div>

      {video.related && relatedVideos?.length ? (
        <div className="bg-gray-50 py-10 px-6 border border-gray-300 rounded-xl w-full flex flex-col" dir="rtl">
          <h1 className="text-xl font-bold mb-8">ویدیوهای مشابه</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedVideos.map((related, i) => (
              <VideoCard key={`relatedVideo-${i}`} video={related} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoShowcase;