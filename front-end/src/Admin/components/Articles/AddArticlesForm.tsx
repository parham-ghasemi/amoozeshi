import ImageTool from '@editorjs/image';
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';

export default function AddArticleForm() {
  const ejInstance = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState('');

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
              /**
               * Uploads image to your backend
               */
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append('image', file);

                try {
                  const response = await axios.post('http://localhost:3000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });

                  // Assuming your server returns: { success: 1, file: { url: 'http://...' } }
                  return response.data;
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return { success: 0 };
                }
              },
            },
          },
        },
      },
      placeholder: 'Write your article...',
    });

    ejInstance.current = editor;

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, []);

  const handleSubmit = async () => {
    const data = await ejInstance.current?.save();
    if (!data) return;

    console.log(data);

    await axios.post('http://localhost:3000/articles', {
      title,
      content: JSON.stringify(data),
      category: 'Web Development',
    });

    alert('Article posted!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-2xl">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        id="editorjs"
        className="min-h-[300px] border border-gray-300 rounded-xl p-4 bg-gray-50"
      />
      <div className="text-right">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
          onClick={handleSubmit}
        >
          Publish Article
        </button>
      </div>
    </div>
  );
}
