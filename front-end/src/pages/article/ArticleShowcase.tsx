import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

const ArticleShowcase = () => {
  const { id } = useParams();
  const editorRef = useRef<EditorJS | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/articles/${id}`);
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article && article.content) {
      console.log(JSON.parse(article.content));
      const editor = new EditorJS({
        holder: "readOnlyEditor",
        readOnly: true,
        data: JSON.parse(article.content),
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
            },
          },
        },
      });

      editorRef.current = editor;

      return () => {
        editorRef.current?.destroy?.();
        editorRef.current = null;
      };
    }
  }, [article]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!article) return <div className="p-6 text-center">Article not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <h2 className="text-2xl font-semibold">{article.description}</h2>
      <div id="readOnlyEditor" className="min-h-[300px] bg-gray-50 p-4 border border-gray-300 rounded-xl" />
      <p className="text-xl font-semibold">category: {article.category}</p>
    </div>
  );
};

export default ArticleShowcase;
