import { useParams } from "react-router-dom";

const CourseShowcase = () => {
  const { id } = useParams();

  return (
    <div>CourseShowcase - id: {id}</div>
  )
}

export default CourseShowcase