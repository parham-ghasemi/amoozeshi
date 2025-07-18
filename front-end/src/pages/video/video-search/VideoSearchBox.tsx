import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoSearchBox = ({ initSearchTerm }: { initSearchTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initSearchTerm || '');
  const [searchError, setSearchError] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const encodedQuery = encodeURIComponent(searchTerm);
      navigate(`/videos/search?search_query=${encodedQuery}`);
    } else {
      setSearchError(true);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={clsx(
        'w-2xl h-14 flex justify-between items-center rounded-xl p-3 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-0.5 bg-slate-50',
        searchError && 'shadow-red-300'
      )}
    >
      <input
        type="text"
        className="h-full w-full px-3 border-none outline-none"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <button className="p-3 cursor-pointer" type="submit">
        <Search size={26} className="hover:text-slate-700" />
      </button>
    </form>
  );
};

export default VideoSearchBox;