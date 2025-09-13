import AppLayout from '@/layouts/app-layout';
import { formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
import { formatRupiah } from '@/lib/formatRupiah';
import { type Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, FileText, Package, User } from 'lucide-react';

interface TransactionItem {
    product_name: string;
    product_type: string;
    qty: number;
    unit: string;
    price_pricelist: number;
    price_deal: number;
    discount: number;
    kode_gudang: string;
    discount_percent: number;
    net_net: number;
}

interface Props {
    transaction: Transaction;
}

export default function RekapCorDetail({ transaction }: Props) {
    // Calculate totals by product type
    const itemsByType = transaction.items.reduce(
        (acc, item) => {
            const type = item.product_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        },
        {} as Record<string, TransactionItem[]>,
    );
    const calculateNetNetByWarehouse = (kodeGudang: string) => {
        return transaction.items.filter((item) => item.kode_gudang === kodeGudang).reduce((total, item) => total + (item.net_net || 0), 0);
    };

    // Hitung total untuk setiap gudang
    //const totalNetNetGudang01 = calculateNetNetByWarehouse('01'); // KMJ
    const totalNetNetGudang02 = calculateNetNetByWarehouse('02'); // Cabang
    const totalNetNetGudang04 = calculateNetNetByWarehouse('04'); // OS

    function addDays(date: Date | string, days: number) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Report', href: '' },
                { title: 'Rekap COR', href: '/report/rekap/cor' },
                { title: 'Detail', href: '' },
            ]}
        >
            <Head title={`Detail COR - ${transaction.no_cor}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/report/rekap/cor"
                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Rekap COR - {transaction.no_cor}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            <FileText className="h-4 w-4" />
                            Print
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                            <FileText className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <User className="h-5 w-5" />
                            Informasi Transaksi
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">NO. COR:</span>
                                <span className="font-medium">{transaction.no_cor}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Customer:</span>
                                <span className="font-medium">{transaction.customer_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sales:</span>
                                <span className="font-medium">{transaction.sales_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                        transaction.status === 'COR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Divisi:</span>
                                <span className="font-medium">{transaction.divisi}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">PIC:</span>
                                <span className="font-medium">{transaction.pic || '-'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Calendar className="h-5 w-5" />
                            Informasi Waktu & Lokasi
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tanggal Transaksi:</span>
                                <span className="font-medium">{formatOnlyDate(transaction.created_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rental Start:</span>
                                <span className="font-medium">{formatOnlyDate(transaction.rental_start)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rental End:</span>
                                <span className="font-medium">{formatOnlyDate(transaction.rental_end)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Install Date:</span>
                                <span className="font-medium">{formatOnlyDate(transaction.install_date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Uninstall Date:</span>
                                <span className="font-medium">{formatOnlyDate(transaction.uninstall_date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lokasi:</span>
                                <span className="font-medium">{transaction.location || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Items Table */}
                <div className="rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Package className="h-5 w-5" />
                            Detail Barang
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th> */}
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Detail Barang</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Barang KMJ</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Barang Cabang
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Barang OS</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Total Pricelist
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Net Price</th>

                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">NILAI CABANG</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">NILAI OS</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">NET NET</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        NET NET Tanpa OS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {transaction.items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {/* <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td> */}
                                        <td className="px-4 py-4 text-sm text-gray-900">{item.product_name}</td>
                                        <td className="px-4 py-4 text-center text-sm text-gray-900">{item.kode_gudang === '01' ? '✓' : '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm text-gray-900">{item.kode_gudang === '02' ? '✓' : '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm text-gray-900">{item.kode_gudang === '04' ? '✓' : '-'}</td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">{item.qty.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.product_type == 'jasa' ? '0' : formatRupiah(item.price_pricelist)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.product_type == 'jasa' ? 0 : formatRupiah(item.price_deal)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.kode_gudang === '02' ? formatRupiah(item.net_net) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.kode_gudang === '04' ? formatRupiah(item.net_net) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.product_type == 'jasa' ? 0 : formatRupiah(item.net_net)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {item.kode_gudang !== '04' ? formatRupiah(item.net_net) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900" colSpan={5}>
                                        TOTAL
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        {formatRupiah(transaction.total_pricelist, false)}
                                    </th>
                                    <th>
                                        <span className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                            {formatRupiah(transaction.total_net, false)}
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        {totalNetNetGudang02 > 0 ? formatRupiah(totalNetNetGudang02, false) : '-'}
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        {totalNetNetGudang04 > 0 ? formatRupiah(totalNetNetGudang04, false) : '-'}
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        {formatRupiah(transaction.total_net_net)}
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        {formatRupiah(transaction.total_net_net - totalNetNetGudang04, false)}
                                        {/* {formatRupiah(transaction.total_net_net - calculateTypeNetNet(itemsByType['jasa'] || []), false)} */}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Summary Totals */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Summary Nilai</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Diskon:</span>
                                <span className="font-medium">{formatRupiah(transaction.total_discount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">NetNet:</span>
                                <span className="font-medium">{formatRupiah(transaction.total_net_net)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Net Price:</span>
                                <span className="font-medium">{formatRupiah(transaction.total_net)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">DPP:</span>
                                <span className="font-medium">{formatRupiah(transaction.total_net)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">PPN 11%:</span>
                                <span className="font-medium">{formatRupiah(transaction.ppn_value)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                                <span className="font-semibold text-gray-900">TOTAL</span>
                                <span className="text-lg font-bold">{formatRupiah(transaction.total_final)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Summary Tambahan</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">EKSTRA DISKON:</span>
                                <span className="font-medium">{formatRupiah(transaction.extra_discount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">JASA OPERATE:</span>
                                <span className="font-medium">{formatRupiah(transaction.operate_fee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">JASA STIKER:</span>
                                <span className="font-medium">-</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">JASA KIRIM:</span>
                                <span className="font-medium">-</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">POT KENDALA EVENT:</span>
                                <span className="font-medium">-</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Event & Delivery Info */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Informasi Event & Pengiriman</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <h3 className="mb-2 font-medium text-gray-900">Event</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Waktu Event:</span>
                                    <span>
                                        {formatOnlyDate(transaction.rental_start)} - {formatOnlyDate(transaction.rental_end)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jam:</span>
                                    <span>
                                        {formatOnlyTime(transaction.rental_start)} - {formatOnlyTime(transaction.rental_end)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 font-medium text-gray-900">Loading/Kirim Barang</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tgl:</span>
                                    <span>{formatOnlyDate(transaction.install_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jam:</span>
                                    <span>{formatOnlyTime(transaction.install_date)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 font-medium text-gray-900">Unloading</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tgl:</span>
                                    <span>{formatOnlyDate(transaction.uninstall_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jam:</span>
                                    <span>{formatOnlyTime(transaction.uninstall_date)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tanggal Invoicing:</span>
                            <span className="font-medium">{formatOnlyDate(addDays(transaction.rental_end, 7))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
