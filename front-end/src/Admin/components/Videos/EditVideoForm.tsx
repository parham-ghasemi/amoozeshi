import ImageTool from "@editorjs/image";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import authAxios from "@/lib/authAxios";
import { CategoryDropDown } from "../CategoryDropDown";
import { RelatedVideosSelector } from "./RelatedVideosSelector"; // You'll need to implement similar to RelatedArticlesSelector
import type { VideoShort } from "types/video";
import { Button } from "@/components/ui/button";

export default function EditVideoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ejInstance = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("");
  const [relatedVideos, setRelatedVideos] = useState<string[]>([]);
  const [allVideos, setAllVideos] = useState<VideoShort[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Fetch existing video
  const { data: videoData, isPending: isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await authAxios.get(`/video/${id}`);
      return data.video;
    },
    enabled: !!id,
  });

  // Load all videos for "related" selector
  useEffect(() => {
    authAxios
      .get("/videos")
      .then((res) => setAllVideos(res.data))
      .catch(console.error);
  }, []);

  // Init EditorJS once videoData is loaded
  useEffect(() => {
    if (!videoData) return;

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append("image", file);
                const response = await authAxios.post("/upload", formData);
                return response.data;
              },
            },
          },
        },
      },
      placeholder: "توضیحات بلند ویدیو را ویرایش کنید...",
      i18n: { direction: "rtl" },
      data: videoData.longDesc,
    });

    ejInstance.current = editor;

    setTitle(videoData.title);
    setShortDesc(videoData.shortDesc);
    setCategory(videoData.category?._id || "");
    setRelatedVideos(videoData.related?.map((r: any) => r._id) || []);
    setThumbnail(videoData.thumbnail);

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, [videoData]);

  const handleThumbnailUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsUploadingThumb(true);

    try {
      const response = await authAxios.post("/upload", formData);
      if (response.data?.success) {
        setThumbnail(response.data.file.url);
      }
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const longDescData = await ejInstance.current?.save();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("shortDesc", shortDesc);
      formData.append("longDesc", JSON.stringify(longDescData));
      formData.append("category", category);
      formData.append("related", JSON.stringify(relatedVideos));
      formData.append("thumbnail", thumbnail);
      if (videoFile) {
        formData.append("video", videoFile);
      }
      return authAxios.patch(`/videos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", id] });
      navigate("/admin/video");
    },
  });

  if (isLoading) return <p className="text-center">در حال بارگذاری...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200"
      dir="rtl"
    >
      <input
        type="text"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        placeholder="عنوان ویدیو"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        placeholder="توضیحات کوتاه ویدیو"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
      />
      <div>
        <label className="block font-semibold">تصویر کوچک</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
          className="block w-full border rounded-xl px-4 py-2"
        />
        {isUploadingThumb ? (
          <p>در حال بارگذاری...</p>
        ) : thumbnail ? (
          <img src={thumbnail} alt="preview" className="mt-2 w-full max-h-64 object-cover rounded-xl" />
        ) : null}
      </div>
      <div>
        <label className="block font-semibold">فایل ویدیو (در صورت نیاز به تغییر)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="block w-full border rounded-xl px-4 py-2"
        />
      </div>
      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />
      <CategoryDropDown value={category} setValue={setCategory} />
      <RelatedVideosSelector
        allVideos={allVideos}
        relatedVideos={relatedVideos}
        setRelatedVideos={setRelatedVideos}
      />
      <div className="text-right pt-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </div>
    </motion.div>
  );
}
