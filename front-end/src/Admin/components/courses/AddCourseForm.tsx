import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import ImageTool from '@editorjs/image';
import { CategoryDropDown } from '../CategoryDropDown';
import { RelatedCoursesSelector } from './RelatedCourseSelector';
import type { CourseShort } from 'types/course';
import type { VideoShort } from 'types/video';
import type { ArticleShort } from 'types/article';

interface ContentItem {
  itemId: string;
  itemType: 'video' | 'article';
}

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
  const [itemType, setItemType] = useState<'video' | 'article'>('video');

  const toggleContentItem = (id: string, type: 'video' | 'article') => {
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
          onChange={(e) => setItemType(e.target.value as 'video' | 'article')}
          className="border rounded-xl p-2"
        >
          <option value="video">ویدیو</option>
          <option value="article">مقاله</option>
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
        {itemType === 'video'
          ? filteredVideos.map((video) => {
            const isSelected = contentItems.some(
              (item) => item.itemId === video._id && item.itemType === 'video'
            );
            return (
              <div
                key={video._id}
                onClick={() => toggleContentItem(video._id, 'video')}
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
              (item) => item.itemId === article._id && item.itemType === 'article'
            );
            return (
              <div
                key={article._id}
                onClick={() => toggleContentItem(article._id, 'article')}
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

export default function AddCourseForm() {
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
  const [allCourses, setAllCourses] = useState<CourseShort[]>([]);
  const [allVideos, setAllVideos] = useState<VideoShort[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleShort[]>([]);
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
                const res = await axios.post('http://localhost:3000/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                return res.data;
              },
            },
          },
        },
      },
      placeholder: 'توضیحات بلند درباره دوره را بنویسید...',
      i18n: { direction: 'rtl' },
    });

    ejInstance.current = editor;

    // Fetch courses
    axios
      .get('http://localhost:3000/courses')
      .then((res) => setAllCourses(res.data))
      .catch((err) => console.error('Failed to fetch courses', err));

    // Fetch videos
    axios
      .get('http://localhost:3000/videos')
      .then((res) => setAllVideos(res.data))
      .catch((err) => console.error('Failed to fetch videos', err));

    // Fetch articles
    axios
      .get('http://localhost:3000/articles')
      .then((res) => setAllArticles(res.data))
      .catch((err) => console.error('Failed to fetch articles', err));

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
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) setThumbnail(res.data.file.url);
      else alert('Thumbnail upload failed');
    } catch {
      alert('Failed to upload thumbnail');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async () => {
    const longDescData = await ejInstance.current?.save();

    if (!title || !shortDesc || !thumbnail || !category || !level || !goal || !longDescData || time <= 0) {
      alert('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:3000/courses', {
        title,
        shortDesc,
        thumbnail,
        longDesc: JSON.stringify(longDescData), // Stringify EditorJS output
        category,
        time,
        level,
        goal,
        topics,
        questions,
        content: contentItems,
        related: relatedCourses,
      });
      alert('Course uploaded!');
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload course');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200">
      <input
        type="text"
        placeholder="Course title"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        dir="rtl"
      />
      <input
        type="text"
        placeholder="Short description"
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        dir="rtl"
      />

      <div className="space-y-2">
        <label className="font-semibold text-gray-700">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleThumbnailUpload(file);
          }}
          className="block w-full border px-4 py-2 text-sm file:bg-blue-50 file:text-blue-700 file:rounded-lg"
        />
        {isUploadingThumb && <p className="text-sm text-gray-500">Uploading...</p>}
        {thumbnail && <img src={thumbnail} className="mt-2 w-full max-h-64 object-cover rounded-xl" />}
      </div>

      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />
      <CategoryDropDown value={category} setValue={setCategory} />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          min={1}
          placeholder="Time (hours)"
          className="border rounded-lg px-4 py-3 w-full overflow-hidden"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded-lg px-4 py-3 w-full"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Course goal"
        className="w-full border rounded-lg px-5 py-3 text-lg"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        dir="rtl"
      />

      {/* Topics */}
      <div className="space-y-2">
        <label className="font-semibold">Course Topics</label>
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
        <button onClick={() => setTopics([...topics, { head: '', body: '' }])} className="text-sm text-blue-500">
          + Add Topic
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <label className="font-semibold">FAQs</label>
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
          + Add Question
        </button>
      </div>

      {/* Content Items */}
      <ContentSelector
        allVideos={allVideos}
        allArticles={allArticles}
        contentItems={contentItems}
        setContentItems={setContentItems}
      />

      <RelatedCoursesSelector
        allCourses={allCourses}
        relatedCourses={relatedCourses}
        setRelatedCourses={setRelatedCourses}
      />

      <div className="text-right pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          Create Course
        </button>
      </div>
    </div>
  );
}