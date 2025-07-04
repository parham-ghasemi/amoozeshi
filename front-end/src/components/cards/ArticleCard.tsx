import { Link } from "react-router-dom"
import type { ArticleShort } from "types/article"

const ArticleCard = ({ article }: { article: ArticleShort }) => {
  return (
    <div className="h-[362px] w-72 border rounded-xl overflow-hidden pb-2.5 relative">
      <img src={article.thumbnail} alt="article thumbnail" className="h-36 w-full" />
      <div className="p-2.5 space-y-3.5 ">
        <p className="font-bold text-base">{article.title}</p>
        <p className="font-light text-sm line-clamp-4">{article.description}</p>
      </div>
      <Link to={`/article/${article._id}`} className="absolute left-2.5 right-2.5 bottom-2.5">
        <button className="w-full rounded-md py-2.5 text-xs bg-blue-100 cursor-pointer">مشاهده مقاله</button>
      </Link>
    </div>
  )
}

export default ArticleCard