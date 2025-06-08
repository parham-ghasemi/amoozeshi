import { useParams } from "react-router-dom"

const ArticleShowcase = () => {
  const { id } = useParams();

  return (
    <div>ArticleShowcase - id:{id}</div>
  )
}

export default ArticleShowcase