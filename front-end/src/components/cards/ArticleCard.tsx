import { Link } from "react-router-dom";
import type { ArticleShort } from "types/article";

const ArticleCard = ({ article }: { article: ArticleShort }) => {
  return (
    <div className="h-[262px] sm:h-[362px] w-full max-w-xs mx-auto border rounded-xl overflow-hidden pb-2.5 relative hover:shadow-xl hover:scale-[102%] transition-transform cursor-context-menu">
      <img src={article.thumbnail} alt="article thumbnail" className="w-full h-24 sm:h-36 object-cover" />
      <div className="p-2 sm:p-2.5 space-y-2 sm:space-y-3.5">
        <p className="font-bold text-sm sm:text-base line-clamp-2">{article.title}</p>
        <p className="font-light text-xs sm:text-sm line-clamp-4">{article.description}</p>
      </div>
      <Link to={`/article/${article._id}`} className="absolute left-2 sm:left-2.5 right-2 sm:right-2.5 bottom-2 sm:bottom-2.5">
        <button className="w-full rounded-md py-2 text-xs sm:text-sm bg-blue-100 cursor-pointer hover:bg-blue-200">
          مشاهده مقاله
        </button>
      </Link>
    </div>
  );
};

export default ArticleCard;