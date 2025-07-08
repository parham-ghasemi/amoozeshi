import ArticleSearchBox from "./article-search/ArticleSearchBox";

const ShowArticles = () => {

  return (
    <div className="min-h-screen w-full flex flex-col gap-15 items-center mt-16">
      <ArticleSearchBox />

      <div className="w-6xl bg-white">
      </div>
    </div>
  )
}

export default ShowArticles