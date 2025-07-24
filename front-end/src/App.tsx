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
import Articles from "./Admin/Articles"
import ArticleSearch from "./pages/article/ArticleSearch"
import Videos from "./Admin/Videos"
import VideoSearch from "./pages/video/VideoSearch"

import Layout from "@/pages/Layout";
import Course from "./Admin/Course"
import CourseContent from "./pages/course/CourseContent"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="bg-slate-100">
      <Router>
        <Routes>
          {/* Non-admin routes use MainLayout */}
          <Route element={<Layout />}>
            <Route path="/" index element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/login" element={<Login />} />

            {/* Articles */}
            <Route path="/articles" element={<ShowArticles />} />
            <Route path="/articles/results" element={<ArticleSearch />} />
            <Route path="/articles-all" element={<AllArticles />} />
            <Route path="/article/:id" element={<ArticleShowcase />} />

            {/* Courses */}
            <Route path="/courses" element={<ShowCourses />} />
            <Route path="/courses-all" element={<ShowAllCourses />} />
            <Route path="/course/:id" element={<CourseShowcase />} />
            <Route path="/course/:id/content" element={<CourseContent />} />

            {/* Videos */}
            <Route path="/videos" element={<Showvideos />} />
            <Route path="/videos/search" element={<VideoSearch />} />
            <Route path="/videos-all" element={<AllVideos />} />
            <Route path="/video/:id" element={<VideoShowcase />} />

            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes - no layout */}
          <Route path="/admin/article" element={<Articles />} />
          <Route path="/admin/video" element={<Videos />} />
          <Route path="/admin/course" element={<Course />} />

        </Routes>
      </Router></div>
  );
}

export default App;
