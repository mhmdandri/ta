import DateRangePicker from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowDownToLine, Filter, RefreshCw } from 'lucide-react';
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
    console.log('props:', usePage<RevenueProps>().props);

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

    // Sync state dengan server filter
    useEffect(() => {
        if (filter) {
            if (filter.start) setStart(filter.start);
            if (filter.end) setEnd(filter.end);

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

    const periodLabel = useMemo(() => {
        return `${formatDateID(start)} — ${formatDateID(end)}`;
    }, [start, end]);

    function applyFilter() {
        const qs: Record<string, string> = {
            start: start,
            end: end,
        };

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
                <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Laporan Pendapatan COR</h1>
                        <p className="text-sm text-muted-foreground">Periode: {periodLabel}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={resetFilter}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                        <Button onClick={exportCSV}>
                            <ArrowDownToLine className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" /> Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                            <div className="md:col-span-4">
                                <DateRangePicker
                                    value={range}
                                    onChange={(newRange) => {
                                        setRange(newRange);
                                    }}
                                />
                            </div>
                            {/* <div className="w-32 md:col-span-4">
                                <Select>
                                    <SelectTrigger>PPN</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="include">Termasuk PPN</SelectItem>
                                        <SelectItem value="exclude">Tidak Termasuk PPN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                            <div className="flex items-end md:col-span-2">
                                <Button className="w-full md:w-auto" onClick={applyFilter}>
                                    Terapkan Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Total Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{summary?.count ?? 0}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Total Pricelist</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{formatIDR(summary?.total_pricelist ?? 0)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Total Net Price</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{formatIDR(summary?.total_net ?? 0)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Total NetNet</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold text-green-600">{formatIDR(summary?.total_net_net ?? 0)}</CardContent>
                    </Card>
                </div>

                {/* Table */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Detail Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[130px]">Tanggal</TableHead>
                                        <TableHead>No. Ref</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Sales</TableHead>
                                        <TableHead className="text-right">Subtotal (Net)</TableHead>
                                        <TableHead className="text-right">Total (Net-net)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center">
                                                    <Filter className="mb-2 h-8 w-8 text-gray-300" />
                                                    <p className="text-lg font-medium">Tidak ada data</p>
                                                    <p className="text-sm">Tidak ada data transaksi untuk periode ini</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {rows.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{formatDateID(r.date)}</TableCell>
                                            <TableCell className="font-medium">{r.no_ref}</TableCell>
                                            <TableCell>{r.customer}</TableCell>
                                            <TableCell>{r.sales}</TableCell>
                                            <TableCell className="text-right">{formatIDR(r.total_net)}</TableCell>
                                            <TableCell className="text-right font-medium text-blue-600">{formatIDR(r.total_net_net)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card> */}

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Detail Transaksi Harian</CardTitle>
                        <p className="text-sm text-muted-foreground">Transaksi rental multi-hari dibagi per hari berdasarkan durasi di database</p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[130px]">Tanggal</TableHead>
                                        <TableHead>No. Ref</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Sales</TableHead>
                                        <TableHead>Durasi</TableHead>
                                        <TableHead className="text-right">NetPrice/Hari</TableHead>
                                        <TableHead className="text-right">NetNet/Hari</TableHead>
                                        <TableHead className="text-right">Total NetNet</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center">
                                                    <Filter className="mb-2 h-8 w-8 text-gray-300" />
                                                    <p className="text-lg font-medium">Tidak ada data</p>
                                                    <p className="text-sm">Tidak ada data transaksi untuk periode ini</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {rows.map((r) => (
                                        <TableRow key={r.id} className={r.is_daily_split ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}>
                                            <TableCell className="font-medium">
                                                {formatDateID(r.date)}
                                                {r.is_daily_split && <div className="mt-1 text-xs text-blue-600">harian</div>}
                                            </TableCell>
                                            <TableCell>{r.no_ref}</TableCell>
                                            <TableCell>{r.customer}</TableCell>
                                            <TableCell>{r.sales}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            r.is_daily_split ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {r.rental_duration} hari
                                                    </span>
                                                    {r.rental_period && <div className="mt-1 text-xs text-gray-500">{r.rental_period}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatIDR(r.total_net)}
                                                {r.is_daily_split && <div className="mt-1 text-xs text-blue-600">1/{r.rental_duration} bagian</div>}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatIDR(r.total_net_net)}
                                                {r.is_daily_split && <div className="mt-1 text-xs text-blue-600">1/{r.rental_duration} bagian</div>}
                                            </TableCell>
                                            <TableCell className="text-right text-gray-600">
                                                {r.is_daily_split ? (
                                                    <div>
                                                        {formatIDR(r.original_total_net_net)}
                                                        <div className="mt-1 text-xs text-gray-500">total {r.rental_duration} hari</div>
                                                    </div>
                                                ) : (
                                                    formatIDR(r.total_net_net)
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// Date utils --------------------------------------------
function getMonday(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay();
    const diff = (day === 0 ? -6 : 1) - day; // convert Sunday(0) -> -6
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}

function addDays(d: Date, days: number) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
}
