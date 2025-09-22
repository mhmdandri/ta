import DateRangePicker from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, Calendar, Download, Filter, PieChart, RefreshCw, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';

// Types --------------------------------------------------
export type RevenueRow = {
    id: number | string;
    date: string; // ISO date
    no_ref: string; // e.g. no_penawaran / invoice
    customer: string;
    sales: string;
    total_net: number; // subtotal (bisa harian jika multi-day)
    total_net_net: number; // grand total (bisa harian jika multi-day)
    rental_duration?: number; // durasi rental dari DB
    ppn_value?: number; // nilai PPN (bisa harian jika multi-day)
    is_daily_split?: boolean; // apakah ini hasil pembagian harian
    original_total_net?: number; // total asli sebelum dibagi
    original_total_net_net?: number; // total asli sebelum dibagi
    rental_period?: string;
};

export type RevenueSummary = {
    count: number;
    total_net: number;
    total_net_net: number;
    avg_per_tx: number;
    total_pricelist: number;
};

export type RevenueProps = {
    rows: RevenueRow[];
    summary: RevenueSummary;
    filter?: {
        start?: string; // YYYY-MM-DD
        end?: string; // YYYY-MM-DD
        ppn?: 'ppn' | 'non' | 'all';
    };
};

// Helpers ------------------------------------------------
function formatIDR(n: number | null | undefined) {
    if (n == null) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatDateID(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return iso;
    }
}

function formatShortDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
    } catch {
        return iso;
    }
}

// Filter UI ----------------------------------------------
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/report',
    },
    {
        title: 'Pendapatan COR',
        href: '/report/revenue',
    },
];

