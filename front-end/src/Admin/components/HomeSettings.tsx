import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "@/lib/authAxios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomePageData {
  heroTitle: string;
  heroDescription: string;
  middleText: string;
  sectionTitle: string;
  sectionDescription: string;
  footerTitle: string;
  footerDescription: string;
  mosaicImages1: string[];
  mosaicImages2: string[];
  sectionImage: string;
  statsCards: { title: string; content: string }[];
}

interface ImageItem {
  preview: string;
  file?: File;
}

export default function HomePageSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<HomePageData>({
    queryKey: ["homepage"],
    queryFn: async () => {
      const res = await authAxios.get("/homepage");
      return res.data;
    },
  });

  const [formData, setFormData] = useState<Partial<HomePageData>>({});
  const [mosaicImages1, setMosaicImages1] = useState<ImageItem[]>([]);
  const [mosaicImages2, setMosaicImages2] = useState<ImageItem[]>([]);
  const [sectionImage, setSectionImage] = useState<ImageItem | null>(null);
  const [statsCards, setStatsCards] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    if (data) {
      setFormData(data);
      setMosaicImages1((data.mosaicImages1 || []).map((url) => ({ preview: url })));
      setMosaicImages2((data.mosaicImages2 || []).map((url) => ({ preview: url })));
      setSectionImage(data.sectionImage ? { preview: data.sectionImage } : null);
      setStatsCards(data.statsCards || []);
    }
  }, [data]);

  const handleFileChange = (
    files: FileList | null,
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>,
    maxFiles: number
  ) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const newItems = newFiles.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newItems].slice(0, maxFiles));
  };

  const handleDeleteImage = (
    index: number,
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>,
  ) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addStatsCard = () => {
    if (statsCards.length < 4) {
      setStatsCards([...statsCards, { title: '', content: '' }]);
    }
  };

  const removeStatsCard = (index: number) => {
    setStatsCards(statsCards.filter((_, i) => i !== index));
  };

  const updateStatsCardTitle = (index: number, value: string) => {
    const newCards = [...statsCards];
    newCards[index].title = value;
    setStatsCards(newCards);
  };

  const updateStatsCardContent = (index: number, value: string) => {
    const newCards = [...statsCards];
    newCards[index].content = value;
    setStatsCards(newCards);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "mosaicImages1" &&
          key !== "mosaicImages2" &&
          key !== "sectionImage" &&
          key !== "statsCards" &&
          value !== undefined
        ) {
          fd.append(key, value as string);
        }
      });

      // Append mosaicImages1 kept and new
      const mosaic1Kept = mosaicImages1.filter((item) => !item.file).map((item) => item.preview);
      fd.append("mosaicImages1", JSON.stringify(mosaic1Kept));
      const mosaic1New = mosaicImages1.filter((item) => !!item.file).map((item) => item.file!);
      mosaic1New.forEach((file) => fd.append("mosaicImages1", file));

      // Append mosaicImages2 kept and new
      const mosaic2Kept = mosaicImages2.filter((item) => !item.file).map((item) => item.preview);
      fd.append("mosaicImages2", JSON.stringify(mosaic2Kept));
      const mosaic2New = mosaicImages2.filter((item) => !!item.file).map((item) => item.file!);
      mosaic2New.forEach((file) => fd.append("mosaicImages2", file));

      // Append sectionImage
      if (sectionImage === null) {
        fd.append("sectionImage", "");
      } else if (sectionImage.file) {
        fd.append("sectionImage", sectionImage.file);
      } else {
        fd.append("sectionImage", sectionImage.preview);
      }

      // Append statsCards
      fd.append("statsCards", JSON.stringify(statsCards));

      // Log FormData contents for debugging
      for (const [key, value] of fd.entries()) {
        console.log(`FormData: ${key} =`, value);
      }
      const response = await authAxios.put("/homepage", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("داده‌های صفحه اصلی با موفقیت به‌روزرسانی شد", {
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: (error: any) => {
      toast.error(`خطا در به‌روزرسانی داده‌ها: ${error.message}`, {
        duration: 3000,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-2 text-lg text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">خطا در بارگذاری داده‌ها</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl" dir="rtl">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            ویرایش صفحه اصلی
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Text fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              { key: "heroTitle", label: "عنوان اصلی", type: "input" },
              { key: "heroDescription", label: "توضیح اصلی", type: "textarea" },
              { key: "middleText", label: "متن میانی", type: "textarea" },
              { key: "sectionTitle", label: "عنوان بخش", type: "input" },
              { key: "sectionDescription", label: "توضیح بخش", type: "textarea" },
              { key: "footerTitle", label: "عنوان فوتر", type: "input" },
              { key: "footerDescription", label: "توضیح فوتر", type: "textarea" },
            ] as const).map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={(formData[field.key] as string | undefined) ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                  />
                ) : (
                  <Input
                    value={(formData[field.key] as string | undefined) ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
          {/* Mosaic Images 1 */}
          <ImageUploadSection
            title="تصاویر موزاییکی ۱ (حداکثر ۶ تصویر)"
            previews={mosaicImages1.map((item) => item.preview)}
            onDelete={(idx) => handleDeleteImage(idx, setMosaicImages1)}
            onChange={(files) => handleFileChange(files, setMosaicImages1, 6)}
          />
          {/* Mosaic Images 2 */}
          <ImageUploadSection
            title="تصاویر موزاییکی ۲ (حداکثر ۶ تصویر)"
            previews={mosaicImages2.map((item) => item.preview)}
            onDelete={(idx) => handleDeleteImage(idx, setMosaicImages2)}
            onChange={(files) => handleFileChange(files, setMosaicImages2, 6)}
          />
          {/* Section Image */}
          <SectionImageUpload
            preview={sectionImage?.preview || null}
            onFile={(file) => {
              if (file) {
                setSectionImage({ preview: URL.createObjectURL(file), file });
              } else {
                setSectionImage(null);
              }
            }}
            onDelete={() => {
              setSectionImage(null);
            }}
          />
          {/* Stats Cards */}
          <div className="mt-6 space-y-4">
            <Label>کارت‌های آمار (حداکثر ۴)</Label>
            {statsCards.map((card, idx) => (
              <div key={idx} className="border p-4 rounded-md space-y-2 relative">
                <div className="space-y-2">
                  <Label>عنوان کارت {idx + 1}</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateStatsCardTitle(idx, e.target.value)}
                    placeholder="عنوان"
                  />
                </div>
                <div className="space-y-2">
                  <Label>محتوای کارت {idx + 1}</Label>
                  <Textarea
                    value={card.content}
                    onChange={(e) => updateStatsCardContent(idx, e.target.value)}
                    placeholder="محتوا"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 left-2"
                  onClick={() => removeStatsCard(idx)}
                >
                  حذف
                </Button>
              </div>
            ))}
            {statsCards.length < 4 && (
              <Button onClick={addStatsCard}>افزودن کارت</Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                در حال ذخیره...
              </span>
            ) : (
              "ذخیره تغییرات"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface ImageUploadSectionProps {
  title: string;
  previews: string[];
  onDelete: (idx: number) => void;
  onChange: (files: FileList | null) => void;
}

function ImageUploadSection({
  title,
  previews,
  onDelete,
  onChange,
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-4 mt-6">
      <Label>{title}</Label>
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id={title}
        onChange={(e) => onChange(e.target.files)}
        disabled={previews.length >= 6}
      />
      <Label
        htmlFor={title}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200",
          previews.length >= 6 && "opacity-50 cursor-not-allowed"
        )}
      >
        <Upload className="h-5 w-5" /> انتخاب تصاویر
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map((src, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md">
            <img
              src={src}
              alt=""
              className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
              onClick={() => onDelete(idx)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SectionImageUploadProps {
  preview: string | null;
  onFile: (file: File | null) => void;
  onDelete: () => void;
}

function SectionImageUpload({ preview, onFile, onDelete }: SectionImageUploadProps) {
  return (
    <div className="space-y-4 mt-6">
      <Label>تصویر بخش (۱ تصویر)</Label>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="sectionImage"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
        disabled={!!preview}
      />
      <Label
        htmlFor="sectionImage"
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200",
          preview && "opacity-50 cursor-not-allowed"
        )}
      >
        <Upload className="h-5 w-5" /> انتخاب تصویر
      </Label>
      {preview && (
        <div className="relative group overflow-hidden rounded-lg shadow-md w-48 h-48">
          <img
            src={preview}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
            onClick={onDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}