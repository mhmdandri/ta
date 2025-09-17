import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowDownToLine, Filter, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Types --------------------------------------------------
export type RevenueRow = {
    id: number;
    date: string; // ISO date
    no_ref: string; // e.g. no_penawaran / invoice
    customer: string;
    sales: string;
    total_net: number; // subtotal
    total_net_net: number; // grand total after discounts + tax
};

export type RevenueSummary = {
    count: number;
    total_net: number;
    total_net_net: number;
    avg_per_tx: number;
};

export type RevenueProps = {
    rows: RevenueRow[];
    summary: RevenueSummary;
    // echo back current filter from server
    filter?: {
        mode: FilterMode;
        date?: string; // YYYY-MM-DD
        start?: string; // YYYY-MM-DD
        end?: string; // YYYY-MM-DD
        week_start?: string; // YYYY-MM-DD (Monday)
        month?: string; // YYYY-MM (for <input type="month">)
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
const MODES = [
    { value: 'harian', label: 'Harian' },
    { value: 'range', label: 'Range Tanggal' },
    { value: 'mingguan', label: 'Mingguan' },
    { value: 'bulanan', label: 'Bulanan' },
] as const;

type FilterMode = (typeof MODES)[number]['value'];

export default function RevenueReport() {
    const { rows = [], summary, filter } = usePage<RevenueProps>().props;
    console.log('props:', usePage<RevenueProps>().props);
    // local filter state; hydrate from server echo
    // const [mode, setMode] = useState<FilterMode>(filter?.mode ?? 'harian');
    const [date, setDate] = useState<string>(filter?.date ?? new Date().toISOString().slice(0, 10));
    const [start, setStart] = useState<string>(filter?.start ?? new Date().toISOString().slice(0, 10));
    const [end, setEnd] = useState<string>(filter?.end ?? new Date().toISOString().slice(0, 10));
    const [weekStart, setWeekStart] = useState<string>(filter?.week_start ?? getMonday(new Date()).toISOString().slice(0, 10));
    // const [month, setMonth] = useState<string>(filter?.month ?? new Date().toISOString().slice(0, 7));
    const [mode, setMode] = useState<FilterMode>(filter?.mode ?? 'bulanan');

    // default month ke YYYY-MM saat first load
    const [month, setMonth] = useState<string>(filter?.month ?? new Date().toISOString().slice(0, 7));

    useEffect(() => {
        // keep local state synced when server filter changes (navigation)
        if (filter) {
            setMode(filter.mode ?? 'harian');
            if (filter.date) setDate(filter.date);
            if (filter.start) setStart(filter.start);
            if (filter.end) setEnd(filter.end);
            if (filter.week_start) setWeekStart(filter.week_start);
            if (filter.month) setMonth(filter.month);
        }
    }, [filter?.mode, filter?.date, filter?.start, filter?.end, filter?.week_start, filter?.month]);

    const periodLabel = useMemo(() => {
        switch (mode) {
            case 'harian':
                return formatDateID(date);
            case 'range':
                return `${formatDateID(start)} — ${formatDateID(end)}`;
            case 'mingguan':
                return `${formatDateID(weekStart)} — ${formatDateID(addDays(new Date(weekStart), 6).toISOString().slice(0, 10))}`;
            case 'bulanan': {
                const [y, m] = month.split('-');
                const d = new Date(Number(y), Number(m) - 1, 1);
                return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            }
        }
    }, [mode, date, start, end, weekStart, month]);

    function applyFilter() {
        const qs: Record<string, string> = { mode };
        // console.log('props:', usePage().props);
        if (mode === 'harian') qs.date = date;
        if (mode === 'range') {
            qs.start = start;
            qs.end = end;
        }
        if (mode === 'mingguan') qs.week_start = weekStart;
        if (mode === 'bulanan') qs.month = month;

        router.get('/report/revenue', qs, { preserveState: true, preserveScroll: true });
    }

    function resetFilter() {
        setMode('bulanan');
        const mm = new Date().toISOString().slice(0, 7);
        setMonth(mm);
        // update URL dan ambil data ulang
        router.get('/report/revenue', { mode: 'bulanan', month: mm }, { preserveState: true, preserveScroll: true });
    }

    function exportCSV() {
        const params = new URLSearchParams({ mode });
        if (mode === 'harian') params.set('date', date);
        if (mode === 'range') {
            params.set('start', start);
            params.set('end', end);
        }
        if (mode === 'mingguan') params.set('week_start', weekStart);
        if (mode === 'bulanan') params.set('month', month);
        // Assume backend route returns CSV
        window.open(`/report/revenue/export?${params.toString()}`, '_blank');
    }
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pendapatan" />
            <div className="p-4">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Laporan Pendapatan</h1>
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
                            <div className="md:col-span-2">
                                <Label className="mb-1 block">Mode</Label>
                                <Select value={mode} onValueChange={(v: FilterMode) => setMode(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MODES.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {mode === 'harian' && (
                                <div className="md:col-span-2">
                                    <Label className="mb-1 block">Tanggal</Label>
                                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                            )}

                            {mode === 'range' && (
                                <>
                                    <div className="md:col-span-2">
                                        <Label className="mb-1 block">Mulai</Label>
                                        <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="mb-1 block">Selesai</Label>
                                        <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                                    </div>
                                </>
                            )}

                            {mode === 'mingguan' && (
                                <div className="md:col-span-2">
                                    <Label className="mb-1 block">Mulai Minggu (Senin)</Label>
                                    <Input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
                                </div>
                            )}

                            {mode === 'bulanan' && (
                                <div className="md:col-span-2">
                                    <Label className="mb-1 block">Bulan</Label>
                                    <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                                </div>
                            )}

                            <div className="flex items-end md:col-span-2">
                                <Button className="w-full md:w-auto" onClick={applyFilter}>
                                    Terapkan
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
                            <CardTitle className="text-sm">Total Net</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{formatIDR(summary?.total_net ?? 0)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Total Pendapatan (Net-net)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{formatIDR(summary?.total_net_net ?? 0)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1">
                            <CardTitle className="text-sm">Rata-rata / Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{formatIDR(summary?.avg_per_tx ?? 0)}</CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
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
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                Tidak ada data.
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
                                            <TableCell className="text-right">{formatIDR(r.total_net_net)}</TableCell>
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

// date utils --------------------------------------------
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
