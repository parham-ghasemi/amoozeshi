import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import type { VideoShort } from 'types/video'; // Adjust based on your type definition
import VideoCard from '@/components/cards/VideoCard'; // Adjust path to your video card component
import VideoSearchBox from './video-search/VideoSearchBox'

const VideoSearch = () => {
  const [results, setResults] = useState<VideoShort[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search_query');

  useEffect(() => {
    const fetchResults = async () => {
      // Extract query from URL
      const query = new URLSearchParams(location.search).get('search_query');
      console.log(query);
      if (query) {
        try {
          // Fetch results from backend
          const response = await axios.get(`http://localhost:3000/videos/search?query=${encodeURIComponent(query)}`);
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching video search results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No query, no results
      }
    };

    fetchResults();
  }, [location.search]); // Re-run when query changes

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full pt-16 flex flex-col items-center min-h-screen gap-20">
      <VideoSearchBox initSearchTerm={searchTerm ? searchTerm : ''} />
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