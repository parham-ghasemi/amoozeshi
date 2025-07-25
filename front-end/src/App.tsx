import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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

// @ts-ignore
import CourseContent from "./pages/course/CourseContent"

import NotFound from "./pages/NotFound"
import CourseSearch from "./pages/course/CourseSearch"
import Dashboard from "./Admin/Dashboard"
import AdminLayout from "./Admin/AdminLayout"

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
            <Route path="/courses/search" element={<CourseSearch />} />

            {/* Videos */}
            <Route path="/videos" element={<Showvideos />} />
            <Route path="/videos/search" element={<VideoSearch />} />
            <Route path="/videos-all" element={<AllVideos />} />
            <Route path="/video/:id" element={<VideoShowcase />} />

            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="article" element={<Articles />} />
            <Route path="video" element={<Videos />} />
            <Route path="course" element={<Course />} />
          </Route>

        </Routes>
      </Router></div>
  );
}

export default App;
