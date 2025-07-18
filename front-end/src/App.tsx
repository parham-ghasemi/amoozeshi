import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ShowArticles from "./pages/article/ShowArticles"
import AllArticles from "./pages/article/AllArticles"
import ArticleShowcase from "./pages/article/ArticleShowcase"
import ShowCourses from "./pages/course/ShowCourses"
import CourseShowcase from "./pages/course/CourseShowcase"
import ShowAllCourses from "./pages/course/AllCourses"
import Showvideos from "./pages/video/ShowVideos"
import AllVideos from "./pages/video/AllVideos"
import About from "./pages/About"
import VideoShowcase from "./pages/video/VideoShowcase"
import Login from "./pages/login/Login"
import Seed from "./seed/Seed"
import Articles from "./Admin/Articles"
import ArticleSearch from "./pages/article/ArticleSearch"
import Videos from "./Admin/Videos"
import VideoSearch from "./pages/video/VideoSearch"

export default function App() {
  return (
    <div className="bg-slate-100">
      <Router>
        <Routes>
          {/* test */}
          <Route path="/seed" element={<Seed />} />

          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/login" element={<Login />} />
          {/* Article */}
          <Route path="/articles" element={<ShowArticles />} />
          <Route path="/articles/results" element={<ArticleSearch />} />
          <Route path="/articles-all" element={<AllArticles />} />
          <Route path="/article/:id" element={<ArticleShowcase />} />
          {/* course */}
          <Route path="/courses" element={<ShowCourses />} />
          <Route path="/courses-all" element={<ShowAllCourses />} />
          <Route path="/course/:id" element={<CourseShowcase />} />
          {/* video */}
          <Route path="/videos" element={<Showvideos />} />
          <Route path="/videos/search" element={<VideoSearch />} />
          <Route path="/videos-all" element={<AllVideos />} />
          <Route path="/video/:id" element={<VideoShowcase />} />

          {/* admin */}
          <Route path="/admin/article" element={<Articles />} />
          <Route path="/admin/video" element={<Videos />} />
        </Routes>
      </Router>
    </div>
  )
}
