import { useEffect, useState } from 'react';
import StatCard from './components/dashboard/StatCard';
import axios from 'axios';
import { Chart } from './components/dashboard/Chart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ArticleShort } from 'types/article';
import type { CourseShort } from 'types/course';
import type { VideoShort } from 'types/video';
import ArticleCard from '@/components/cards/ArticleCard';
import VideoCard from '@/components/cards/VideoCard';
import CourseCard from '@/components/cards/CourseCard';
import authAxios from "@/lib/authAxios";

type VisitDataPoint = {
  _id: string;
  count: number;
};

type VisitStats = {
  today: number;
  week: number;
  month: number;
  total: number;
  chartData?: VisitDataPoint[]; // Make chartData optional to handle undefined case
};

const filterDataByRange = (data: VisitDataPoint[], range: string): VisitDataPoint[] => {
  const now = new Date();
  return data.filter(({ _id }) => {
    const date = new Date(_id);
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (range) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        return diffDays < 7;
      case "month":
        return diffDays < 30;
      case "year":
        return diffDays < 365;
      default:
        return true; // "all"
    }
  });
};

const groupByMonthWithYear = (data: VisitDataPoint[]) => {
  const map = new Map<string, number>();

  data.forEach(({ _id, count }) => {
    const d = new Date(_id);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) || 0) + count);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [year, month] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      const label = date.toLocaleDateString("fa-IR", {
        month: "short",
        year: "2-digit",
      });
      return { _id: label, count };
    });
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [range, setRange] = useState("week");
  const [mostViewedArticles, setMostViewedArticles] = useState<ArticleShort[]>([]);
  const [mostViewedVideos, setMostViewedVideos] = useState<VideoShort[]>([]);
  const [mostViewedCourses, setMostViewedCourses] = useState<CourseShort[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authAxios.get<VisitStats>('/api/admin/visits');
        // Ensure chartData is an array, default to empty array if undefined
        setStats({ ...res.data, chartData: res.data.chartData || [] });
      } catch (err) {
        console.error('خطا در دریافت آمار:', err);
        setError('خطا در بارگذاری آمار');
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles/most-viewed');
        setMostViewedArticles(res.data || []);
      } catch (err) {
        console.error('خطا در دریافت مقالات محبوب:', err);
        setError('خطا در بارگذاری مقالات');
      } finally {
        setLoadingArticles(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videos/most-viewed');
        setMostViewedVideos(res.data || []);
      } catch (err) {
        console.error('خطا در دریافت ویدئوهای محبوب:', err);
        setError('خطا در بارگذاری ویدئوها');
      } finally {
        setLoadingVideos(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses/most-popular');
        setMostViewedCourses(res.data || []);
      } catch (err) {
        console.error('خطا در دریافت دوره‌های محبوب:', err);
        setError('خطا در بارگذاری دوره‌ها');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchStats();
    fetchArticles();
    fetchVideos();
    fetchCourses();
  }, []);

  if (loadingStats || loadingArticles || loadingVideos || loadingCourses) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error || !stats) {
    return <p>{error || 'آماری موجود نیست.'}</p>;
  }

  // Ensure chartData is an array before filtering
  const rawFiltered = Array.isArray(stats.chartData)
    ? filterDataByRange(stats.chartData, range)
    : [];

  const filteredData =
    range === "year" || range === "all"
      ? groupByMonthWithYear(rawFiltered)
      : rawFiltered;

  return (
    <div className="p-6 space-y-6 w-5xl flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="تعداد بازدید کل" value={stats.total} />
        <StatCard label="تعداد بازدید این ماه" value={stats.month} />
        <StatCard label="تعداد بازدید این هفته" value={stats.week} />
        <StatCard label="تعداد بازدید امروز" value={stats.today} />
      </div>

      <div className="w-full">
        {filteredData.length > 0 ? (
          <Chart data={filteredData} range={range} setRange={setRange} />
        ) : (
          <p>داده‌ای برای نمایش نمودار موجود نیست.</p>
        )}
      </div>

      <div className="flex flex-row-reverse gap-11 w-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row-reverse justify-between items-center">
            <p className="text-lg font-bold">محبوب‌ترین مقاله‌ها</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {mostViewedArticles.length > 0 ? (
              mostViewedArticles.map((article, index) => (
                <div className="flex-0 flex flex-col gap-4 rounded" key={`${article._id}-${index}`}>
                  <ArticleCard article={article} />
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
              ))
            ) : (
              <p>مقاله‌ای موجود نیست.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row-reverse justify-between items-center">
            <p className="text-lg font-bold">محبوب‌ترین ویدئوها</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {mostViewedVideos.length > 0 ? (
              mostViewedVideos.map((video, index) => (
                <div className="flex-0 flex flex-col gap-4 rounded" key={`${video._id}-${index}`}>
                  <VideoCard video={video} />
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
              ))
            ) : (
              <p>ویدئویی موجود نیست.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full flex flex-col">
        <CardHeader className="flex flex-row-reverse justify-between items-center">
          <p className="text-lg font-bold">محبوب‌ترین دوره‌ها</p>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
          {mostViewedCourses.length > 0 ? (
            mostViewedCourses.map((course, index) => (
              <div className="flex-0 flex flex-col gap-4 rounded" key={`${course._id}-${index}`}>
                <CourseCard course={course} />
                <div className="w-full h-px bg-gray-200"></div>
              </div>
            ))
          ) : (
            <p>دوره‌ای موجود نیست.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
