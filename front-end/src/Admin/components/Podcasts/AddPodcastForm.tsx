import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import ImageTool from '@editorjs/image';
import { CategoryDropDown } from '../CategoryDropDown';
import { RelatedPodcastsSelector } from './RelatedPodcastSelector';
import type { PodcastShort } from 'types/podcast';
import authAxios from '@/lib/authAxios';

export default function AddPodcastForm() {
  const ejInstance = useRef<EditorJS | null>(null);

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState('');
  const [relatedPodcasts, setRelatedPodcasts] = useState<string[]>([]);
  const [allPodcasts, setAllPodcasts] = useState<PodcastShort[]>([]);

  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

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
                  const res = await authAxios.post('http://localhost:3000/podcasts/upload', formData, {
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
      placeholder: 'توضیحات بلند درباره پادکست را بنویسید...',
      i18n: { direction: 'rtl' }
    });

    ejInstance.current = editor;

    axios
      .get('http://localhost:3000/podcasts')
      .then((res) => setAllPodcasts(res.data))
      .catch((err) => console.error('Failed to fetch podcasts', err));

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
      const res = await authAxios.post('http://localhost:3000/podcasts/upload', formData, {
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

    if (!title || !shortDesc || !thumbnail || !audioFile || !category || !longDesc) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('shortDesc', shortDesc);
    formData.append('longDesc', JSON.stringify(longDesc));
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);
    formData.append('audio', audioFile);
    formData.append('related', JSON.stringify(relatedPodcasts));

    try {
      setIsUploadingAudio(true);
      await authAxios.post('http://localhost:3000/podcasts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Podcast uploaded!');
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload podcast');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200" dir='rtl'>
      <input
        type="text"
        placeholder="عنوان پادکست..."
        className="w-full border rounded-xl px-5 py-3 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        dir="rtl"
      />
      <input
        type="text"
        placeholder="توضیحات پادکست..."
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
        <label className="font-semibold text-gray-700">آپلود فایل صوتی</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          className="block w-full border px-4 py-2 text-sm file:bg-green-50 file:text-green-700 file:rounded-lg"
        />
        {isUploadingAudio && <p className="text-sm text-gray-500">Uploading audio...</p>}
      </div>

      <div id="editorjs" className="min-h-[300px] border rounded-xl p-4 bg-gray-50" />
      <CategoryDropDown value={category} setValue={setCategory} />

      <RelatedPodcastsSelector
        allPodcasts={allPodcasts}
        relatedPodcasts={relatedPodcasts}
        setRelatedPodcasts={setRelatedPodcasts}
      />

      <div className="text-right pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          انتشار پادکست
        </button>
      </div>
    </div>
  );
}