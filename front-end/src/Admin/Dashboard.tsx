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
import moment from "moment-timezone";

type VisitDataPoint = {
  _id: string; // already YYYY-MM-DD Tehran local from backend
  count: number;
};

type VisitStats = {
  today: number;
  week: number;
  month: number;
  total: number;
  chartData?: VisitDataPoint[];
};

const tz = "Asia/Tehran";

const filterDataByRange = (data: VisitDataPoint[], range: string): VisitDataPoint[] => {
  const todayStr = moment().tz(tz).format("YYYY-MM-DD");
  const weekAgo = moment().tz(tz).subtract(6, "days").format("YYYY-MM-DD");
  const monthAgo = moment().tz(tz).subtract(29, "days").format("YYYY-MM-DD");
  const yearAgo = moment().tz(tz).subtract(365, "days").format("YYYY-MM-DD");

  switch (range) {
    case "today":
      return data.filter(d => d._id === todayStr);
    case "week":
      return data.filter(d => d._id >= weekAgo);
    case "month":
      return data.filter(d => d._id >= monthAgo);
    case "year":
      return data.filter(d => d._id >= yearAgo);
    default:
      return data; // "all"
  }
};

const groupByMonthWithYear = (data: VisitDataPoint[]) => {
  const map = new Map<string, number>();

  data.forEach(({ _id, count }) => {
    const m = moment.tz(_id, "YYYY-MM-DD", tz);
    const key = m.format("YYYY-MM");
    map.set(key, (map.get(key) || 0) + count);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const m = moment.tz(key, "YYYY-MM", tz);
      const label = m.format("MMM YY"); // Persian short month + 2-digit year
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
        const res = await authAxios.get<VisitStats>('/admin/visits');
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

  const rawFiltered = Array.isArray(stats.chartData)
    ? filterDataByRange(stats.chartData, range)
    : [];

  const filteredData =
    range === "year" || range === "all"
      ? groupByMonthWithYear(rawFiltered)
      : rawFiltered;

  return (
    <div className="p-6 space-y-6 max-w-5xl flex flex-col items-center">
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
                <div className="flex flex-col gap-4 rounded" key={article._id}>
                  <ArticleCard article={article} />
                  {index < mostViewedArticles.length - 1 && (
                    <div className="w-full h-px bg-gray-200"></div>
                  )}
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
                <div className="flex flex-col gap-4 rounded" key={video._id}>
                  <VideoCard video={video} />
                  {index < mostViewedVideos.length - 1 && (
                    <div className="w-full h-px bg-gray-200"></div>
                  )}
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
              <div className="flex flex-col gap-4 rounded" key={course._id}>
                <CourseCard course={course} />
                {index < mostViewedCourses.length - 1 && (
                  <div className="w-full h-px bg-gray-200"></div>
                )}
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
