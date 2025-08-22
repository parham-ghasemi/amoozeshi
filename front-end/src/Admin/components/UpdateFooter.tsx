import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import authAxios from '@/lib/authAxios';

const UpdateFooter: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', description: '' });

  const { data: footerData, isLoading } = useQuery({
    queryKey: ['footer-data'],
    queryFn: async () => {
      const { data } = await axios.get('/api/footer');
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newData: { title: string; description: string }) => {
      const { data } = await authAxios.put('/footer', newData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-data'] });
      toast.success('داده‌های فوتر با موفقیت به‌روزرسانی شدند.');
    },
    onError: (error: any) => {
      toast.error(`خطا در به‌روزرسانی داده‌ها: ${error.message}`);
    },
  });

  useEffect(() => {
    if (footerData) {
      setFormData({ title: footerData.title || '', description: footerData.description || '' });
    }
  }, [footerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('لطفاً همه فیلدها را پر کنید.');
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="text-center text-gray-600 font-vazir">در حال بارگذاری...</div>;

  return (
    <Card className="w-full max-w-xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 font-vazir">به‌روزرسانی فوتر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-vazir">عنوان</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 text-slate-900 font-vazir"
              placeholder="عنوان فوتر"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-vazir">توضیحات</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 text-slate-900 font-vazir"
              placeholder="توضیحات فوتر"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-vazir"
          >
            {mutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateFooter;