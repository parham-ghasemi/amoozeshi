import ArticleCard from "@/components/cards/ArticleCard";
import CourseCard from "@/components/cards/CourseCard";
import VideoCard from "@/components/cards/VideoCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Profile = () => {
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await axios.get(`http://localhost:3000/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch {
      return false;
    }
  }

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">خطا در بارگذاری اطلاعات کاربر</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          پروفایل کاربر
        </h1>
        <div className="flex flex-col gap-5 mt-1.5">
          <p className="text-gray-600">
            <span className="font-semibold">نام کاربری:</span> {user.userName}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">شماره تلفن:</span> {user.phoneNumber}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">نقش:</span> {user.role}
          </p>
        </div>
      </div>

      {/* Joined Courses Section */}
      {
        user.joinedCourses?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              دوره‌های ثبت‌نام شده
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                //@ts-ignore
                user.joinedCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
            </div>
          </div>
        )}

      {/* Favorite Courses Section */}
      {user.favoriteCourses?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            دوره‌های مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              //@ts-ignore
              user.favoriteCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
          </div>
        </div>
      )}

      {/* Favorite Videos Section */}
      {user.favoriteVideos?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            ویدیوهای مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              //@ts-ignore
              user.favoriteVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
          </div>
        </div>
      )}

      {/* Favorite Articles Section */}
      {user.favoriteArticles?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            مقالات مورد علاقه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              // @ts-ignore
              user.favoriteArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;