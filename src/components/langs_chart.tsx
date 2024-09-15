import { LangsChartData } from '@/lib/gulb_service';
import { BarChart, YAxis, XAxis, Bar, LabelList } from 'recharts';
import { Card, CardHeader, CardTitle } from './ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import { language_colours_map } from '@/lib/github_colours';
import { ApiError } from './api_error';

export type LangsChartProps = {
  name: string | undefined | null;
  isPending: boolean;
  error: Error | null;
  data: LangsChartData | undefined;
};

export function LangsChart({ name, isPending, error, data }: LangsChartProps) {
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    ...language_colours_map,
  } satisfies ChartConfig;

  if (isPending || !name) return;

  if (error)
    return (
      <div className="flex justify-center">
        <ApiError error={error} />
      </div>
    );

  return (
    <div className="flex w-full sm:items-center sm:justify-center">
      <Card className="pb-5">
        <CardHeader>
          <CardTitle className="text-center">{`${name} - Language Breakdown`}</CardTitle>
        </CardHeader>
        <ChartContainer
          config={chartConfig}
          className="max-w-100 min-h-[150px] w-full sm:px-8 md:min-h-[400px] xl:min-h-[500px]"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 40,
              right: 40,
              top: 0,
              bottom: 0,
            }}
          >
            <YAxis
              dataKey="lang"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              includeHidden={true}
              allowDataOverflow={true}
            />
            <XAxis dataKey="percentage" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="percentage" layout="vertical" radius={5}>
              <LabelList
                dataKey="percentage"
                formatter={(value: number) => `${value.toFixed(2)}%`}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
