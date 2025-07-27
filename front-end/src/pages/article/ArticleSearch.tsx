import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ArticleShort } from 'types/article';
import ArticleSearchBox from './article-search/ArticleSearchBox';
import ArticleCard from '@/components/cards/ArticleCard';

const fetchSearchResults = async (query: string): Promise<ArticleShort[]> => {
  const res = await axios.get(`http://localhost:3000/articles/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

const ArticleSearch = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query') || '';

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-articles', searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: !!searchTerm, // only run query if searchTerm exists
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>خطایی در دریافت نتایج جستجو رخ داد.</div>;

  return (
    <div className='w-full pt-16 flex flex-col items-center min-h-screen gap-20'>
      <ArticleSearchBox initSearchTerm={searchTerm} />
      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-4 gap-4">
        {results.length > 0 ? (
          results.map((item, index) => (
            <ArticleCard key={`article-${index}`} article={item} />
          ))
        ) : (
          <p className="text-center col-span-4 py-6 text-gray-500">هیچ مقاله‌ای یافت نشد.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleSearch;
