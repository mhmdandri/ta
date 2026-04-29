import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type Data = {
    id: number;
    name: string;
    total_qty: number;
};

export default function TopProductChart({ data, title = 'Top Produk Paling Banyak Disewa' }: { data: Data[]; title?: string }) {
    const chartConfig = {
        total_qty: {
            label: 'Jumlah Sewa',
            color: 'var(--chart-2)',
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Top 10 Produk</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid horizontal={false} />

                        {/* Y = nama produk */}
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={200} // biar nama panjang muat
                        />

                        {/* X = qty */}
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('id-ID', {
                                    notation: 'compact',
                                }).format(value)
                            }
                        />

                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                        <Bar dataKey="total_qty" name={chartConfig.total_qty.label} fill="var(--color-total_qty)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
