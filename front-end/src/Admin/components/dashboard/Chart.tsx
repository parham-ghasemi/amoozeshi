import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";
import moment from "moment-timezone";

type VisitDataPoint = {
  _id: string;
  count: number;
};

type ChartProps = {
  data: VisitDataPoint[];
  range: string;
  setRange: (value: string) => void;
};

const chartConfig = {
  count: {
    label: "بازدیدها",
    color: "var(--chart-1)",
  },
};

const tz = "Asia/Tehran";

export function Chart({ data, range, setRange }: ChartProps) {
  const formatDate = (val: string) => {
    if (range === "year" || range === "all") return val; // already month/year label

    const m = moment.tz(val, ["YYYY-MM-DD", "MMM YY"], tz);
    switch (range) {
      case "today":
        return m.format("HH:mm");
      case "week":
        return m.format("ddd");
      case "month":
        return m.format("D MMM");
      default:
        return m.format("YYYY/MM/DD");
    }
  };

  const rangeLabelMap: Record<string, string> = {
    today: "امروز",
    week: "این هفته",
    month: "این ماه",
    year: "امسال",
    all: "همه زمان‌ها",
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Select value={range} onValueChange={setRange} dir="rtl">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="انتخاب بازه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">امروز</SelectItem>
            <SelectItem value="week">این هفته</SelectItem>
            <SelectItem value="month">این ماه</SelectItem>
            <SelectItem value="year">امسال</SelectItem>
            <SelectItem value="all">همه زمان‌ها</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-end">
            آمار بازدید - {rangeLabelMap[range]}
          </CardTitle>
          <CardDescription>تعداد بازدیدکنندگان در بازه انتخابی</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 12, bottom: 40 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="_id"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
              angle={-30}
              textAnchor="end"
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
