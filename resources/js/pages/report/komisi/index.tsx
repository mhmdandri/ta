import DateRangePicker from '@/components/DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, ChevronDown, ChevronUp, DollarSign, Download, Filter, Info, Percent, Target, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/report/commisions',
    },
    {
        title: 'Komisi Sales',
        href: '/report/commisions',
    },
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
};

type PageProps = {
    sales: Sales[];
};

const Index = () => {
    const { sales } = usePage<PageProps>().props;
    const [expandedSales, setExpandedSales] = useState<number[]>([]);
    const [selectedSales, setSelectedSales] = useState<string>('all');

    const toggleExpand = (id: number) => {
        if (expandedSales.includes(id)) {
            setExpandedSales(expandedSales.filter((item) => item !== id));
        } else {
            setExpandedSales([...expandedSales, id]);
        }
    };

    const filteredSales = selectedSales === 'all' ? sales : sales.filter((s) => s.id.toString() === selectedSales);

    const exportToCSV = () => {
        // CSV export implementation would go here
        console.log('Exporting data to CSV');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Laporan Komisi" />
                <div className="space-y-6 p-4 md:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Komisi Sales</h1>
                            <p className="mt-1 text-gray-500">Pantau performa dan komisi sales team</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            <Download size={18} />
                            <span>Export Laporan</span>
                        </button>
                    </div>

                    {/* Filter Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 py-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="h-5 w-5 text-blue-600" />
                                Filter Laporan Komisi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <Label className="mb-2 flex items-center gap-1">
                                    <span>Rentang Tanggal</span>
                                    <Info size={14} className="text-gray-400" />
                                </Label>
                                <DateRangePicker />
                            </div>
                            <div>
                                <Label className="mb-2">Sales</Label>
                                <Select value={selectedSales} onValueChange={setSelectedSales}>
                                    <SelectTrigger className="w-full">
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
                                <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                    Terapkan Filter
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Total Pencapaian</p>
                                        <h3 className="mt-1 text-2xl font-bold text-blue-900">
                                            {formatRupiah(
                                                sales.reduce((sum, s) => sum + s.sum_total_net_net, 0),
                                                false,
                                            )}
                                        </h3>
                                    </div>
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <DollarSign className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Rata-rata Pencapaian Target</p>
                                        <h3 className="mt-1 text-2xl font-bold text-green-900">
                                            {formatPercent(sales.reduce((sum, s) => sum + s.persenTarget, 0) / sales.length)}
                                        </h3>
                                    </div>
                                    <div className="rounded-full bg-green-100 p-2">
                                        <Percent className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Total Target</p>
                                        <h3 className="mt-1 text-2xl font-bold text-purple-900">
                                            {formatRupiah(
                                                sales.reduce((sum, s) => sum + s.target_sales, 0),
                                                false,
                                            )}
                                        </h3>
                                    </div>
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <Target className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-amber-700">Jumlah Sales</p>
                                        <h3 className="mt-1 text-2xl font-bold text-amber-900">{sales.length}</h3>
                                    </div>
                                    <div className="rounded-full bg-amber-100 p-2">
                                        <User className="h-5 w-5 text-amber-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sales List */}
                    <Card>
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gray-700" />
                                <span>Detail Performa Sales</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {filteredSales.map((s) => (
                                    <div key={s.id} className="p-4 transition-colors hover:bg-gray-50">
                                        <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleExpand(s.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-blue-100 p-2">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{s.name}</h3>
                                                    <p className="text-sm text-gray-500">ID: {s.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Pencapaian Target</p>
                                                    <p className={`font-medium ${s.persenTarget >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {formatPercent(s.persenTarget)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-gray-400">
                                                    {expandedSales.includes(s.id) ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {expandedSales.includes(s.id) && (
                                            <div className="mt-4 grid grid-cols-1 gap-4 pl-11 md:grid-cols-2 lg:grid-cols-3">
                                                <div className="rounded-lg bg-blue-50 p-3">
                                                    <p className="text-xs font-medium text-blue-700">Target Pencapaian</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.target_sales, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-green-50 p-3">
                                                    <p className="text-xs font-medium text-green-700">Pencapaian</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-purple-50 p-3">
                                                    <p className="text-xs font-medium text-purple-700">Pricelist</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_pricelist, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-amber-50 p-3">
                                                    <p className="text-xs font-medium text-amber-700">Net Price</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-rose-50 p-3">
                                                    <p className="text-xs font-medium text-rose-700">NetNet Include OS</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-indigo-50 p-3">
                                                    <p className="text-xs font-medium text-indigo-700">NetNet Tanpa OS</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.netNetWithoutOS, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-gray-50 p-3">
                                                    <p className="text-xs font-medium text-gray-700">Nilai Barang OS</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net_os, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-cyan-50 p-3">
                                                    <p className="text-xs font-medium text-cyan-700">Nilai Barang Cabang</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.sum_total_net_net_cabang, false)}</p>
                                                </div>
                                                <div className="rounded-lg bg-lime-50 p-3">
                                                    <p className="text-xs font-medium text-lime-700">Average Disc</p>
                                                    <p className="text-sm font-semibold">{formatPercent(s.avgDisc)}</p>
                                                </div>
                                                <div className="rounded-lg bg-orange-50 p-3">
                                                    <p className="text-xs font-medium text-orange-700">Total PPN</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.ppn_value)}</p>
                                                </div>
                                                <div className="rounded-lg bg-pink-50 p-3">
                                                    <p className="text-xs font-medium text-pink-700">Jasa Operate</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.operate_fee)}</p>
                                                </div>
                                                <div className="rounded-lg bg-teal-50 p-3">
                                                    <p className="text-xs font-medium text-teal-700">Jasa Sticker</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.jasa_sticker)}</p>
                                                </div>
                                                <div className="rounded-lg bg-fuchsia-50 p-3">
                                                    <p className="text-xs font-medium text-fuchsia-700">Jasa Kirim</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.jasa_kirim)}</p>
                                                </div>
                                                <div className="rounded-lg bg-amber-50 p-3">
                                                    <p className="text-xs font-medium text-amber-700">Extra Discount</p>
                                                    <p className="text-sm font-semibold">{formatRupiah(s.extra_discount)}</p>
                                                </div>
                                            </div>
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
