import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { LinkType, Paginator, Transaction } from '@/types/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, FileText, Filter, Package, PlusCircle, User } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transactions', href: 'transactions' }];

function StatusPill({ type }: { type: Transaction['transaction_type'] }) {
    const isRental = type === 'rental';
    const cls = isRental
        ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
        : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700';
    return (
        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
            {isRental ? (
                <>
                    <Calendar className="h-3 w-3" />
                    Sewa
                </>
            ) : (
                <>
                    <Package className="h-3 w-3" />
                    Jual
                </>
            )}
        </span>
    );
}

function StatusBadge({ status }: { status?: string }) {
    let cls = '';
    let label = status ?? '-';

    switch (status) {
        case 'submitted':
            cls = 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            label = 'Submitted';
            break;
        case 'confirmed':
            cls = 'bg-blue-100 text-blue-800 border border-blue-300';
            label = 'Confirmed';
            break;
        case 'completed':
            cls = 'bg-green-100 text-green-800 border border-green-300';
            label = 'Completed';
            break;
        default:
            cls = 'bg-gray-100 text-gray-800 border border-gray-300';
    }

    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

export default function TransaksiIndex() {
    const { transactions, filter: serverFilter } = usePage<{
        transactions: Paginator<Transaction>;
        filter?: { month: string };
    }>().props;

    // Helper function untuk mendapatkan bulan current dalam format YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [filter, setFilter] = useState({
        month: serverFilter?.month || getCurrentMonth(),
    });

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

    const timer = useRef<number | undefined>(undefined);
    const applyFilter = (next: typeof filter) => {
        router.get(
            window.location.pathname,
            {
                month: next.month,
            },
            { preserveState: true, preserveScroll: true, replace: true, only: ['transactions', 'filter'] },
        );
    };

    const handleFilterChange = (key: keyof typeof filter, value: string) => {
        const next = { ...filter, [key]: value };
        setFilter(next);
        applyFilter(next);
    };

    // rows selalu array
    const rows = transactions?.data ?? [];

    // links bisa berada di root.links atau meta.links
    const pageLinks: LinkType[] = useMemo(() => (transactions?.links ?? transactions?.meta?.links ?? []) as LinkType[], [transactions]);

    const currency = useMemo(() => new Intl.NumberFormat('id-ID'), []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex min-h-screen flex-col space-y-4 p-4 dark:bg-neutral-900">
                {/* Header Section */}
                <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Transaksi</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Kelola semua transaksi penjualan dan penyewaan -{' '}
                            {monthOptions.find((m) => m.value === filter.month)?.label || 'Bulan ini'}
                        </p>
                    </div>
                    <Button asChild className="gap-2 shadow-md">
                        <Link href="/transactions/create">
                            <PlusCircle className="h-4 w-4" />
                            Transaksi Baru
                        </Link>
                    </Button>
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-800">
                    <div className="border-b border-gray-200 p-4 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Daftar Transaksi</h2>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan {transactions.from || 0} - {transactions.to || 0} dari {transactions.total || 0} transaksi
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-700/30">
                                <tr>
                                    {['No. Penawaran', 'Customer', 'Sales', 'Type', 'Status', 'Grand Total', 'Durasi', 'Aksi'].map((head) => (
                                        <th
                                            key={head}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-800">
                                {rows.map((t) => (
                                    <tr key={t.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 dark:text-white">{t.no_penawaran}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-700 dark:text-gray-300">{t.customer?.name ?? '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{t.sales?.name ?? '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusPill type={t.transaction_type} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={t.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {currency.format(Number(t.total_final ?? 0))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-700 dark:text-gray-300">
                                                {t.rental_duration ?? 0} <span className="text-gray-500">hari</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" asChild className="gap-1">
                                                    <Link href={`/transactions/${t.id}`}>
                                                        <FileText className="h-3 w-3" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {rows.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-neutral-700">
                                    <CreditCard className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Tidak ada transaksi</h3>
                                <p className="max-w-md text-gray-500 dark:text-gray-400">
                                    Belum ada transaksi yang tercatat. Mulai dengan membuat transaksi baru.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {rows.length >= 10 && (
                        <div className="border-t border-gray-200 px-6 py-4 dark:border-neutral-700">
                            <Pagination links={pageLinks} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
