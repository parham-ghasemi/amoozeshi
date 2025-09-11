import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import ImageTool from '@editorjs/image';
import { CategoryDropDown } from '../CategoryDropDown';
import { RelatedVideosSelector } from './RelatedVideosSelector'; // <-- Use the one we made
import type { VideoShort } from 'types/video';
import authAxios from '@/lib/authAxios';

export default function AddVideoForm() {
  const ejInstance = useRef<EditorJS | null>(null);

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState('');
  const [relatedVideos, setRelatedVideos] = useState<string[]>([]);
  const [allVideos, setAllVideos] = useState<VideoShort[]>([]);

  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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
                  const res = await authAxios.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  return res.data;
                } catch {
                  return { success: 0 };
                }
              },
            },
          },
        },
      },
      placeholder: 'توضیحات بلند درباره ویدیو را بنویسید...',
      i18n: { direction: 'rtl' }
    });

    ejInstance.current = editor;

    axios
      .get('/api/videos') // yes, typo in backend route
      .then((res) => setAllVideos(res.data))
      .catch((err) => console.error('Failed to fetch videos', err));

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
      const res = await authAxios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setThumbnail(res.data.file.url);
      } else alert('Thumbnail upload failed');
    } catch {
      alert('Failed to upload thumbnail');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async () => {
    const longDesc = await ejInstance.current?.save();

    if (!title || !shortDesc || !thumbnail || !videoFile || !category || !longDesc) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('shortDesc', shortDesc);
    formData.append('longDesc', JSON.stringify(longDesc));
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);
    formData.append('video', videoFile);
    formData.append('related', JSON.stringify(relatedVideos));

    try {
      setIsUploadingVideo(true);
      await authAxios.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Video uploaded!');
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200" dir='rtl'>
      <input
        type="text"
        placeholder="عنوان ویدئو..."
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        dir="rtl"
      />
      <input
        type="text"
        placeholder="توضیحات ویدئو..."
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        dir="rtl"
      />
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">تصویر کوچک</label>
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
          className="block w-full border px-4 py-2 text-sm file:bg-blue-50 file:text-blue-700 file:rounded-lg"
        />
        {isUploadingThumb && <p className="text-sm text-gray-500">Uploading...</p>}
        {thumbnail && <img src={thumbnail} className="mt-2 w-full max-h-64 object-cover rounded-xl" />}
      </div>

      <div className="space-y-2">
        <label className="font-semibold text-gray-700">آپلود ویدئو</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="block w-full border px-4 py-2 text-sm file:bg-green-50 file:text-green-700 file:rounded-lg"
        />
        {isUploadingVideo && <p className="text-sm text-gray-500">Uploading video...</p>}
      </div>

      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />
      <CategoryDropDown value={category} setValue={setCategory} />

      <RelatedVideosSelector
        allVideos={allVideos}
        relatedVideos={relatedVideos}
        setRelatedVideos={setRelatedVideos}
      />

      <div className="text-right pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          انتشار ویدئو
        </button>
      </div>
    </div>
  );
}
