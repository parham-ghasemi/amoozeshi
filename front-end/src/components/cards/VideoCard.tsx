import { Link } from "react-router-dom";
import type { VideoShort } from "types/video";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { Edit } from "lucide-react";

const VideoCard = ({ video, editButton, onEdit }: { video: VideoShort, editButton?: boolean, onEdit?: () => void }) => {
  const date = new Date(video.createdAt);

  const res = formatDistanceToNow(date, {
    addSuffix: true,
    locale: faIR,
  });

  return (
    <div className="w-full h-[282px] flex flex-col rounded-xl transition-shadow duration-200 group relative" dir="rtl">
      <Link
        to={`/video/${video._id}`}
        className="flex flex-col cursor-pointer"
      >
        <div className="w-full h-44 rounded-xl group-hover:rounded-b-none overflow-hidden transition-all duration-200">
          <img
            src={video.thumbnail}
            alt="video-thumbnail"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative pt-2.5 px-2.5">
          <p className="text-lg font-medium mt-2.5 mb-3 line-clamp-2 pr-8"> {/* Added pr-8 to avoid overlap with button */}
            {video.title}
          </p>
          <div className="flex gap-2.5 pr-2.5">
            <p className="text-sm text-neutral-500">{res}</p>
            <p className="text-sm text-neutral-500">{`${video.visits} بازدید`}</p>
          </div>
        </div>
      </Link>
      {editButton && (
        <button
          className="cursor-pointer absolute top-[180px] left-2.5 z-10" // Adjusted top for better alignment
          onClick={(e) => {
            e.preventDefault(); // Prevent any default navigation
            e.stopPropagation(); // Stop event bubbling
            onEdit?.(); // Call onEdit safely
          }}
        >
          <Edit
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-cyan-700"
            size={20}
          />
        </button>
      )}
    </div>
  );
};

export default VideoCard;