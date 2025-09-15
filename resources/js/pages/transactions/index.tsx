import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { LinkType, Paginator, Transaction } from '@/types/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, FileText, Package, PlusCircle, User } from 'lucide-react';
import { useMemo } from 'react';

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

export default function TransaksiIndex() {
    const { transactions } = usePage<{ transactions: Paginator<Transaction> }>().props;

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
                        <p className="text-gray-500 dark:text-gray-400">Kelola semua transaksi penjualan dan penyewaan</p>
                    </div>
                    <Button asChild className="gap-2 shadow-md">
                        <Link href="/transactions/create">
                            <PlusCircle className="h-4 w-4" />
                            Transaksi Baru
                        </Link>
                    </Button>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-800">
                    <div className="border-b border-gray-200 p-4 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Daftar Transaksi</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-700/30">
                                <tr>
                                    {['No. Penawaran', 'Customer', 'Sales', 'Type', 'Grand Total', 'Durasi', 'Aksi'].map((head) => (
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
