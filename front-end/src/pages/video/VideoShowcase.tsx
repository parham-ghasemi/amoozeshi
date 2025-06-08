import { useParams } from "react-router-dom"

const VideoShowcase = () => {
  const { id } = useParams();

  return (
    <div>VideoShowcase - id: {id}</div>
  )
}

export default VideoShowcase