import ImageTool from '@editorjs/image';
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import { ArticleCategoryDropDown } from './ArticleCategoryDropDown';
import { RelatedArticlesSelector } from './RelatedArticlesSelector';
import type { ArticleShort } from '@/../types/article'

export default function AddArticleForm() {
  const ejInstance = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleShort[]>([]);

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
                  const response = await axios.post('http://localhost:3000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
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

    axios
      .get('http://localhost:3000/articles')
      .then((res) => setAllArticles(res.data))
      .catch((err) => console.error('Failed to fetch articles', err));

    return () => {
      ejInstance.current?.destroy?.();
      ejInstance.current = null;
    };
  }, []);

  const handleSubmit = async () => {
    const data = await ejInstance.current?.save();
    if (!title || !description || !data || !category || data.blocks.length === 0) {
      alert('No title, description, content or category provided!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/articles', {
        title,
        description,
        content: JSON.stringify(data),
        category,
        related: relatedArticles,
      });
      alert('Article posted!');
    } catch (error: any) {
      console.error('Error posting article:', error);
      alert('Failed to post article :(');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-3xl border border-gray-200">
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
        placeholder="Article description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div
        id="editorjs"
        className="min-h-[300px] border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400"
      />
      <ArticleCategoryDropDown value={category} setValue={setCategory} />
      <RelatedArticlesSelector
        allArticles={allArticles}
        relatedArticles={relatedArticles}
        setRelatedArticles={setRelatedArticles}
        excludeTitle={title}
      />
      <div className="text-right pt-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleSubmit}
        >
          Publish Article
        </button>
      </div>
    </div>
  );
}
