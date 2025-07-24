import { Link } from "react-router-dom";
import type { ArticleShort } from "types/article"

const ArticleCard = ({ article }: { article: ArticleShort }) => {
  return (
    <Link
      to={`/article/${article._id}`}
      className="w-full flex flex-col cursor-pointer rounded-xl hover:shadow-xl transition-shadow duration-200 group relative"
      dir="rtl"
    >
      {/* ARticle */}
      <div className="w-full h-80 rounded-xl group-hover:rounded-b-none overflow-hidden transition-all duration-200">
        <img
          src={article.thumbnail}
          alt="article-thumbnail"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-lg font-medium mt-2.5 mb-3 line-clamp-2 p-6 pb-0">
        {article.title}
      </p>
      <p className="text-sm font-normal leading-[200%] mb-3 p-6 pt-0 pb-1.5">
        {`${article.description}`}
      </p>
      <p className="w-fit self-end ml-6 mb-6 py-1 px-1.5 shadow shadow-cyan-500 rounded-full text-sm font-light text-cyan-500 group-hover:scale-110 transition-all">مقاله</p>
    </Link>
  );
}

export default ArticleCard