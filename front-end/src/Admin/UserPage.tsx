import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import authAxios from "@/lib/authAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseCard from "@/components/cards/CourseCard";
import VideoCard from "@/components/cards/VideoCard";
import ArticleCard from "@/components/cards/ArticleCard";
import PodcastCard from "@/components/cards/PodcastCard";
import UnauthorizedAdmin from "@/pages/profile/UnauthorizedAdmin";
import { CourseShort } from "types/course";
import { VideoShort } from "types/video";
import { ArticleShort } from "types/article";
import { PodcastShort } from "types/podcast";

interface User {
  _id: string;
  userName: string;
  phoneNumber: number;
  role: "admin" | "user";
  isVerified: boolean;
  favoriteCourses: CourseShort[];
  joinedCourses: CourseShort[];
  favoriteVideos: VideoShort[];
  favoriteArticles: ArticleShort[];
  favoritePodcasts: PodcastShort[];
}

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await authAxios.get("/users");
    return res.data;
  };

  const { data: users, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["get-all-users"],
    queryFn: getAllUsers,
  });

  // Filter users based on search query
  const filteredUsers = users?.filter((user) =>
    [user.userName, user.phoneNumber.toString(), user.role === "admin" ? "ادمین" : "هنرجو"]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !users) {
    return <UnauthorizedAdmin />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl" dir="rtl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        همه کاربران
      </h1>
      <div className="mb-4 sm:mb-6">
        <Input
          type="text"
          placeholder="جستجو بر اساس نام کاربری، شماره تلفن یا نقش..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">نام کاربری</TableHead>
            <TableHead className="text-right">شماره تلفن</TableHead>
            <TableHead className="text-right">نقش</TableHead>
            <TableHead className="text-right">جزئیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role === "admin" ? "ادمین" : "هنرجو"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    مشاهده جزئیات
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                هیچ کاربری با این مشخصات یافت نشد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent showCloseButton={false} className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={() => setSelectedUser(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
          <DialogHeader>
            <DialogTitle className="text-start">جزئیات کاربر</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 space-y-3">
                <h3 className="text-lg font-semibold mb-3">اطلاعات کاربر</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">نام کاربری:</span> {selectedUser.userName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">شماره تلفن:</span> {selectedUser.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">نقش:</span> {selectedUser.role === "admin" ? "ادمین" : "هنرجو"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">وضعیت تأیید:</span> {selectedUser.isVerified ? "تأیید شده" : "تأیید نشده"}
                </p>
              </div>

              {selectedUser.joinedCourses?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">دوره‌های ثبت‌نام شده</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.joinedCourses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.favoriteCourses?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">دوره‌های مورد علاقه</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.favoriteCourses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.favoriteVideos?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">ویدیوهای مورد علاقه</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.favoriteVideos.map((video) => (
                      <VideoCard key={video._id} video={video} />
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.favoriteArticles?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">مقالات مورد علاقه</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.favoriteArticles.map((article) => (
                      <ArticleCard key={article._id} article={article} />
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.favoritePodcasts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">پادکست‌های مورد علاقه</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.favoritePodcasts.map((podcast) => (
                      <PodcastCard key={podcast._id} podcast={podcast} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;