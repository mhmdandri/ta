import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/formatRupiah';
import { type BreadcrumbItem } from '@/types';
import { type Paginator, type Summary, type Transaction } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import { DollarSign, Download, Eye, Filter, TrendingUp } from 'lucide-react';
import { useRef, useState } from 'react';
// Import shadcn/ui components
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    transactions: Paginator<Transaction> & {
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    summary: Summary;
    filter: {
        customer: string;
        sales: string;
        status: string;
        search: string;
        month: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekap COR',
        href: 'report/rekap/cor',
    },
];

export default function RekapCorIndex({ transactions, summary, filter: serverFilter }: Props) {
    // Helper function untuk mendapatkan bulan current dalam format YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [filter, setFilter] = useState({
        // serverFilter = dari props backend (agar state sync ketika paginasi)
        status: serverFilter?.status || 'all',
        customer: serverFilter?.search || serverFilter?.customer || '',
        sales: serverFilter?.sales || 'all',
        month: serverFilter?.month || getCurrentMonth(),
    });

    // Filter transactions based on current filter state
    const filteredTransactions = transactions.data.filter((transaction) => {
        if (filter.status !== 'all' && transaction.status !== filter.status) return false;
        if (filter.customer && !transaction.customer?.name.toLowerCase().includes(filter.customer.toLowerCase())) return false;
        if (filter.sales !== 'all' && !transaction.sales?.name.toLowerCase().includes(filter.sales.toLowerCase())) return false;
        return true;
    });
    const timer = useRef<number | undefined>(undefined);
    const applyFilter = (next: typeof filter) => {
        // kirim ke backend; gunakan 'search' agar konsisten
        router.get(
            window.location.pathname,
            {
                search: next.customer, // backend mapping ke 'search'
                sales: next.sales,
                status: next.status,
                month: next.month,
            },
            { preserveState: true, preserveScroll: true, replace: true, only: ['transactions', 'summary', 'filter'] },
        );
    };

    // Generate list bulan untuk dropdown (12 bulan terakhir)
    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();

        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
            options.push({ value, label });
        }

        return options;
    };

    const monthOptions = generateMonthOptions();

    // Get unique values for filter options
    const uniqueStatuses = [...new Set(transactions.data.map((t) => t.status))].filter(Boolean);
    const uniqueCustomers = [...new Set(transactions.data.map((t) => t.customer?.name))].filter((name) => name && name !== 'N/A');
    const uniqueSales = [...new Set(transactions.data.map((t) => t.sales?.name))].filter((name) => name && name !== 'N/A');

    const handleFilterChange = (key: keyof typeof filter, value: string) => {
        const next = { ...filter, [key]: value };
        setFilter(next);

        // untuk teks (customer/search) debounce, untuk select apply langsung
        if (key === 'customer') {
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => applyFilter(next), 400);
        } else {
            applyFilter(next);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Laporan', href: '' },
                { title: 'Rekap COR', href: '' },
            ]}
        >
            <Head title="Rekap COR" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rekap COR</h1>
                        <p className="mt-1 text-muted-foreground">
                            Ringkasan dan daftar transaksi Change Order Request -{' '}
                            {monthOptions.find((m) => m.value === filter.month)?.label || 'Bulan ini'}
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_transactions}</div>
                            <p className="text-xs text-muted-foreground">
                                {monthOptions.find((m) => m.value === filter.month)?.label || 'Bulan ini'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pricelist</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(summary.total_pricelist)}</div>
                            <p className="text-xs text-muted-foreground">Nilai Transaksi Pricelist</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Net Price</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(summary.total_net_price)}</div>
                            <p className="text-xs text-muted-foreground">Nilai Transaksi NetPrice</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total NetNet</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(summary.total_net_net)}</div>
                            <p className="text-xs text-muted-foreground">Nilai transaksi NetNet</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Section */}
                <Card className="bg-primary-foreground">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="h-5 w-5" />
                            Filter Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="month">Bulan</Label>
                                <Select value={filter.month} onValueChange={(value) => handleFilterChange('month', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthOptions.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer">Customer</Label>
                                <Input
                                    id="customer"
                                    placeholder="Cari customer..."
                                    value={filter.customer}
                                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sales">Sales</Label>
                                <Select value={filter.sales} onValueChange={(value) => handleFilterChange('sales', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sales" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Sales</SelectItem>
                                        {uniqueSales.map((sales) => (
                                            <SelectItem key={sales} value={sales || 'unknown'}>
                                                {sales}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={filter.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        {uniqueStatuses.map((status) => (
                                            <SelectItem key={status} value={status || 'unknown'}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Table */}
                <Card>
                    <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Daftar Transaksi COR</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Menampilkan {transactions.from} dari {transactions.to} transaksi
                            </p>
                        </div>
                        <Badge variant="outline" className="text-sm">
                            Total: {formatRupiah(filteredTransactions.reduce((sum, t) => sum + t.total_final, 0))}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NO</TableHead>
                                        <TableHead>NO. COR</TableHead>
                                        <TableHead>PELANGGAN</TableHead>
                                        <TableHead>SALES</TableHead>
                                        <TableHead className="text-right">QTY</TableHead>
                                        <TableHead className="text-right">PRICELIST</TableHead>
                                        <TableHead className="text-right">NET PRICE</TableHead>
                                        <TableHead className="text-right">PPN 11%</TableHead>
                                        <TableHead className="text-right">SUB TOTAL</TableHead>
                                        <TableHead className="text-center">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((transaction, index) => (
                                            <TableRow key={transaction.id} className="group">
                                                <TableCell className="font-medium">
                                                    {(transactions.current_page - 1) * transactions.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">{transaction.no_penawaran}</TableCell>
                                                <TableCell>{transaction.customer?.name || 'N/A'}</TableCell>
                                                <TableCell>{transaction.sales?.name || 'N/A'}</TableCell>
                                                <TableCell className="text-right">{transaction.total_qty.toLocaleString()}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(transaction.total_pricelist, false)}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(transaction.total_net, false)}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(transaction.ppn_value, false)}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatRupiah(transaction.total_final, false)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="gap-2 opacity-70 transition-opacity group-hover:opacity-100"
                                                    >
                                                        <a href={`/report/rekap/cor/${transaction.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                            Detail
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-24 text-center">
                                                {transactions.data.length === 0
                                                    ? 'Tidak ada data transaksi'
                                                    : 'Tidak ada data yang sesuai dengan filter'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <Pagination links={transactions.links} />
            </div>
        </AppLayout>
    );
}
