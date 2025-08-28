import ArticleCard from "@/components/cards/ArticleCard";
import CourseCard from "@/components/cards/CourseCard";
import VideoCard from "@/components/cards/VideoCard";
import LogoutButton from "@/components/logout/LogoutButton";
import authAxios from "@/lib/authAxios";
import { useQuery } from "@tanstack/react-query";
import UnauthorizedProfile from "../unauthorized/UnauthorizedProfile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PodcastCard from "@/components/cards/PodcastCard";

const Profile = () => {
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await authAxios.get('/user/me');
      return res.data;
    } catch {
      return false;
    }
  };

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return <UnauthorizedProfile />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl" dir="rtl">
      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 relative">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
          پروفایل کاربر
        </h1>
        <div className="flex flex-col gap-4 sm:gap-5">
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold">نام کاربری:</span> {user.userName}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold">شماره تلفن:</span> {user.phoneNumber}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold">نقش:</span> {user.role === 'admin' ? 'ادمین' : 'هنرجو'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0 sm:absolute sm:left-3 sm:bottom-3">
          {user.role === 'admin' && (
            <Link to="/admin">
              <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                داشبورد ادمین
              </Button>
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Joined Courses Section */}
      {user.joinedCourses?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            دوره‌های ثبت‌نام شده
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.joinedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Courses Section */}
      {user.favoriteCourses?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            دوره‌های مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.favoriteCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Articles Section */}
      {user.favoriteArticles?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            مقالات مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.favoriteArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Videos Section */}
      {user.favoriteVideos?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            ویدیوهای مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.favoriteVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Podcasts Section */}
      {user.favoritePodcasts?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            پادکست‌های مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.favoritePodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;