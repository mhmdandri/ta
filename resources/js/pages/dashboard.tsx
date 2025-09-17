import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/formatRupiah';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Summary } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Props = {
    summary: Summary;
};

export default function Dashboard({ summary }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isSales = auth.user?.role === 'sales';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="m-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            </div>
        </AppLayout>
    );
}
