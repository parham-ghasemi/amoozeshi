import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { VideoShort } from 'types/video';
import VideoCard from '@/components/cards/VideoCard';
import VideoSearchBox from './video-search/VideoSearchBox';

const fetchSearchResults = async (query: string): Promise<VideoShort[]> => {
  const res = await axios.get(`http://localhost:3000/videos/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

const VideoSearch = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query') || '';

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search-videos', searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: !!searchTerm,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching videos.</div>;

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-20" dir='rtl'>
      <VideoSearchBox initSearchTerm={searchTerm} />
      <div className="w-6xl min-h-96 bg-slate-50 rounded-2xl grid grid-cols-4 gap-4 p-10">
        {results.length > 0 ? (
          results.map((item, index) => (
            <VideoCard key={`video-${index}`} video={item} />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">No videos found</div>
        )}
      </div>
    </div>
  );
};

export default VideoSearch;
