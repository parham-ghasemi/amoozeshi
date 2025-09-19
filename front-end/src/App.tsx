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
import Settings from "./Admin/Settings"
import AuthForm from "./pages/authForm/AuthForm"
import Profile from "./pages/profile/Profile"
// import { Toaster } from "react-hot-toast"
import { Toaster } from "sonner"
import EditArticleForm from "./Admin/components/Articles/EditArticleForm"
import EditVideoForm from "./Admin/components/Videos/EditVideoForm"
import EditCourseForm from "./Admin/components/courses/EditCourseForm"
import HomePage from "./pages/Home"
import HomePageSettings from "./Admin/components/HomeSettings"
import Podcasts from "./Admin/Podcast"
import EditPodcastForm from "./Admin/components/Articles/EditPodcastForm"
import ShowPodcasts from "./pages/podcast/ShowPodcasts"
import PodcastSearch from "./pages/podcast/PodcastSearch"
import PodcastShowcase from "./pages/podcast/PodcastShowcase"
import UsersPage from "./Admin/UserPage"
import ShowCounsels from "./pages/counsel/ShowCounsels"
import CounselShowcase from "./pages/counsel/CounselShowcase"
import CounselSearch from "./pages/counsel/CouselSearch"
import EditCounselForm from "./Admin/components/Counsels/EditCounselForm"
import Counsels from "./Admin/components/Counsels"

function App() {
  return (
    <div className="bg-slate-100">
      <Toaster />
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          {/* Non-admin routes use MainLayout */}
          <Route element={<Layout />}>
            <Route path="/" index element={<HomePage />} />
            <Route path="/about" element={<About />} />

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

            {/* Counsel */}
            <Route path="/counsel" element={<ShowCounsels />} />
            <Route path="/counsel-all" element={<ShowAllCourses />} />
            <Route path="/counsel/:id" element={<CounselShowcase />} />
            <Route path="/counsel/search" element={<CounselSearch />} />

            {/* Videos */}
            <Route path="/videos" element={<Showvideos />} />
            <Route path="/videos/search" element={<VideoSearch />} />
            <Route path="/videos-all" element={<AllVideos />} />
            <Route path="/video/:id" element={<VideoShowcase />} />

            {/* Podcasts */}
            <Route path="/podcasts" element={<ShowPodcasts />} />
            <Route path="/podcasts/search" element={<PodcastSearch />} />
            <Route path="/podcast/:id" element={<PodcastShowcase />} />

            <Route path="/profile" element={<Profile />} />

            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="article" element={<Articles />} />
            <Route path="article/edit/:id" element={<EditArticleForm />} />
            <Route path="video" element={<Videos />} />
            <Route path="video/edit/:id" element={<EditVideoForm />} />
            <Route path="podcast" element={<Podcasts />} />
            <Route path="podcast/edit/:id" element={<EditPodcastForm />} />
            <Route path="course" element={<Course />} />
            <Route path="course/edit/:id" element={<EditCourseForm />} />
            <Route path="counsel" element={<Counsels />} />
            <Route path="counsel/edit/:id" element={<EditCounselForm />} />
            <Route path="settings" element={<Settings />} />
            <Route path="homepage" element={<HomePageSettings />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
