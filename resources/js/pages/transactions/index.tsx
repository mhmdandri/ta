// import Pagination from '@/components/Pagination';
// import { Button } from '@/components/ui/button';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import type { Transaction } from '@/types/types';
// import { Head, Link, usePage } from '@inertiajs/react';
// import { useMemo } from 'react';

// const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi', href: 'transactions' }];

// type LinkType = { url: string | null; label: string; active: boolean };

// type Paginator<T> = {
//     data: T[];
//     links?: LinkType[];
//     meta?: { links?: LinkType[] };
// };

// function StatusPill({ type }: { type: Transaction['transaction_type'] }) {
//     const isRental = type === 'rental';
//     const cls = isRental
//         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//         : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//     return <span className={`rounded-full px-2 py-1 text-xs ${cls}`}>{isRental ? 'Sewa' : 'Jual'}</span>;
// }

// export default function TransaksiIndex() {
//     const { transactions } = usePage<{ transactions: Paginator<Transaction> }>().props;

//     // rows selalu array
//     const rows = transactions?.data ?? [];

//     // links bisa berada di root.links atau meta.links
//     const pageLinks: LinkType[] = useMemo(() => (transactions?.links ?? transactions?.meta?.links ?? []) as LinkType[], [transactions]);

//     const currency = useMemo(() => new Intl.NumberFormat('id-ID'), []);

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Transaksi" />
//             <div className="m-2 flex min-h-screen flex-1 flex-col gap-4 overflow-x-auto rounded-xl border-2 p-4">
//                 <div>
//                     <Button asChild>
//                         {/* jika pakai Ziggy: <Link href={route('transactions.create')}> */}
//                         <Link href="/transactions/create">Transaksi Baru</Link>
//                     </Button>
//                 </div>

//                 <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700">
//                     <table className="min-w-full divide-y-2 divide-gray-200 text-sm dark:divide-neutral-700">
//                         <thead className="bg-gray-50 dark:bg-neutral-800">
//                             <tr>
//                                 {['No. Penawaran', 'Customer', 'Sales', 'Type', 'Total Final', 'Day', 'Action'].map((head) => (
//                                     <th
//                                         key={head}
//                                         scope="col"
//                                         className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                     >
//                                         {head}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
//                             {rows?.map((t) => (
//                                 <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
//                                     <td className="px-5 py-4 whitespace-nowrap">{t.no_penawaran}</td>
//                                     <td className="px-5 py-4 whitespace-nowrap">{t.customer?.name ?? '-'}</td>
//                                     <td className="px-5 py-4 whitespace-nowrap">{t.sales?.name ?? '-'}</td>
//                                     <td className="px-5 py-4 whitespace-nowrap">
//                                         <StatusPill type={t.transaction_type} />
//                                     </td>
//                                     <td className="px-5 py-4 whitespace-nowrap">Rp {currency.format(Number(t.total_final ?? 0))}</td>
//                                     <td className="px-5 py-4 whitespace-nowrap">
//                                         {t.rental_duration ?? 0} <span>hari</span>
//                                     </td>
//                                     <td className="px-5 py-4 whitespace-nowrap">
//                                         <div className="flex space-x-2">
//                                             <Button size="sm" variant="outline" asChild>
//                                                 <Link href={`/transactions/${t.id}`}>Detail</Link>
//                                             </Button>
//                                             <Button size="sm" variant="outline" asChild>
//                                                 <Link href={`/transactions/${t.id}/edit`}>Edit</Link>
//                                             </Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {rows.length === 0 && <div className="py-8 text-center text-gray-500 dark:text-gray-400">Belum ada transaksi</div>}
//                 </div>

//                 {/* Pagination: pakai links yang sudah dinormalisasi */}
//                 {rows.length >= 10 && <Pagination links={pageLinks} />}
//             </div>
//         </AppLayout>
//     );
// }

import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Transaction } from '@/types/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, Edit, FileText, Package, PlusCircle, TrendingUp, User } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi', href: 'transactions' }];

type LinkType = { url: string | null; label: string; active: boolean };

type Paginator<T> = {
    data: T[];
    links?: LinkType[];
    meta?: { links?: LinkType[] };
};

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
            <div className="flex min-h-screen flex-col space-y-6 bg-gray-50 p-6 dark:bg-neutral-900">
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transaksi</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">{rows.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/30">
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Nilai</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Rp {currency.format(rows.reduce((sum, t) => sum + Number(t.total_final ?? 0), 0))}
                                </p>
                            </div>
                        </div>
                    </div>
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
                                    {['No. Penawaran', 'Customer', 'Sales', 'Type', 'Total Final', 'Durasi', 'Aksi'].map((head) => (
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" asChild className="gap-1">
                                                    <Link href={`/transactions/${t.id}`}>
                                                        <FileText className="h-3 w-3" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="outline" asChild className="gap-1">
                                                    <Link href={`/transactions/${t.id}/edit`}>
                                                        <Edit className="h-3 w-3" />
                                                        Edit
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
