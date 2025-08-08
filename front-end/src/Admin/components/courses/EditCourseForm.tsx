import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import authAxios from '@/lib/authAxios';

import { CategoryDropDown } from '../CategoryDropDown';
import { RelatedCoursesSelector } from './RelatedCourseSelector';
import type { VideoShort } from 'types/video';
import type { ArticleShort } from 'types/article';

function ContentSelector({
  allVideos,
  allArticles,
  contentItems,
  setContentItems,
}: {
  allVideos: VideoShort[];
  allArticles: ArticleShort[];
  contentItems: ContentItem[];
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState<'Video' | 'Article'>('Video');

  const toggleContentItem = (id: string, type: 'Video' | 'Article') => {
    setContentItems((prev) => {
      const exists = prev.some((item) => item.itemId === id && item.itemType === type);
      if (exists) {
        return prev.filter((item) => !(item.itemId === id && item.itemType === type));
      }
      return [...prev, { itemId: id, itemType: type }];
    });
  };

  const filteredVideos = allVideos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredArticles = allArticles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 border p-5 rounded-lg" dir="rtl">
      <label className="block text-gray-800 font-semibold text-sm">انتخاب محتوای دوره</label>

      <div className="flex gap-4">
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value as 'Video' | 'Article')}
          className="border rounded-xl p-2"
        >
          <option value="Video">ویدیو</option>
          <option value="Article">مقاله</option>
        </select>
        <input
          type="text"
          placeholder="جستجو بین محتوا..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {itemType === 'Video'
          ? filteredVideos.map((video) => {
            const isSelected = contentItems.some(
              (item) => item.itemId === video._id && item.itemType === 'Video'
            );
            return (
              <div
                key={video._id}
                onClick={() => toggleContentItem(video._id, 'Video')}
                className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                    ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-gray-800">{video.title}</h3>
                  <p className="text-xs text-gray-500">
                    بازدید: {video.visits} | {new Date(video.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            );
          })
          : filteredArticles.map((article) => {
            const isSelected = contentItems.some(
              (item) => item.itemId === article._id && item.itemType === 'Article'
            );
            return (
              <div
                key={article._id}
                onClick={() => toggleContentItem(article._id, 'Article')}
                className={`cursor-pointer rounded-xl border transition-all shadow-sm overflow-hidden hover:shadow-xl hover:scale-95
                    ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-gray-800">{article.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {article.description || 'بدون توضیحات'}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

interface ContentItem {
  itemId: string;
  itemType: 'Video' | 'Article';
}

export default function EditCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ejInstance = useRef<EditorJS | null>(null);

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [time, setTime] = useState<number>(0);
  const [goal, setGoal] = useState('');
  const [topics, setTopics] = useState([{ head: '', body: '' }]);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<string[]>([]);

  const [allCourses, setAllCourses] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  // Fetch course data
  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await authAxios.get(`/course/${id}`);
      return data.course;
    },
    enabled: !!id,
  });

  // Fetch courses, videos, articles for selectors
  useEffect(() => {
    authAxios.get('/courses').then(res => setAllCourses(res.data)).catch(console.error);
    authAxios.get('/videos').then(res => setAllVideos(res.data)).catch(console.error);
    authAxios.get('/articles').then(res => setAllArticles(res.data)).catch(console.error);
  }, []);

  // Initialize EditorJS & populate fields when courseData loads
  useEffect(() => {
    if (!courseData) return;

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
                const res = await authAxios.post('/upload', formData);
                return res.data;
              },
            },
          },
        },
      },
      placeholder: 'توضیحات بلند درباره دوره را بنویسید...',
      i18n: { direction: 'rtl' },
      data: courseData.longDesc,
    });

    ejInstance.current = editor;

    setTitle(courseData.title);
    setShortDesc(courseData.shortDesc);
    setThumbnail(courseData.thumbnail);
    setCategory(courseData.category?._id || '');
    setLevel(courseData.level);
    setTime(courseData.time);
    setGoal(courseData.goal);
    setTopics(courseData.topics.length ? courseData.topics : [{ head: '', body: '' }]);
    setQuestions(courseData.questions.length ? courseData.questions : [{ question: '', answer: '' }]);
    setContentItems(
      courseData.content?.map((item: any) => ({
        itemId: item.itemId._id || item.itemId,
        itemType: item.itemType,
      })) || []
    );
    setRelatedCourses(courseData.related?.map((c: any) => c._id) || []);

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, [courseData]);

  const handleThumbnailUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    setIsUploadingThumb(true);
    try {
      const res = await authAxios.post('/upload', formData);
      if (res.data?.success) setThumbnail(res.data.file.url);
      else alert('بارگذاری تصویر بند انگشتی ناموفق بود');
    } catch {
      alert('خطا در بارگذاری تصویر بند انگشتی');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const longDescData = await ejInstance.current?.save();

      if (
        !title ||
        !shortDesc ||
        !thumbnail ||
        !category ||
        !level ||
        !goal ||
        !longDescData ||
        time <= 0
      ) {
        throw new Error('تمام فیلدهای الزامی باید پر شوند');
      }

      return authAxios.patch(`/course/${id}`, {
        title,
        shortDesc,
        thumbnail,
        longDesc: JSON.stringify(longDescData),
        category,
        time,
        level,
        goal,
        topics,
        questions,
        content: contentItems,
        related: relatedCourses,
      });
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['course', id]);
      navigate('/admin/course'); // or wherever you want to go
    },
    onError: (error: any) => {
      alert(error.message || 'خطا در به‌روزرسانی دوره');
    },
  });

  if (isLoading) return <p className="text-center">در حال بارگذاری...</p>;

  return (
    <div
      className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200"
      dir="rtl"
    >
      <input
        type="text"
        placeholder="عنوان دوره"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        dir="rtl"
      />
      <input
        type="text"
        placeholder="توضیح کوتاه"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        dir="rtl"
      />

      <div className="space-y-2">
        <label className="font-semibold text-gray-700">عکس</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
          className="block w-full border px-4 py-2 text-sm file:bg-blue-50 file:text-blue-700 file:rounded-lg"
        />
        {isUploadingThumb && <p className="text-sm text-gray-500">در حال بارگذاری...</p>}
        {thumbnail && (
          <img
            src={thumbnail}
            className="mt-2 w-full max-h-64 object-cover rounded-xl"
            alt="Thumbnail preview"
          />
        )}
      </div>

      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />

      <CategoryDropDown value={category} setValue={setCategory} />

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-700">تایین سطح و زمان</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min={1}
            placeholder="مدت زمان (ساعت)"
            className="border rounded-lg px-4 py-3 w-full overflow-hidden"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border rounded-lg px-4 py-3 w-full"
          >
            <option value="">انتخاب سطح</option>
            <option value="Beginner">مبتدی</option>
            <option value="Intermediate">متوسط</option>
            <option value="Advanced">پیشرفته</option>
          </select>
        </div>
      </div>

      <input
        type="text"
        placeholder="هدف دوره"
        className="w-full border rounded-lg px-5 py-3 text-lg"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        dir="rtl"
      />

      {/* Topics */}
      <div className="space-y-2">
        <label className="font-semibold">موضوعات دوره</label>
        {topics.map((t, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              placeholder="عنوان"
              value={t.head}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[i].head = e.target.value;
                setTopics(newTopics);
              }}
              className="border rounded-lg p-2 text-right overflow-hidden"
            />
            <input
              placeholder="توضیح"
              value={t.body}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[i].body = e.target.value;
                setTopics(newTopics);
              }}
              className="border rounded-lg p-2 text-right overflow-hidden"
            />
          </div>
        ))}
        <button
          onClick={() => setTopics([...topics, { head: '', body: '' }])}
          className="text-sm text-blue-500"
        >
          + افزودن موضوع
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <label className="font-semibold">سوالات متداول</label>
        {questions.map((q, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              placeholder="سوال"
              value={q.question}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[i].question = e.target.value;
                setQuestions(newQs);
              }}
              className="border rounded-lg p-2 text-right overflow-hidden"
            />
            <input
              placeholder="پاسخ"
              value={q.answer}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[i].answer = e.target.value;
                setQuestions(newQs);
              }}
              className="border rounded-lg p-2 text-right overflow-hidden"
            />
          </div>
        ))}
        <button
          onClick={() => setQuestions([...questions, { question: '', answer: '' }])}
          className="text-sm text-blue-500"
        >
          + افزودن سوال
        </button>
      </div>

      {/* Content Items */}
      <ContentSelector
        allVideos={allVideos}
        allArticles={allArticles}
        contentItems={contentItems}
        setContentItems={setContentItems}
      />

      {/* Related Courses */}
      <RelatedCoursesSelector
        allCourses={allCourses}
        relatedCourses={relatedCourses}
        setRelatedCourses={setRelatedCourses}
      />

      <div className="text-right pt-4">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {mutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>
    </div>
  );
}
