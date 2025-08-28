import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResumeUpload = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (resume: File) => {
      const formData = new FormData();
      formData.append("resume", resume);
      const { data } = await axios.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-data"] });
      toast.success("رزومه با موفقیت آپلود شد.");
      setFile(null);
    },
    onError: (error: any) => {
      toast.error(`خطا در آپلود رزومه: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        toast.error("فقط فایل‌های PDF مجاز هستند.");
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("لطفاً ابتدا یک فایل PDF انتخاب کنید.");
      return;
    }
    mutation.mutate(file);
  };

  return (
    <Card className="w-full max-w-xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 font-vazir">
          آپلود رزومه
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-vazir">
              انتخاب فایل رزومه (فقط PDF)
            </label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 text-slate-900 font-vazir"
            />
          </div>
          <Button
            type="submit"
            disabled={!file || mutation.isPending}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-vazir"
          >
            {mutation.isPending ? "در حال آپلود..." : "آپلود رزومه"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
