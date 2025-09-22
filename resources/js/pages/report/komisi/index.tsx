import DateRangePicker from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import type { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, ChevronDown, ChevronUp, DollarSign, Filter, Percent, Target, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import KomisiSummaryTable from './components/KomisiSummaryTable';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laporan', href: '/report/commisions' },
    { title: 'Komisi Sales', href: '/report/commisions' },
];

type Sales = {
    id: number;
    name: string;
    sum_total_net_net: number;
    sum_total_pricelist: number;
    sum_total_net: number;
    target_sales: number;
    persenTarget: number;
    sum_total_net_net_os: number;
    netNetWithoutOS: number;
    operate_fee: number;
    jasa_sticker: number;
    jasa_kirim: number;
    extra_discount: number;
    sum_total_net_net_cabang: number;
    ppn_value: number;
    avgDisc: number;
    rateKomisi: number;
};

type PageProps = {
    sales: Sales[];
    filters: {
        start_date: string;
        end_date: string;
    };
};

type Range = {
    from: Date | undefined;
    to: Date | undefined;
};
const toYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const Index = () => {
    const { sales, filters } = usePage<PageProps>().props;
    const defaultRange: DateRange = useMemo(() => {
        const from = filters?.start_date ? new Date(filters.start_date) : undefined;
        const to = filters?.end_date ? new Date(filters.end_date) : undefined;
        return { from, to };
    }, [filters]);

    const [expandedSales, setExpandedSales] = useState<number[]>([]);
    const [selectedSales, setSelectedSales] = useState<string>('all');
    const [range, setRange] = useState<DateRange>(defaultRange);
    const [submitting, setSubmitting] = useState(false);

    const toggleExpand = (id: number) => setExpandedSales((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const filteredSales = selectedSales === 'all' ? sales : sales.filter((s) => s.id.toString() === selectedSales);

    const handleApplyFilter = () => {
        if (submitting) return;

        setSubmitting(true);

        // Prepare query parameters
        const params: Record<string, string> = {};

        if (range?.from) {
            params.start = toYmd(range.from);
        }
        if (range?.to) {
            params.end = toYmd(range.to);
        }

        // Navigate with new parameters
        router.get('/report/commisions', params, {
            preserveState: false,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Laporan Komisi" />
                <div className="space-y-6 p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Komisi Sales</h1>
                            <p className="mt-1 text-sm text-[#6F6D6E]">Pantau performa dan komisi sales team</p>
                        </div>
                    </div>

                    {/* Filter */}
                    <Card className="border-[#E7E7E7] shadow-sm">
                        <CardHeader className="bg-[#FAFAFA] py-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="text-brand-navy h-5 w-5" />
                                <span className="">Filter Laporan Komisi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <div className="">
                                <Label className="">
                                    <span>Rentang Tanggal</span>
                                </Label>
                                <DateRangePicker value={range} onChange={(value) => setRange(value || { from: undefined, to: undefined })} />
                            </div>
                            <div>
                                <Label className="mb-2">Sales</Label>
                                <Select value={selectedSales} onValueChange={setSelectedSales}>
                                    <SelectTrigger className="focus:ring-brand-red w-full border-[#D9D9D9]">
                                        <SelectValue placeholder="Semua Sales" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Sales</SelectItem>
                                        {sales.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleApplyFilter} disabled={submitting} className="w-full rounded-md bg-primary">
                                    {submitting ? 'Memuat...' : 'Terapkan Filter'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Pencapaian */}
                        <Card className="bg-primary-foreground">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Total Pencapaian</p>
                                        <h3 className="mt-1 text-2xl font-bold">
                                            {formatRupiah(
                                                sales.reduce((sum, s) => sum + s.sum_total_net_net, 0),
                                                false,
                                            )}
                                        </h3>
                                    </div>
                                    <div className="rounded-full">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rata2 Target */}
                        <Card className="bg-primary-foreground">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-brand-navy text-sm font-medium">Rata-rata Pencapaian Target</p>
                                        <h3 className="text-brand-navy mt-1 text-2xl font-bold">
                                            {formatPercent(sales.reduce((sum, s) => sum + s.persenTarget, 0) / Math.max(1, sales.length))}
                                        </h3>
                                    </div>
                                    <div className="rounded-full">
                                        <Percent className="text-brand-navy h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Target */}
                        <Card className="bg-primary-foreground">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Total Target</p>
                                        <h3 className="mt-1 text-2xl font-bold">
                                            {formatRupiah(
                                                sales.reduce((sum, s) => sum + s.target_sales, 0),
                                                false,
                                            )}
                                        </h3>
                                    </div>
                                    <div className="rounded-full">
                                        <Target className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jumlah Sales */}
                        <Card className="bg-primary-foreground">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Jumlah Sales</p>
                                        <h3 className="mt-1 text-2xl font-bold">{sales.length}</h3>
                                    </div>
                                    <div className="rounded-full">
                                        <User className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* List Sales */}
                    <Card>
                        <CardHeader className="border-b bg-[#FAFAFA]">
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="text-brand-navy h-5 w-5" />
                                <span>Detail Performa Sales</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[#EFEFEF]">
                                {filteredSales.map((s) => (
                                    <div key={s.id} className="p-4 transition-colors hover:bg-[#FDFDFD]">
                                        <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleExpand(s.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-navy/10 rounded-full p-2">
                                                    <User className="text-brand-navy h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{s.name}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-[#7D7B7C]">Pencapaian Target</p>
                                                    <p className={`font-medium ${s.persenTarget >= 100 ? 'text-brand-navy' : 'text-brand-red'}`}>
                                                        {formatPercent(s.persenTarget)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-[#9AA0A6]">
                                                    {expandedSales.includes(s.id) ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {expandedSales.includes(s.id) && (
                                            <>
                                                {/* KPI Tiles — tone pakai palette brand */}
                                                <div className="mt-4 grid grid-cols-1 gap-4 pl-11 md:grid-cols-2 lg:grid-cols-7">
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-brand-navy text-xs font-medium">Target Pencapaian</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.target_sales, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Pencapaian</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Pricelist</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_pricelist, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Net Price</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">NetNet Include OS</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-brand-navy text-xs font-medium">NetNet Tanpa OS</p>
                                                        <p className="text-brand-navy text-sm font-semibold">
                                                            {formatRupiah(s.netNetWithoutOS, false)}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Nilai Barang OS</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net_os, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Nilai Barang Cabang</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net_cabang, false)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Average Disc</p>
                                                        <p className="text-sm font-semibold">{formatPercent(s.avgDisc)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-brand-navy text-xs font-medium">Total PPN</p>
                                                        <p className="text-brand-navy text-sm font-semibold">{formatRupiah(s.ppn_value)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Jasa Operate</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.operate_fee)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-brand-navy text-xs font-medium">Jasa Sticker</p>
                                                        <p className="text-brand-navy text-sm font-semibold">{formatRupiah(s.jasa_sticker)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-brand-navy text-xs font-medium">Jasa Kirim</p>
                                                        <p className="text-brand-navy text-sm font-semibold">{formatRupiah(s.jasa_kirim)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-primary-foreground p-3">
                                                        <p className="text-xs font-medium">Extra Discount</p>
                                                        <p className="text-sm font-semibold">{formatRupiah(s.extra_discount)}</p>
                                                    </div>
                                                </div>

                                                <KomisiSummaryTable s={s} formatRupiah={formatRupiah} formatPercent={formatPercent} />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </div>
    );
};

export default Index;
