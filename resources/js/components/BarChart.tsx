import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

type WeeklyRow = { week: number; weekLabel: string; mine: number; global: number };

export default function ChartBarMultiple({
    weeklyChart,
    weeklyMeta,
    role,
    title = 'Grafik Pendapatan',
}: {
    weeklyChart: WeeklyRow[];
    weeklyMeta: { from: string; to: string; metric: string };
    role: string;
    title?: string;
}) {
    const monthLabel = new Date(weeklyMeta.from).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const metricLabel = weeklyMeta.metric === 'pricelist' ? 'Pricelist' : 'NetPrice';
    const chartConfig = {
        mine: { label: 'Saya', color: 'var(--chart-1)' },
        global: { label: 'Keseluruhan', color: 'var(--chart-2)' },
    } satisfies ChartConfig;

    const showMine = role === 'sales';
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{monthLabel}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={weeklyChart} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="weekLabel" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('id-ID', {
                                    notation: 'compact',
                                    maximumFractionDigits: 1,
                                }).format(value)
                            }
                        />
                        <Legend />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        {showMine && <Bar dataKey="mine" name={chartConfig.mine.label} fill="var(--color-mine)" radius={4} />}
                        <Bar dataKey="global" name={chartConfig.global.label} fill="var(--color-global)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
