import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PodcastShort } from 'types/podcast';
import PodcastCard from '@/components/cards/PodcastCard';
import PodcastSearchBox from './search/PodcastSearchBox';

const fetchSearchResults = async (query: string): Promise<PodcastShort[]> => {
  const res = await axios.get(`/api/podcasts/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

const PodcastSearch = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query') || '';

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-podcasts', searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: !!searchTerm,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching podcasts.</div>;

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-20" dir='rtl'>
      <PodcastSearchBox initSearchTerm={searchTerm} />
      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-4 gap-4 p-10">
        {results.length > 0 ? (
          results.map((item, index) => (
            <PodcastCard key={`podcast-${index}`} podcast={item} />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">No podcasts found</div>
        )}
      </div>
    </div>
  );
};

export default PodcastSearch;