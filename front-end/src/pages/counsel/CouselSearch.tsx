import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { CounselShort } from 'types/counsel';
import CounselCard from '@/components/cards/CounselCard';
import CounselSearchBox from './counsel-search/CounselSearchBox';

const fetchSearchResults = async (query: string): Promise<CounselShort[]> => {
  const res = await axios.get(`/api/counsels/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

const CounselSearch = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query') || '';

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-counsels', searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: !!searchTerm,
  });

  if (isLoading) return <div className="pt-20 text-center">در حال بارگذاری...</div>;
  if (isError) return <div className="pt-20 text-center text-red-500">خطایی در دریافت نتایج جستجو رخ داد.</div>;

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-10 sm:gap-16 px-4 sm:px-6 lg:px-12">
      <div className="w-full max-w-4xl">
        <CounselSearchBox initSearchTerm={searchTerm} />
      </div>

      <div className="w-full max-w-7xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 sm:p-6 lg:p-10">
        {results.length > 0 ? (
          results.map((item, index) => (
            <CounselCard key={`counsel-${index}`} counsel={item} />
          ))
        ) : (
          <p className="text-center col-span-full py-6 text-gray-500">هیچ مشاوره‌ای یافت نشد.</p>
        )}
      </div>
    </div>
  );
};

export default CounselSearch;