export default function RevenueReport() {
    const { rows = [], summary, filter } = usePage<RevenueProps>().props;

    // Helper function untuk format tanggal
    const formatDate = useCallback((date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    // Date range states - Default ke bulan ini
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [start, setStart] = useState<string>(filter?.start ?? formatDate(startOfMonth));
    const [end, setEnd] = useState<string>(filter?.end ?? formatDate(endOfMonth));
    const [selectedPPN, setSelectedPPN] = useState<'ppn' | 'non' | 'all'>(filter?.ppn ?? 'all');

    // Date range picker state
    const [range, setRange] = useState<DateRange | undefined>(() => {
        if (filter?.start && filter?.end) {
            return {
                from: new Date(filter.start),
                to: new Date(filter.end),
            };
        }
        return undefined;
    });

    // State for active tab
    const [activeView, setActiveView] = useState<'table' | 'chart'>('table');

    // Sync state dengan server filter
    useEffect(() => {
        if (filter) {
            if (filter.start) setStart(filter.start);
            if (filter.end) setEnd(filter.end);
            setSelectedPPN(filter.ppn ?? 'all');

            // Update range picker - pastikan parsing tanggal yang benar
            if (filter.start && filter.end) {
                // Parse tanggal dengan timezone lokal, bukan UTC
                const startDate = new Date(filter.start + 'T00:00:00');
                const endDate = new Date(filter.end + 'T00:00:00');

                setRange({
                    from: startDate,
                    to: endDate,
                });
            }
        }
    }, [filter?.start, filter?.end]);

    // Update start/end ketika range picker berubah
    useEffect(() => {
        if (range?.from && range?.to) {
            setStart(formatDate(range.from));
            setEnd(formatDate(range.to));
        }
    }, [range, formatDate]);
    useEffect(() => {
        applyFilter();
    }, [selectedPPN]);

    const periodLabel = useMemo(() => {
        return `${formatDateID(start)} — ${formatDateID(end)}`;
    }, [start, end]);

    // Calculate daily revenue for chart
    const dailyRevenue = useMemo(() => {
        const dailyMap: Record<string, number> = {};

        rows.forEach((row) => {
            const dateKey = row.date.split('T')[0];
            if (!dailyMap[dateKey]) {
                dailyMap[dateKey] = 0;
            }
            dailyMap[dateKey] += row.total_net_net;
        });

        // Convert to array and sort by date
        return Object.entries(dailyMap)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [rows]);

    function applyFilter() {
        console.log('Applying filter with PPN:', selectedPPN);
        const qs: Record<string, string> = {
            start: start,
            end: end,
        };
        if (selectedPPN) qs.ppn = selectedPPN;
        router.get('/report/revenue', qs, { preserveState: true, preserveScroll: true });
    }

    function resetFilter() {
        // Reset ke bulan ini
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const startMonth = formatDate(startOfMonth);
        const endMonth = formatDate(endOfMonth);

        setStart(startMonth);
        setEnd(endMonth);
        setSelectedPPN('all');
        setRange({
            from: startOfMonth,
            to: endOfMonth,
        });

        router.get('/report/revenue', { start: startMonth, end: endMonth }, { preserveState: true, preserveScroll: true });
    }

    function exportCSV() {
        const params = new URLSearchParams({
            start: start,
            end: end,
        });

        window.open(`/report/revenue/export?${params.toString()}`, '_blank');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pendapatan" />
            <div className="p-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Laporan Pendapatan COR</h1>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" /> Periode: {periodLabel}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex rounded-md bg-primary-foreground p-1">
                            <button
                                onClick={() => setActiveView('table')}
                                className={`flex items-center rounded px-3 py-2 text-sm font-medium transition-colors ${activeView === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                            >
                                <BarChart3 className="mr-2 h-4 w-4" /> Tabel
                            </button>
                            <button
                                onClick={() => setActiveView('chart')}
                                className={`flex items-center rounded px-3 py-2 text-sm font-medium transition-colors ${activeView === 'chart' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                            >
                                <TrendingUp className="mr-2 h-4 w-4" /> Grafik
                            </button>
                        </div>
                        <Button variant="outline" onClick={resetFilter} className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Reset
                        </Button>
                        <Button onClick={exportCSV} className="gap-2">
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6 bg-primary-foreground">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
                            <Filter className="h-5 w-5 text-primary" /> Filter Laporan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                            <div className="md:col-span-4">
                                <Label>Periode Tanggal</Label>
                                <DateRangePicker
                                    value={range}
                                    onChange={(newRange) => {
                                        setRange(newRange);
                                    }}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <Label>PPN</Label>
                                <Select value={selectedPPN} onValueChange={(v: 'ppn' | 'non' | 'all') => setSelectedPPN(v)}>
                                    <SelectTrigger className="w-[280px]">
                                        <SelectValue placeholder="Pilih filter ppn..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="ppn">PPN</SelectItem>
                                        <SelectItem value="non">Non PPN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end justify-end md:col-span-2">
                                <Button onClick={applyFilter}>Terapkan Filter</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden bg-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium text-slate-600">
                                <BarChart3 className="mr-2 h-4 w-4 text-blue-500" /> Total Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{summary?.count ?? 0}</div>
                            <p className="mt-1 text-xs text-slate-500">Jumlah transaksi periode ini</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden bg-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium text-slate-600">
                                <PieChart className="mr-2 h-4 w-4 text-purple-500" /> Total Pricelist
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{formatIDR(summary?.total_pricelist ?? 0)}</div>
                            <p className="mt-1 text-xs text-slate-500">Nilai berdasarkan pricelist</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden bg-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium text-slate-600">
                                <TrendingUp className="mr-2 h-4 w-4 text-amber-500" /> Total Net Price
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{formatIDR(summary?.total_net ?? 0)}</div>
                            <p className="mt-1 text-xs text-slate-500">Nilai setelah diskon</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden bg-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium text-slate-600">
                                <TrendingUp className="mr-2 h-4 w-4 text-green-500" /> Total NetNet
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatIDR(summary?.total_net_net ?? 0)}</div>
                            <p className="mt-1 text-xs text-slate-500">Pendapatan bersih</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart View */}
                {activeView === 'chart' && dailyRevenue.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-base">
                                <TrendingUp className="mr-2 h-5 w-5 text-blue-500" /> Grafik Pendapatan Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full overflow-x-auto">
                                <div className="flex h-64 min-w-full items-end justify-between gap-2 pt-4">
                                    {dailyRevenue.map((day, index) => {
                                        const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue));
                                        const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 200 : 0;

                                        return (
                                            <div key={index} className="flex flex-col items-center">
                                                <div
                                                    className="w-8 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:from-blue-700 hover:to-blue-500"
                                                    style={{ height: `${height}px` }}
                                                    title={`${formatShortDate(day.date)}: ${formatIDR(day.revenue)}`}
                                                ></div>
                                                <div className="mt-2 text-xs text-slate-500">{formatShortDate(day.date)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center text-sm text-slate-600">
                                Rata-rata harian: {formatIDR(dailyRevenue.reduce((sum, day) => sum + day.revenue, 0) / dailyRevenue.length)}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table View */}
                {activeView === 'table' && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-base">
                                <BarChart3 className="mr-2 h-5 w-5 text-blue-500" /> Detail Transaksi Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-100 hover:bg-slate-100">
                                            <TableHead className="w-[130px] font-semibold text-slate-700">Tanggal</TableHead>
                                            <TableHead className="font-semibold text-slate-700">No. Ref</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Sales</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Durasi</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700">NetPrice/Hari</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700">NetNet/Hari</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700">Total NetNet</TableHead>
                                            {selectedPPN === 'ppn' && <TableHead className="text-right font-semibold text-slate-700">PPN</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-12 text-center">
                                                    <div className="flex flex-col items-center text-slate-400">
                                                        <Filter className="mb-4 h-12 w-12" />
                                                        <p className="text-lg font-medium">Tidak ada data transaksi</p>
                                                        <p className="text-sm">Coba ubah periode filter untuk melihat data</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {rows.map((r) => (
                                            <TableRow
                                                key={r.id}
                                                onClick={() => {
                                                    window.open(`/transactions/${r.id}`, '_blank');
                                                }}
                                                className={`transition-colors hover:cursor-pointer hover:bg-slate-50 ${r.is_daily_split ? 'border-l-4' : ''}`}
                                            >
                                                <TableCell className="font-medium">
                                                    {formatDateID(r.date)}
                                                    {r.is_daily_split && <div className="mt-1 text-xs text-blue-600">harian</div>}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">{r.no_ref}</TableCell>
                                                <TableCell>{r.customer}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                                                        {r.sales}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                r.is_daily_split ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                                                            }`}
                                                        >
                                                            {r.rental_duration} hari
                                                        </span>
                                                        {r.rental_period && <div className="mt-1 text-xs text-slate-500">{r.rental_period}</div>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{formatIDR(r.total_net)}</TableCell>
                                                <TableCell className="text-right font-medium text-green-600">{formatIDR(r.total_net_net)}</TableCell>
                                                <TableCell className="text-right font-semibold text-slate-800">
                                                    {r.is_daily_split ? (
                                                        <div>
                                                            {formatIDR(r.original_total_net_net)}
                                                            <div className="mt-1 text-xs text-slate-500">total {r.rental_duration} hari</div>
                                                        </div>
                                                    ) : (
                                                        formatIDR(r.total_net_net)
                                                    )}
                                                </TableCell>
                                                {selectedPPN === 'ppn' && (
                                                    <TableCell className="text-right font-medium text-slate-700">{formatIDR(r.ppn_value)}</TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {rows.length > 0 && (
                                <div className="mt-4 flex justify-between text-sm text-slate-600">
                                    <div>Menampilkan {rows.length} transaksi</div>
                                    <div>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
