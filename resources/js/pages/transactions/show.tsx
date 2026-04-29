import PdfTransaction from '@/components/pdf/pdfTransaction';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import { terbilangID } from '@/lib/formatTerbilang';
import { type BreadcrumbItem } from '@/types';
import type { Transaction } from '@/types/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import {
    BadgeDollarSign,
    BarChart3,
    Calendar,
    Check,
    Clock,
    CreditCard,
    Download,
    Eye,
    FileDigit,
    FileText,
    MapPin,
    Percent,
    Truck,
    User,
    Warehouse,
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transaksi', href: '/transactions' },
    { title: 'Detail Transaksi', href: '#' },
];

// Helpers (presentational only)
function InfoItem({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) {
    return (
        <div className="grid grid-cols-1 items-start gap-1 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <Label>{label}</Label>
            </div>
            <div className="font-medium text-foreground">{value ?? '-'}</div>
        </div>
    );
}

function Divider() {
    return <div className="my-4 h-px w-full bg-border" />;
}

function formatAddress(addr?: string | null) {
    if (!addr) return '-';
    return addr.replace(/,\s*/g, ',\n');
}

export default function TransaksiShow() {
    const { transaction } = usePage<{ transaction: Transaction & any }>().props;
    const [openConfirm, setOpenConfirm] = useState(false);
    const items: any[] = transaction?.items ?? [];
    //const day = transaction.rental_duration;

    // Helper function untuk menghitung data berdasarkan kode gudang
    const getWarehouseData = (kodeGudang: string) => {
        const warehouseItems = items.filter((item) => item?.product?.kode_gudang === kodeGudang);
        const totalQty = warehouseItems.reduce((total, item) => total + (item.qty || 0), 0);
        const totalValue = warehouseItems.reduce((total, item) => total + (item.net_net || 0), 0);

        return {
            qty: totalQty,
            value: totalValue,
            items: warehouseItems,
        };
    };

    // Data untuk setiap gudang
    //const gudangKMJ = getWarehouseData('01');
    //const gudangCabang = getWarehouseData('02');
    const gudangOS = getWarehouseData('04');

    // Hitung NetNet minus OS (KMJ + Cabang)
    const netNetMinusOS = transaction?.total_net_net - gudangOS.value;

    //const subtotalNet = transaction?.total_net ?? items.reduce((acc, it) => acc + (it.net_price ?? it.price_deal ?? 0), 0);
    const discountPersen = (transaction.total_pricelist - transaction.total_net_net) / transaction.total_pricelist;
    const formatStatus = (status?: string) => {
        switch (status) {
            case 'submitted':
                return 'Submitted';
            case 'confirmed':
                return 'Confirmed';
            case 'completed':
                return 'Completed';
            default:
                return status ?? '-';
        }
    };
    const textStatus = formatStatus(transaction.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${transaction?.no_penawaran || ''}`} />

            {/* Header Section */}
            <div className="px-4 pt-4 dark:bg-neutral-900">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Detail Transaksi</h1>
                        <p className="text-muted-foreground">No. COR: {transaction?.no_penawaran || '-'}</p>
                        <p className="text-muted-foreground">
                            Status:
                            <span className="ml-2 font-semibold">{textStatus}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            className="gap-2 bg-green-500 hover:bg-green-600"
                            onClick={() => setOpenConfirm(true)}
                            disabled={transaction.status !== 'submitted'}
                        >
                            <Check className="h-4 w-4" />
                            Confirm Rental
                        </Button>
                        <PDFDownloadLink
                            document={<PdfTransaction transaction={transaction} />}
                            fileName={`COR-${transaction?.no_penawaran || 'transaksi'}.pdf`}
                        >
                            {({ loading }) => (
                                <Button variant="default" className="gap-2" disabled={loading}>
                                    <Download className="h-4 w-4" />
                                    {loading ? 'Menyiapkan PDF…' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>

                        <BlobProvider document={<PdfTransaction transaction={transaction} />}>
                            {({ url, loading }) =>
                                url ? (
                                    <Button variant="outline" className="gap-2" onClick={() => window.open(url, '_blank')}>
                                        <Eye className="h-4 w-4" />
                                        Preview PDF
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="gap-2" disabled>
                                        <Eye className="h-4 w-4" />
                                        {loading ? 'Menyiapkan Preview…' : 'Error Preview'}
                                    </Button>
                                )
                            }
                        </BlobProvider>
                    </div>
                </div>
            </div>

            <div className="flex min-h-screen flex-col space-y-6 p-6 dark:bg-neutral-900">
                {/* Customer & COR Info */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Informasi Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <InfoItem label="Nama Customer" value={transaction?.customer?.name ?? '-'} icon={User} />
                            <InfoItem
                                label="Alamat"
                                value={<span className="whitespace-pre-line">{formatAddress(transaction?.customer?.address)}</span>}
                                icon={MapPin}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileDigit className="h-5 w-5" />
                                Confirmation of Rental
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <InfoItem label="Tanggal" value={<span>{formatOnlyDate(transaction?.rental_start)}</span>} icon={Calendar} />
                                    <InfoItem label="TOP" value={<span>{transaction?.termin_of_payment ?? '-'}</span>} icon={CreditCard} />
                                    <InfoItem label="Expedisi" value={<span>{transaction?.delivery ?? '-'}</span>} icon={Truck} />
                                </div>
                                <div className="space-y-3">
                                    <InfoItem label="No. PO" value={<span>{transaction?.no_po ?? '-'}</span>} icon={FileDigit} />
                                    <InfoItem label="No. COR" value={<span>{transaction?.no_penawaran ?? '-'}</span>} icon={BadgeDollarSign} />
                                    <InfoItem label="Penjual" value={<span>{transaction?.sales?.name ?? '-'}</span>} icon={User} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Barang */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Warehouse className="h-5 w-5" />
                            Daftar Barang
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-20">Gudang</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead className="text-center">Hari</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Price List</TableHead>
                                        <TableHead className="text-right">Net Price</TableHead>
                                        <TableHead className="text-right">Net Net</TableHead>
                                        <TableHead className="text-right">Diskon</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="p-4 text-center text-muted-foreground">
                                                Tidak ada item
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((it, i) => (
                                            <TableRow key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                                                <TableCell className="font-medium">{it?.kode_gudang ?? '-'}</TableCell>
                                                <TableCell>{it?.product?.name ?? '-'}</TableCell>
                                                <TableCell className="text-center">{transaction?.rental_duration ?? '-'}</TableCell>
                                                <TableCell className="text-center">{it?.qty ?? 0}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatRupiah(it?.product?.type == 'jasa' ? 0 : it?.price_pricelist, false)}
                                                </TableCell>
                                                <TableCell className="text-right">{formatRupiah(it?.net_price ?? it?.price_deal, false)}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatRupiah(it?.product?.type == 'jasa' ? 0 : it?.net_net, false)}
                                                </TableCell>
                                                <TableCell className="text-right">{formatPercent(it?.discount_percent)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                                <TableFooter className="bg-muted/50">
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={4} className="text-center">
                                            TOTAL
                                        </TableCell>
                                        <TableCell className="text-right">{formatRupiah(transaction?.total_pricelist, false)}</TableCell>
                                        <TableCell className="text-right">{formatRupiah(transaction?.total_net, false)}</TableCell>
                                        <TableCell className="text-right">{formatRupiah(transaction?.total_net_net, false)}</TableCell>
                                        <TableCell className="text-right">{formatPercent(discountPersen)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Ringkasan / Terbilang */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center rounded-lg bg-primary/5 p-3">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                <p className="font-semibold">Terbilang: </p>
                            </div>
                            <div className="ml-3">
                                <i className="text-sm text-muted-foreground">{terbilangID(transaction?.total_net_net)} rupiah</i>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Event Section & Summary */}
                <div className="mb-6 grid items-stretch gap-6 md:grid-cols-[60%_38%]">
                    {/* KIRI — Keterangan Event */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Keterangan Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <InfoItem label="Lokasi" value={transaction?.location ?? '-'} icon={MapPin} />
                                <InfoItem label="Jenis Instalasi" value={transaction?.jenis_instalasi || '-'} icon={FileText} />
                                <InfoItem
                                    label="Tanggal Event"
                                    value={`${formatOnlyDate(transaction?.rental_start)} – ${formatOnlyDate(transaction?.rental_end)}`}
                                    icon={Calendar}
                                />
                                <InfoItem
                                    label="Jam Event"
                                    value={`${formatOnlyTime(transaction?.rental_start)} – ${formatOnlyTime(transaction?.rental_end)}`}
                                    icon={Clock}
                                />
                                <InfoItem label="Tgl & Jam Instalasi" value={formatDate(transaction?.install_date)} icon={Calendar} />
                                <InfoItem label="Tgl & Jam Dismantled" value={formatDate(transaction?.uninstall_date)} icon={Calendar} />
                                <InfoItem label="PIC" value={transaction.pic} icon={User} />
                                <InfoItem label="Deskripsi" value={transaction?.description || '-'} icon={FileText} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* KANAN — Ringkasan Keuangan */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CreditCard className="h-5 w-5" />
                                    Ringkasan Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Sub Total (NP)</span>
                                        <span className="font-medium">{formatRupiah(transaction.total_net, false)}</span>
                                    </div>
                                    {transaction?.is_ppn == true && (
                                        <div className="flex justify-between">
                                            <span>PPN 11%</span>
                                            <span className="font-medium">{formatRupiah(transaction.ppn_value, false)}</span>
                                        </div>
                                    )}
                                    <Divider />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">{formatRupiah(transaction.total_final)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Percent className="h-5 w-5" />
                                    Summary COR
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Net Net</span>
                                        <span className="font-medium">{formatRupiah(transaction.total_net_net, false)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Barang OS</span>
                                        <span className="font-medium">{formatRupiah(gudangOS.value, false)}</span>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between font-bold">
                                        <span>Netnet-OS</span>
                                        <span className="text-primary">{formatRupiah(netNetMinusOS, false)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Extra Discount */}
                {transaction?.extra_discount && (
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
                                <Percent className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-semibold">Extra discount: </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-400">{formatRupiah(transaction.extra_discount)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer Tanda Tangan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Tanda Tangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-center text-sm md:grid-cols-3 lg:grid-cols-6">
                            {[
                                { title: 'Sales', name: transaction?.sales?.name ?? '' },
                                { title: 'Sales Admin', name: '' },
                                { title: 'Sales Mgr', name: '' },
                                { title: 'Finance', name: '' },
                                { title: 'Acct', name: '' },
                                { title: 'Marketing', name: '' },
                            ].map((x, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <p className="mb-2 font-semibold">{x.title}</p>
                                    <div className="mt-2 h-16 w-full border-b border-dashed" />
                                    {x.name && <p className="mt-2 text-xs text-muted-foreground">({x.name})</p>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Rental</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-muted-foreground">Yakin ingin konfirmasi transaksi ini?</p>

                        <AlertDialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                                Batal
                            </Button>

                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => {
                                    router.post(`/transactions/${transaction.id}/confirm`);
                                    setOpenConfirm(false);
                                }}
                            >
                                Ya, Konfirmasi
                            </Button>
                        </AlertDialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
