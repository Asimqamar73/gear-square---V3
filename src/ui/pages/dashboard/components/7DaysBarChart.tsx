import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../../../components/ui/chart"

interface DayData {
  date: string;
  services: number;
  revenue: number;
}

const chartConfig = {
  services: {
    label: "Services",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Last7DaysChart() {
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [previousWeekTotal, setPreviousWeekTotal] = useState(0);
  const [currentWeekTotal, setCurrentWeekTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLast7DaysData();
  }, []);

  const fetchLast7DaysData = async () => {
    try {
      // Fetch last 7 days data
      //@ts-ignore
      const currentWeekData = await window.electron.getLast7DaysServices();
      
      // Fetch previous 7 days data (days 8-14 ago)
      //@ts-ignore
      const previousWeekData = await window.electron.getPrevious7DaysServices();

      setChartData(currentWeekData);
      
      const currentTotal = currentWeekData.reduce((sum: number, day: DayData) => sum + day.services, 0);
      const previousTotal = previousWeekData.reduce((sum: number, day: DayData) => sum + day.services, 0);
      
      setCurrentWeekTotal(currentTotal);
      setPreviousWeekTotal(previousTotal);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = () => {
    if (previousWeekTotal === 0) return 0;
    return (((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1);
  };
//@ts-ignore
  const change = parseFloat(calculateChange());
  const isPositive = change >= 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Services</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 7 Days Services</CardTitle>
        <CardDescription>
          {chartData.length > 0 && `${chartData[0].date} - ${chartData[chartData.length - 1].date}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { weekday: 'short' });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  });
                }}
              />}
            />
            <Bar dataKey="services" fill="var(--color-services)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isPositive ? (
            <>
              Trending up by {Math.abs(change)}% from previous week
              <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(change)}% from previous week
              <TrendingDown className="h-4 w-4 text-red-600" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Total services: {currentWeekTotal} (Previous week: {previousWeekTotal})
        </div>
      </CardFooter>
    </Card>
  )
}