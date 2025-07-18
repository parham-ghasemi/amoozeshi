import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import type { ArticleShort } from 'types/article';
import ArticleSearchBox from './article-search/ArticleSearchBox';
import ArticleCard from '@/components/cards/ArticleCard';

const ArticleSearch = () => {
  const [results, setResults] = useState<ArticleShort[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query');

  useEffect(() => {
    const fetchResults = async () => {
      // Extract query from URL
      const query = new URLSearchParams(location.search).get('search_query');
      if (query) {
        try {
          // Fetch results from backend
          const response = await axios.get(`http://localhost:3000/articles/search?query=${encodeURIComponent(query)}`);
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [location.search]); // Re-run when query changes

  if (loading) return <div>Loading...</div>;

  return (
    <div className='w-full pt-16 flex flex-col items-center min-h-screen gap-20'>
      <ArticleSearchBox initSearchTerm={searchTerm ? searchTerm : ''} />
      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-4 gap-4">
        {
          results.length > 0 && (
            results.map((item, index) => (
              <ArticleCard key={`article-${index}`} article={item} />
            ))
          )}
      </div>

    </div>
  );
};

export default ArticleSearch;