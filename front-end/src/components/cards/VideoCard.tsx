import { Link } from "react-router-dom";
import type { VideoShort } from "types/video";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

const VideoCard = ({ video }: { video: VideoShort[] }) => {
  const date = new Date("2025-07-11T22:44:10.571Z");

  const res = formatDistanceToNow(date, {
    addSuffix: true,
    locale: faIR,
  });

  return (
    <div className="w-[290px] h-[282px] flex flex-col cursor-pointer rounded-xl hover:shadow-xl transition-shadow duration-200 group">
      <div className="w-full h-44 rounded-xl group-hover:rounded-b-none overflow-hidden transition-all duration-200">
        <img src={video[0].thumbnail} alt="video-thumbnail" className="h-full w-full object-cover" />
      </div>
      <p className="text-lg font-medium mt-2.5 mb-3 line-clamp-2 pt-2.5 pr-2.5">{video[0].title}</p>
      <div className="flex gap-2.5 pt-2.5 pr-2.5">
        <p className="text-sm text-neutral-500">{res}</p>
        <p className="text-sm text-neutral-500">{`${video[0].visits} بازدید`}</p>
      </div>
    </div>
  );
};

export default VideoCard;