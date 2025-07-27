import { useEffect, useState } from 'react';
import StatCard from './components/dashboard/StatCard';
import axios from 'axios';
import { Chart } from './components/dashboard/Chart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
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
  chartData: VisitDataPoint[];
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

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("week");
  const [mostViewedArticles, setMostViewedArticles] = useState<ArticleShort[]>([]);
  const [mostViewedVideos, setMostViewedVideos] = useState<VideoShort[]>([]);
  const [mostViewedCourses, setMostViewedCourses] = useState<CourseShort[]>([]);

  useEffect(() => {
    authAxios
      .get<VisitStats>('http://localhost:3000/admin/visits')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('خطا در دریافت آمار:', err);
      }).then(() => {
        axios.get('http://localhost:3000/articles/most-viewed').then((res) => {
          setMostViewedArticles(res.data)
        }).catch((err) => {
          console.error('خطا در دریافت مقالات محبوب', err);
        }).then(() => {
          axios.get('http://localhost:3000/videos/most-viewed').then((res) => {
            setMostViewedVideos(res.data)
          }).catch((err) => {
            console.error('خطا در دریافت ویدئو های محبوب', err);
          })
        }).then(() => {
          axios.get('http://localhost:3000/courses/most-popular').then((res) => {
            setMostViewedCourses(res.data);
          }).catch((err) => {
            console.error('خطا در دریافت دوره های محبوب', err);
          })
        })
      }).finally(() => setLoading(false));

  }, []);

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
        }); // e.g. تیر ۰۳
        return { _id: label, count };
      });
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!stats) return <p>آماری موجود نیست.</p>;

  const rawFiltered = filterDataByRange(stats.chartData, range);
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
        <Chart data={filteredData} range={range} setRange={setRange} />
      </div>

      <div className="flex flex-row-reverse gap-11 w-full">
        <Card className='flex-1 flex flex-col'>
          <CardHeader className='flex flex-row-reverse justify-between items-center'>
            <p className='text-lg font-bold'>محبوب ترین مقاله ها</p>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 max-h-[400px] overflow-y-auto'>
            {mostViewedArticles.map((article, index) => (
              <div className="flex-0 flex flex-col gap-4 rounded" key={`${article._id}-${index}`}>
                <ArticleCard article={article} />
                <div className="w-full h-px bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>


        <Card className='flex-1 flex flex-col'>
          <CardHeader className='flex flex-row-reverse justify-between items-center'>
            <p className='text-lg font-bold'>محبوب ترین ویدئو ها</p>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 max-h-[400px] overflow-y-auto'>
            {mostViewedVideos.map((video, index) => (
              <div className="flex-0 flex flex-col gap-4 rounded" key={`${video._id}-${index}`}>
                <VideoCard video={video} />
                <div className="w-full h-px bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className='w-full flex flex-col'>
        <CardHeader className='flex flex-row-reverse justify-between items-center'>
          <p className='text-lg font-bold'>محبوب ترین دوره ها</p>
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto'>
          {mostViewedCourses.map((course, index) => (
            <div className="flex-0 flex flex-col gap-4 rounded" key={`${course._id}-${index}`}>
              <CourseCard course={course} />
              <div className="w-full h-px bg-gray-200"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
