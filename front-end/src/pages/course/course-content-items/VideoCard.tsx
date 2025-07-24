import { Link } from "react-router-dom";
import type { VideoShort } from "types/video";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

const VideoCard = ({ video }: { video: VideoShort }) => {
  const date = new Date(video.createdAt);

  const res = formatDistanceToNow(date, {
    addSuffix: true,
    locale: faIR,
  });

  return (
    <Link
      to={`/video/${video._id}`}
      className="w-full flex flex-col cursor-pointer rounded-xl hover:shadow-xl transition-shadow duration-200 group relative"
      dir="rtl"
    >
      <div className="w-full h-80 rounded-xl group-hover:rounded-b-none overflow-hidden transition-all duration-200">
        <img
          src={video.thumbnail}
          alt="video-thumbnail"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-lg font-medium mt-2.5 mb-3 line-clamp-2 p-6 pb-0">
        {video.title}
      </p>
      <div className="flex gap-2.5 p-6 pt-0 pb-1.5">
        <p className="text-sm text-neutral-500 leading-[200%]">{res}</p>
        <p className="text-sm text-neutral-500 leading-[200%]">{`${video.visits} بازدید`}</p>
      </div>
      <p className="w-fit self-end ml-6 mb-6 py-1 px-1.5 shadow shadow-emerald-500 rounded-full text-sm font-light text-emerald-500 group-hover:scale-110 transition-all">ویدئو</p>
    </Link>
  );
};

export default VideoCard;
