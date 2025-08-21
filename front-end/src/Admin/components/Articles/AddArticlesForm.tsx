import ImageTool from '@editorjs/image';
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import { CategoryDropDown } from '../CategoryDropDown';
import { RelatedArticlesSelector } from './RelatedArticlesSelector';
import type { ArticleShort } from '@/../types/article'
import authAxios from '@/lib/authAxios';
import ArticleCard from '@/components/cards/ArticleCard';

export default function AddArticleForm() {
  const ejInstance = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleShort[]>([]);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const response = await authAxios.post('/upload', formData);
                  return response.data;
                } catch (error) {
                  console.error('بارگذاری تصویر ناموفق بود:', error);
                  return { success: 0 };
                }
              },
            },
          },
        },
      },
      placeholder: 'مقاله خود را بنویسید...',
      i18n: {
        direction: 'rtl'
      }
    });

    ejInstance.current = editor;

    axios
      .get('http://localhost:3000/api/articles')
      .then((res) => setAllArticles(res.data))
      .catch((err) => console.error('دریافت مقالات ناموفق بود', err));

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, []);

  const handleThumbnailUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    setIsUploadingThumb(true);

    try {
      const response = await authAxios.post('/upload', formData)
      if (response.data?.success) {
        setThumbnail(response.data.file.url);
      } else {
        alert('بارگذاری تصویر کوچک ناموفق بود.');
      }
    } catch (err) {
      console.error('خطا در بارگذاری تصویر کوچک:', err);
      alert('بارگذاری تصویر کوچک ناموفق بود.');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async () => {
    const data = await ejInstance.current?.save();
    if (!title || !description || !data || !category || data.blocks.length === 0) {
      alert('عنوان، توضیحات، محتوا یا دسته‌بندی وارد نشده است!');
      return;
    }
    if (!thumbnail) {
      alert('تصویر کوچک الزامی است!');
      return;
    }

    try {
      await authAxios.post('/articles', {
        title,
        description,
        content: JSON.stringify(data),
        category,
        related: relatedArticles,
        thumbnail,
      });
      alert('مقاله منتشر شد!');
    } catch (error: any) {
      console.error('خطا در انتشار مقاله:', error);
      alert('انتشار مقاله ناموفق بود :(');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200" dir='rtl'>
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
        placeholder="عنوان مقاله"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        dir='rtl'
      />
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
        placeholder="توضیحات مقاله"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        dir='rtl'
      />
      <div className="space-y-2" dir='rtl'>
        <label className="block font-semibold text-gray-700">تصویر کوچک</label>
        <input
          type="file"
          accept="image/*"

          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setThumbnailFile(file);
              handleThumbnailUpload(file);
            }
          }}
          className="block w-full border border-gray-200 rounded-xl px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        />
        {isUploadingThumb ? (
          <p className="text-sm text-gray-500 italic">در حال بارگذاری...</p>
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt="پیش‌نمایش تصویر کوچک"
            className="mt-2 w-full max-h-64 object-cover rounded-xl border"
          />
        ) : null}
      </div>

      <div
        id="editorjs"
        className="min-h-[300px] border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400"
      />
      <CategoryDropDown value={category} setValue={setCategory} />
      <RelatedArticlesSelector
        allArticles={allArticles}
        relatedArticles={relatedArticles}
        setRelatedArticles={setRelatedArticles}
      />
      <div className="text-right pt-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleSubmit}
        >
          انتشار مقاله
        </button>
      </div>
    </div>
  );
}