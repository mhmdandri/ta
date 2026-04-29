import ChartBarMultiple from '@/components/BarChart';
import TopChart from '@/components/top-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/formatRupiah';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Summary } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { TrendingUp, Users } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type TopProduct = {
    id: number;
    name: string;
    total_qty: number;
};

type Props = {
    summary: Summary;
    globalSummary: Summary;
    weeklyChart: any;
    weeklyMeta: any;
    role: string;
    topProducts: TopProduct[];
};

export default function Dashboard({ summary, weeklyChart, weeklyMeta, role, topProducts }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isSales = auth.user?.role === 'sales';
    const isAdminUp = auth.user?.role === 'admin' || auth.user?.role === 'spv' || auth.user?.role === 'manager' || auth.user?.role === 'gm';
    useEffect(() => {
        console.log('Summary:', summary);
        console.log('Weekly Chart:', weeklyChart);
        console.log('Weekly Meta:', weeklyMeta);
        console.log('Top Products:', topProducts);
    }, [summary, weeklyChart, weeklyMeta, topProducts]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* <div className="w-full"> */}
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
                {isSales && (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total_transactions}</div>
                                <p className="text-xs text-muted-foreground">Jumlah Transaksi saya</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pricelist</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_pricelist)}</div>
                                <p className="text-xs text-muted-foreground">Pricelist saya bulan ini</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total NetPrice</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_net_price)}</div>
                                <p className="text-xs text-muted-foreground">NetPrice saya bulan ini</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total NetNet</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_net_net)}</div>
                                <p className="text-xs text-muted-foreground">NetNet saya bulan ini</p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {isAdminUp && (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total_transactions}</div>
                                <p className="text-xs text-muted-foreground">Transaksi bulan ini</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pricelist</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_pricelist)}</div>
                                <p className="text-xs text-muted-foreground">Pricelist bulan ini</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total NetPrice</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_net_price)}</div>
                                <p className="text-xs text-muted-foreground">NetPrice bulan ini</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total NetNet</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatRupiah(summary.total_net_net)}</div>
                                <p className="text-xs text-muted-foreground">NetNet bulan ini</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
            <div className="flex w-full items-center gap-4 p-4">
                <div className="w-1/2">
                    <ChartBarMultiple weeklyChart={weeklyChart} weeklyMeta={weeklyMeta} role={role} />
                </div>
                <div className="w-1/2">
                    <TopChart data={topProducts} />
                </div>
            </div>

            {/* </div> */}
        </AppLayout>
    );
}
