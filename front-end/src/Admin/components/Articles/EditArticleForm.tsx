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
import { RelatedArticlesSelector } from "./RelatedArticlesSelector";
import type { ArticleShort } from "types/article";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function EditArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ejInstance = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleShort[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  const { data: articleData, isPending: isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data } = await authAxios.get(`/article/${id}`);
      return data.article;
    },
    enabled: !!id,
  });

  useEffect(() => {
    authAxios
      .get("/articles")
      .then((res) => setAllArticles(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!articleData) return;

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
      placeholder: "مقاله خود را ویرایش کنید...",
      i18n: { direction: "rtl" },
      data: articleData.content,
    });

    ejInstance.current = editor;

    setTitle(articleData.title);
    setDescription(articleData.description);
    setCategory(articleData.category?._id || "");
    setRelatedArticles(articleData.related?.map((r: any) => r._id) || []);
    setThumbnail(articleData.thumbnail);

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, [articleData]);

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
      const data = await ejInstance.current?.save();
      return authAxios.patch(`/article/${id}`, {
        title,
        description,
        content: JSON.stringify(data),
        category,
        related: relatedArticles,
        thumbnail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      navigate("/admin/article/edit");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return authAxios.delete(`/article/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/article");
    },
    onError: (error: any) => {
      toast.error("خطا در حذف مقاله");
      console.error(error)
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
        placeholder="عنوان مقاله"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        placeholder="توضیحات مقاله"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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

      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />
      <CategoryDropDown value={category} setValue={setCategory} />
      <RelatedArticlesSelector
        allArticles={allArticles}
        relatedArticles={relatedArticles}
        setRelatedArticles={setRelatedArticles}
      />

      <div className="text-right pt-4 flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "در حال حذف..." : "حذف مقاله"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>آیا از حذف مقاله مطمئن هستید؟</AlertDialogTitle>
              <AlertDialogDescription>
                این عملیات قابل بازگشت نیست و مقاله به طور کامل حذف خواهد شد.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </div>
    </motion.div>
  );
}