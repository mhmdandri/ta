import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem, type Summary, type Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DollarSign, Eye, Filter, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    transactions: Transaction[];
    summary: Summary;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekap COR',
        href: 'report/rekap/cor',
    },
];

export default function RekapCorIndex({ transactions, summary }: Props) {
    const [filter, setFilter] = useState({
        status: '',
        customer: '',
        sales: '',
    });

    // Filter transactions based on current filter state
    const filteredTransactions = transactions.filter((transaction) => {
        if (filter.status && transaction.status !== filter.status) return false;
        if (filter.customer && !transaction.customer_name.toLowerCase().includes(filter.customer.toLowerCase())) return false;
        if (filter.sales && !transaction.sales_name.toLowerCase().includes(filter.sales.toLowerCase())) return false;
        return true;
    });

    // Get unique values for filter options
    const uniqueStatuses = [...new Set(transactions.map((t) => t.status))];
    const uniqueCustomers = [...new Set(transactions.map((t) => t.customer_name))].filter((name) => name !== 'N/A');
    const uniqueSales = [...new Set(transactions.map((t) => t.sales_name))].filter((name) => name !== 'N/A');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Report', href: '' },
                { title: 'Rekap COR', href: '' },
            ]}
        >
            <Head title="Rekap COR" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Rekap COR</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_transactions}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Customer</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_customers}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Qty</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_qty.toLocaleString()}</p>
                            </div>
                            <div className="rounded-full bg-orange-100 p-3">
                                <Package className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div> */}

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Nilai (NetNet)</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_value)}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <DollarSign className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filter:</span>
                        </div>

                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Status</option>
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Cari Customer..."
                            value={filter.customer}
                            onChange={(e) => setFilter({ ...filter, customer: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Cari Sales..."
                            value={filter.sales}
                            onChange={(e) => setFilter({ ...filter, sales: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />

                        {(filter.status || filter.customer || filter.sales) && (
                            <button
                                onClick={() => setFilter({ status: '', customer: '', sales: '' })}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Table */}
                <div className="rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Transaksi COR</h2>
                            <p className="text-sm text-gray-600">
                                Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">NO. COR</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nama Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status COR/COS</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Divisi</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Total Price List
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">NET PRICE</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">PPN 11%</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">SUB TOTAL</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredTransactions.map((transaction, index) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{transaction.no_cor}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.customer_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    transaction.status === 'COR'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : transaction.status === 'COS'
                                                          ? 'bg-green-100 text-green-800'
                                                          : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.sales_name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.divisi}</td>
                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {transaction.total_qty.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {formatCurrency(transaction.total_pricelist)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {formatCurrency(transaction.total_net)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {formatCurrency(transaction.ppn_value)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                                            {formatCurrency(transaction.total_final)}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <Link
                                                href={`/report/rekap/cor/${transaction.id}`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-gray-500">
                                {transactions.length === 0 ? 'Tidak ada data transaksi' : 'Tidak ada data yang sesuai dengan filter'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
