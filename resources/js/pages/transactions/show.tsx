// import PdfTransaction from '@/components/pdf/pdfTransaction';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import AppLayout from '@/layouts/app-layout';
// import { formatDate, formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
// import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
// import { terbilangID } from '@/lib/formatTerbilang';
// import { type BreadcrumbItem } from '@/types';
// import type { Transaction } from '@/types/types';
// import { Head, usePage } from '@inertiajs/react';
// import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
// import React from 'react';

// const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi', href: 'transactions' }];

// // Helpers (presentational only)
// function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
//     return (
//         <div className="grid grid-cols-1 items-start gap-2 text-sm">
//             <Label className="text-muted-foreground">{label}</Label>
//             <div className="font-medium">{value ?? '-'}</div>
//         </div>
//     );
// }

// function Divider() {
//     return <div className="my-4 h-px w-full bg-gray-200 print:bg-gray-300" />;
// }
// function fmtDate(input?: string | null) {
//     if (!input) return '-';
//     const d = new Date(input);
//     if (Number.isNaN(d.getTime())) return input;
//     return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' });
// }
// // helper kecil
// function formatAddress(addr?: string | null) {
//     if (!addr) return '-';
//     // pecah baris setelah koma
//     return addr.replace(/,\s*/g, ',\n');
// }

// export default function TransaksiShow() {
//     const { transaction } = usePage<{ transaction: Transaction & any }>().props;

//     const items: any[] = transaction?.items ?? [];
//     const day = transaction.rental_duration;
//     // Helper function untuk menghitung data berdasarkan kode gudang
//     const getWarehouseData = (kodeGudang: string) => {
//         const warehouseItems = items.filter((item) => item?.product?.kode_gudang === kodeGudang);
//         const totalQty = warehouseItems.reduce((total, item) => total + (item.qty || 0), 0);
//         const totalValue = warehouseItems.reduce((total, item) => total + (item.net_net || 0), 0);

//         return {
//             qty: totalQty,
//             value: totalValue,
//             items: warehouseItems,
//         };
//     };

//     // Data untuk setiap gudang
//     const gudangKMJ = getWarehouseData('01'); // Gudang 01 = KMJ
//     const gudangCabang = getWarehouseData('02'); // Gudang 02 = Cabang
//     const gudangOS = getWarehouseData('04'); // Gudang 03 = OS

//     // Hitung NetNet minus OS (KMJ + Cabang)
//     const netNetMinusOS = transaction?.total_net_net - gudangOS.value;

//     const subtotalNet = transaction?.total_net ?? items.reduce((acc, it) => acc + (it.net_price ?? it.price_deal ?? 0), 0);
//     // hitung persen diskon
//     const discountPersen = (transaction.total_pricelist - transaction.total_net_net) / transaction.total_pricelist;

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Transaksi" />
//             {/* Tombol Download */}
//             <div className="mx-auto mt-2 mb-3 flex max-w-5xl justify-end gap-2">
//                 <PDFDownloadLink
//                     document={<PdfTransaction transaction={transaction} />}
//                     fileName={`COR-${transaction?.no_penawaran || 'transaksi'}.pdf`}
//                 >
//                     {({ loading }) => (
//                         <Button variant="default" disabled={loading}>
//                             {loading ? 'Menyiapkan PDF…' : 'Download PDF'}
//                         </Button>
//                     )}
//                 </PDFDownloadLink>
//                 <BlobProvider document={<PdfTransaction transaction={transaction} />}>
//                     {({ url, loading, error }) =>
//                         url ? (
//                             <Button variant="secondary" onClick={() => window.open(url, '_blank')}>
//                                 Preview PDF
//                             </Button>
//                         ) : (
//                             <Button variant="secondary" disabled>
//                                 {loading ? 'Menyiapkan Preview…' : 'Error Preview'}
//                             </Button>
//                         )
//                     }
//                 </BlobProvider>
//             </div>

//             <div className="mx-auto mt-2 max-w-5xl rounded-lg border bg-white p-6 text-black shadow print:shadow-none">
//                 {/* Header */}
//                 <div className="mb-4 grid gap-2 md:grid-cols-2">
//                     <div className="">
//                         <h1 className="font-semibold">{transaction?.customer?.name ?? '-'}</h1>
//                         <span className="text-xs">{formatAddress(transaction?.customer?.address)}</span>
//                     </div>

//                     <div className="rounded-md border p-3 text-xs">
//                         <h1 className="mb-2 text-center text-lg font-bold">Confirmation of Rental</h1>
//                         <div className="grid gap-3 sm:grid-cols-2">
//                             <div className="space-y-2">
//                                 <InfoItem label="Tanggal" value={<span>{fmtDate(transaction?.rental_start)}</span>} />
//                                 <InfoItem label="TOP" value={<span>{transaction?.termin_of_payment ?? '-'}</span>} />
//                                 <InfoItem label="Expedisi" value={<span>{transaction?.delivery ?? '-'}</span>} />
//                                 <InfoItem label="No. PO" value={<span>{transaction?.no_po ?? '-'}</span>} />
//                             </div>
//                             <div className="space-y-2">
//                                 <InfoItem label="No. Pesanan" value={<span>{transaction?.no_po ?? '-'}</span>} />
//                                 <InfoItem label="No. COR" value={<span>{transaction?.no_penawaran ?? '-'}</span>} />
//                                 <InfoItem label="Penjual" value={<span>{transaction?.sales?.name ?? '-'}</span>} />
//                                 <InfoItem label="Pembayaran" value={<span>{transaction?.payment ?? '-'}</span>} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table Barang */}
//                 <div className="mb-4 overflow-x-auto rounded-md border">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className="w-[80px]">WH</TableHead>
//                                 <TableHead>Nama Barang</TableHead>
//                                 <TableHead className="text-center">Hari</TableHead>
//                                 <TableHead className="text-center">Qty</TableHead>
//                                 <TableHead className="text-right">Price List</TableHead>
//                                 <TableHead className="text-right">Net Price</TableHead>
//                                 <TableHead className="text-right">Net Net</TableHead>
//                                 <TableHead className="text-right">Diskon</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {items.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={8} className="p-4 text-center text-muted-foreground">
//                                         Tidak ada item
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 items.map((it, i) => (
//                                     <TableRow key={i}>
//                                         <TableCell>{it?.product?.kode_gudang ?? '-'}</TableCell>
//                                         <TableCell>{it?.product?.name ?? '-'}</TableCell>
//                                         <TableCell className="text-center">{transaction?.rental_duration ?? '-'}</TableCell>
//                                         <TableCell className="text-center">{it?.qty ?? 0}</TableCell>
//                                         <TableCell className="text-right">
//                                             {formatRupiah(it?.product?.type == 'jasa' ? 0 : it?.price_pricelist, false)}
//                                         </TableCell>
//                                         <TableCell className="text-right">{formatRupiah(it?.net_price ?? it?.price_deal, false)}</TableCell>
//                                         <TableCell className="text-right">
//                                             {formatRupiah(it?.product?.type == 'jasa' ? 0 : it?.net_net, false)}
//                                         </TableCell>
//                                         <TableCell className="text-right">{formatPercent(it?.discount_percent)}</TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                         <TableFooter>
//                             <TableRow className="font-bold">
//                                 <TableCell colSpan={4} className="text-center">
//                                     TOTAL
//                                 </TableCell>
//                                 <TableCell className="text-right">{formatRupiah(transaction?.total_pricelist, false)}</TableCell>
//                                 <TableCell className="text-right">{formatRupiah(transaction?.total_net, false)}</TableCell>
//                                 <TableCell className="text-right">{formatRupiah(transaction?.total_net_net, false)}</TableCell>
//                                 <TableCell className="text-right">{formatPercent(discountPersen)}</TableCell>
//                                 <TableCell className="text-right"></TableCell>
//                             </TableRow>
//                         </TableFooter>
//                     </Table>
//                 </div>

//                 {/* Ringkasan / Terbilang */}
//                 <div className="mb-3 w-full">
//                     <div className="flex items-center rounded-md border p-2">
//                         <div className="w-[80px]">
//                             <p className="text-sm font-semibold">Terbilang: </p>
//                         </div>
//                         <div>
//                             <i className="text-sm">{terbilangID(transaction?.total_net_net)} rupiah</i>
//                         </div>
//                     </div>
//                 </div>
//                 {/* <p className="mb-4 text-right text-sm font-semibold">Subtotal: Rp {formatRupiah(subtotalNet)}</p> */}

//                 {/* Event Section */}
//                 <div className="my-2 grid items-stretch gap-3 sm:grid-cols-[62%_36.7%] print:grid-cols-[62%_38%]">
//                     {/* KIRI — tinggi otomatis menyamai kolom kanan */}
//                     <Card className="flex h-full flex-col print:break-inside-avoid">
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-base">Keterangan Event</CardTitle>
//                         </CardHeader>
//                         <CardContent className="text-sm">
//                             <Table className="w-full">
//                                 <TableBody>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 align-top text-muted-foreground">Lokasi</TableCell>
//                                         <TableCell className="px-2 py-1.5 align-top font-medium break-words whitespace-pre-wrap">
//                                             {transaction?.location ?? '-'}
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Jenis Instalasi</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">{transaction?.jenis_instalasi || '-'}</TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tanggal Event</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">
//                                             {formatOnlyDate(transaction?.rental_start)} – {formatOnlyDate(transaction?.rental_end)}
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Jam Event</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">
//                                             {formatOnlyTime(transaction?.rental_start)} – {formatOnlyTime(transaction?.rental_end)}
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tgl &amp; Jam Instalasi</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">{formatDate(transaction?.install_date)}</TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tgl &amp; Jam Dismantled</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">{formatDate(transaction?.uninstall_date)}</TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">PIC</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">{transaction.pic}</TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Deskripsi</TableCell>
//                                         <TableCell className="px-2 py-1.5 font-medium">{transaction?.description || '-'}</TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>

//                     {/* KANAN — dua kartu; yang bawah mengisi sisa tinggi */}
//                     <div className="flex h-full flex-col gap-3">
//                         <Card className="w-full print:break-inside-avoid">
//                             {/* <CardHeader className="pb-2"><CardTitle className="text-base">Subtotal</CardTitle></CardHeader> */}
//                             <CardContent className="text-sm">
//                                 <Table className="w-full">
//                                     <TableBody>
//                                         <TableRow>
//                                             <TableCell className="px-2 py-1.5">Sub Total (NP)</TableCell>
//                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(transaction.total_net, false)}</TableCell>
//                                         </TableRow>
//                                         {transaction?.is_ppn == true && (
//                                             <TableRow>
//                                                 <TableCell className="px-2 py-1.5">PPN 11%</TableCell>
//                                                 <TableCell className="px-2 py-1.5 text-right">{formatRupiah(transaction.ppn_value, false)}</TableCell>
//                                             </TableRow>
//                                         )}
//                                         <TableRow>
//                                             <TableCell className="px-2 py-1.5">Total</TableCell>
//                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(transaction.total_final)}</TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </CardContent>
//                         </Card>

//                         <Card className="flex w-full flex-1 flex-col print:break-inside-avoid">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-base">Summary COR</CardTitle>
//                             </CardHeader>
//                             <CardContent className="text-sm">
//                                 <Table className="w-full">
//                                     <TableBody>
//                                         <TableRow>
//                                             <TableCell className="w-3/5 px-2 py-1.5">Net Net</TableCell>
//                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(transaction.total_net_net, false)}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell className="w-3/5 px-2 py-1.5">Barang OS</TableCell>
//                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(gudangOS.value, false)}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell className="w-3/5 px-2 py-1.5">Netnet-OS</TableCell>
//                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(netNetMinusOS, false)}</TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>

//                 {/* Extra Discount */}
//                 <div className="mb-3 w-full">
//                     <div className="flex items-center rounded-md border p-2">
//                         <div className="w-[120px]">
//                             <p className="text-sm font-semibold">Extra discount: </p>
//                         </div>
//                         <div>
//                             <p className="text-sm">{transaction?.extra_discount ? formatRupiah(transaction.extra_discount) : '-'}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer Tanda Tangan */}
//                 <Divider />
//                 <div className="grid grid-cols-2 gap-4 text-center text-xs sm:grid-cols-3 lg:grid-cols-6">
//                     {[
//                         { title: 'Sales', name: transaction?.sales?.name ?? '' },
//                         { title: 'Sales Admin', name: '' },
//                         { title: 'Sales Mgr', name: '' },
//                         { title: 'Finance', name: '' },
//                         { title: 'Acct', name: '' },
//                         { title: 'Marketing', name: '' },
//                     ].map((x, i) => (
//                         <div key={i}>
//                             <p className="font-semibold">{x.title}</p>
//                             <div className="mx-auto mt-2 h-12 w-full max-w-[120px] border-b" />
//                             {x.name && <p className="mt-1">{x.name}</p>}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

// // import PdfTransaction from '@/components/pdf/pdfTransaction';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Label } from '@/components/ui/label';
// // import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// // import AppLayout from '@/layouts/app-layout';
// // import { formatDate, formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
// // import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
// // import { terbilangID } from '@/lib/formatTerbilang';
// // import { type BreadcrumbItem } from '@/types';
// // import type { Transaction, TransactionItem } from '@/types/types';
// // import { Head, usePage } from '@inertiajs/react';
// // import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
// // import React from 'react';

// // const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi', href: 'transactions' }];

// // // =================== Helpers (presentational only) ===================
// // function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
// //     return (
// //         <div className="grid grid-cols-1 items-start gap-2 text-sm">
// //             <Label className="text-muted-foreground">{label}</Label>
// //             <div className="font-medium">{value ?? '-'}</div>
// //         </div>
// //     );
// // }

// // function Divider() {
// //     return <div className="my-4 h-px w-full bg-gray-200 print:bg-gray-300" />;
// // }

// // function safeDate(input?: string | null) {
// //     if (!input) return null;
// //     const d = new Date(input);
// //     return Number.isNaN(d.getTime()) ? null : d;
// // }

// // function fmtDate(input?: string | null) {
// //     const d = safeDate(input);
// //     if (!d) return '-';
// //     return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' });
// // }

// // /** Pecah baris alamat setelah koma, untuk print-friendly */
// // function formatAddress(addr?: string | null) {
// //     if (!addr) return '-';
// //     return addr.replace(/,\s*/g, ',\n');
// // }
// // // =====================================================================

// // export default function TransaksiShow() {
// //     const { transaction } = usePage<{ transaction: Transaction & any }>().props;

// //     // Ketikkan items supaya aman dipakai di map
// //     const items: (TransactionItem & {
// //         net_price?: number;
// //         price_deal?: number;
// //         qty?: number;
// //         price_pricelist?: number;
// //     })[] = Array.isArray(transaction?.items) ? transaction.items : [];
// //     const subtotalNet = React.useMemo(
// //         () =>
// //             typeof transaction?.total_net === 'number'
// //                 ? transaction.total_net
// //                 : items.reduce((acc, it) => acc + (it.net_price ?? it.price_deal ?? 0), 0),
// //         [transaction?.total_net, items],
// //     );

// //     // Guard divide by zero pada persen diskon
// //     const discountPersen = React.useMemo(() => {
// //         const tp = Number(transaction?.total_pricelist) || 0;
// //         const tnn = Number(transaction?.total_net_net) || 0;
// //         if (tp <= 0) return 0;
// //         return (tp - tnn) / tp;
// //     }, [transaction?.total_pricelist, transaction?.total_net_net]);

// //     return (
// //         <AppLayout breadcrumbs={breadcrumbs}>
// //             <Head title="Transaksi" />

// //             {/* Tombol Download */}
// //             <div className="mx-auto mt-2 mb-3 flex max-w-5xl justify-end gap-2">
// //                 <PDFDownloadLink
// //                     document={<PdfTransaction transaction={transaction} />}
// //                     fileName={`COR-${transaction?.no_penawaran || 'transaksi'}.pdf`}
// //                 >
// //                     {({ loading }) => (
// //                         <Button variant="default" disabled={loading}>
// //                             {loading ? 'Menyiapkan PDF…' : 'Download PDF'}
// //                         </Button>
// //                     )}
// //                 </PDFDownloadLink>

// //                 <BlobProvider document={<PdfTransaction transaction={transaction} />}>
// //                     {({ url, loading }) =>
// //                         url ? (
// //                             <Button variant="secondary" onClick={() => window.open(url, '_blank')}>
// //                                 Print PDF
// //                             </Button>
// //                         ) : (
// //                             <Button variant="secondary" disabled>
// //                                 {loading ? 'Menyiapkan Preview…' : 'Error Preview'}
// //                             </Button>
// //                         )
// //                     }
// //                 </BlobProvider>
// //             </div>

// //             <div className="mx-auto mt-2 max-w-5xl rounded-lg border bg-white p-6 text-black shadow print:shadow-none">
// //                 {/* Header */}
// //                 <div className="mb-4 grid gap-2 md:grid-cols-2">
// //                     <div>
// //                         <h1 className="font-semibold">{transaction?.customer?.name ?? '-'}</h1>
// //                         <span className="text-xs whitespace-pre-wrap">{formatAddress(transaction?.customer?.address)}</span>
// //                     </div>

// //                     <div className="rounded-md border p-3 text-xs">
// //                         <h1 className="mb-2 text-center text-lg font-bold">Confirmation of Rental</h1>
// //                         <div className="grid gap-3 sm:grid-cols-2">
// //                             <div className="space-y-2">
// //                                 <InfoItem label="Tanggal" value={<span>{formatOnlyDate(transaction?.rental_start)}</span>} />
// //                                 <InfoItem label="TOP" value={<span>{transaction?.termin_of_payment ?? '-'}</span>} />
// //                                 <InfoItem label="Expedisi" value={<span>{transaction?.delivery ?? '-'}</span>} />
// //                                 <InfoItem label="No. PO" value={<span>{transaction?.no_po ?? '-'}</span>} />
// //                             </div>
// //                             <div className="space-y-2">
// //                                 <InfoItem label="No. Pesanan" value={<span>{transaction?.no_po ?? '-'}</span>} />
// //                                 <InfoItem label="No. COR" value={<span>{transaction?.no_penawaran ?? '-'}</span>} />
// //                                 <InfoItem label="Penjual" value={<span>{transaction?.sales?.name ?? '-'}</span>} />
// //                                 <InfoItem label="Pembayaran" value={<span>{transaction?.payment ?? '-'}</span>} />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Table Barang */}
// //                 <div className="mb-4 overflow-x-auto rounded-md border">
// //                     <Table>
// //                         <TableHeader>
// //                             <TableRow>
// //                                 <TableHead className="w-[80px]">WH</TableHead>
// //                                 <TableHead>Nama Barang</TableHead>
// //                                 <TableHead className="text-center">Hari</TableHead>
// //                                 <TableHead className="text-center">Qty</TableHead>
// //                                 <TableHead className="text-right">Price List</TableHead>
// //                                 <TableHead className="text-right">Net Price</TableHead>
// //                                 <TableHead className="text-right">Net Net</TableHead>
// //                                 <TableHead className="text-right">Diskon</TableHead>
// //                             </TableRow>
// //                         </TableHeader>

// //                         <TableBody>
// //                             {items.length === 0 ? (
// //                                 <TableRow>
// //                                     <TableCell colSpan={8} className="p-4 text-center text-muted-foreground">
// //                                         Tidak ada item
// //                                     </TableCell>
// //                                 </TableRow>
// //                             ) : (
// //                                 items.map((it, i) => (
// //                                     <TableRow key={i}>
// //                                         <TableCell>{it?.product?.kode_gudang ?? '-'}</TableCell>
// //                                         <TableCell>{it?.product?.name ?? '-'}</TableCell>
// //                                         <TableCell className="text-center">{transaction?.rental_duration ?? '-'}</TableCell>
// //                                         <TableCell className="text-center">{it?.qty ?? 0}</TableCell>
// //                                         <TableCell className="text-right">
// //                                             {formatRupiah(it?.product?.type === 'jasa' ? 0 : it?.price_pricelist, false)}
// //                                         </TableCell>
// //                                         <TableCell className="text-right">{formatRupiah(it?.net_price ?? it?.price_deal, false)}</TableCell>
// //                                         <TableCell className="text-right">
// //                                             {formatRupiah(it?.product?.type === 'jasa' ? 0 : it?.net_net, false)}
// //                                         </TableCell>
// //                                         <TableCell className="text-right">{formatPercent(it?.discount_percent)}</TableCell>
// //                                     </TableRow>
// //                                 ))
// //                             )}
// //                         </TableBody>

// //                         <TableFooter>
// //                             <TableRow className="font-bold">
// //                                 <TableCell colSpan={4} className="text-center">
// //                                     TOTAL
// //                                 </TableCell>
// //                                 <TableCell className="text-right">{formatRupiah(transaction?.total_pricelist, false)}</TableCell>
// //                                 <TableCell className="text-right">{formatRupiah(subtotalNet, false)}</TableCell>
// //                                 <TableCell className="text-right">{formatRupiah(transaction?.total_net_net, false)}</TableCell>
// //                                 <TableCell className="text-right">{formatPercent(discountPersen)}</TableCell>
// //                             </TableRow>
// //                         </TableFooter>
// //                     </Table>
// //                 </div>

// //                 {/* Ringkasan / Terbilang */}
// //                 <div className="mb-3 w-full">
// //                     <div className="flex items-center rounded-md border p-2">
// //                         <div className="w-[80px]">
// //                             <p className="text-sm font-semibold">Terbilang: </p>
// //                         </div>
// //                         <div>
// //                             <i className="text-sm">{terbilangID(transaction?.total_net_net)} rupiah</i>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Event Section */}
// //                 <div className="my-2 grid items-stretch gap-3 sm:grid-cols-[62%_36.7%] print:grid-cols-[62%_38%]">
// //                     {/* KIRI */}
// //                     <Card className="flex h-full flex-col print:break-inside-avoid">
// //                         <CardHeader className="pb-2">
// //                             <CardTitle className="text-base">Keterangan Event</CardTitle>
// //                         </CardHeader>
// //                         <CardContent className="text-sm">
// //                             <Table className="w-full">
// //                                 <TableBody>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 align-top text-muted-foreground">Lokasi</TableCell>
// //                                         <TableCell className="px-2 py-1.5 align-top font-medium break-words whitespace-pre-wrap">
// //                                             {transaction?.location ?? '-'}
// //                                         </TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Jenis Instalasi</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">{transaction?.jenis_instalasi || '-'}</TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tanggal Event</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">
// //                                             {formatOnlyDate(transaction?.rental_start)} – {formatOnlyDate(transaction?.rental_end)}
// //                                         </TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Jam Event</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">
// //                                             {formatOnlyTime(transaction?.rental_start)} – {formatOnlyTime(transaction?.rental_end)}
// //                                         </TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tgl &amp; Jam Instalasi</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">{formatDate(transaction?.install_date)}</TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Tgl &amp; Jam Dismantled</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">{formatDate(transaction?.uninstall_date)}</TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">PIC</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">{transaction?.pic || '-'}</TableCell>
// //                                     </TableRow>
// //                                     <TableRow>
// //                                         <TableCell className="w-[180px] px-2 py-1.5 text-muted-foreground">Deskripsi</TableCell>
// //                                         <TableCell className="px-2 py-1.5 font-medium">{transaction?.description || '-'}</TableCell>
// //                                     </TableRow>
// //                                 </TableBody>
// //                             </Table>
// //                         </CardContent>
// //                     </Card>

// //                     {/* KANAN */}
// //                     <div className="flex h-full flex-col gap-3">
// //                         <Card className="w-full print:break-inside-avoid">
// //                             <CardContent className="text-sm">
// //                                 <Table className="w-full">
// //                                     <TableBody>
// //                                         <TableRow>
// //                                             <TableCell className="px-2 py-1.5">Sub Total (NP)</TableCell>
// //                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(subtotalNet, false)}</TableCell>
// //                                         </TableRow>
// //                                         {transaction?.is_ppn === true && (
// //                                             <TableRow>
// //                                                 <TableCell className="px-2 py-1.5">PPN 11%</TableCell>
// //                                                 <TableCell className="px-2 py-1.5 text-right">
// //                                                     {formatRupiah(transaction?.ppn_value, false)}
// //                                                 </TableCell>
// //                                             </TableRow>
// //                                         )}
// //                                         <TableRow>
// //                                             <TableCell className="px-2 py-1.5">Total</TableCell>
// //                                             <TableCell className="px-2 py-1.5 text-right">{formatRupiah(transaction?.total_final)}</TableCell>
// //                                         </TableRow>
// //                                     </TableBody>
// //                                 </Table>
// //                             </CardContent>
// //                         </Card>

// //                         <Card className="flex w-full flex-1 flex-col print:break-inside-avoid">
// //                             <CardHeader className="pb-2">
// //                                 <CardTitle className="text-base">Summary COR</CardTitle>
// //                             </CardHeader>
// //                             <CardContent className="text-sm">
// //                                 <Table className="w-full">
// //                                     <TableBody>
// //                                         <TableRow>
// //                                             <TableCell className="w-3/5 px-2 py-1.5">Net Net</TableCell>
// //                                             <TableCell className="px-2 py-1.5 text-right">
// //                                                 {formatRupiah(transaction?.total_net_net, false)}
// //                                             </TableCell>
// //                                         </TableRow>
// //                                         <TableRow>
// //                                             <TableCell className="w-3/5 px-2 py-1.5">Barang OS</TableCell>
// //                                             <TableCell className="px-2 py-1.5 text-right">-</TableCell>
// //                                         </TableRow>
// //                                         <TableRow>
// //                                             <TableCell className="w-3/5 px-2 py-1.5">Netnet-OS</TableCell>
// //                                             <TableCell className="px-2 py-1.5 text-right">-</TableCell>
// //                                         </TableRow>
// //                                     </TableBody>
// //                                 </Table>
// //                             </CardContent>
// //                         </Card>
// //                     </div>
// //                 </div>

// //                 {/* Extra Discount */}
// //                 <div className="mb-3 w-full">
// //                     <div className="flex items-center rounded-md border p-2">
// //                         <div className="w-[120px]">
// //                             <p className="text-sm font-semibold">Extra discount: </p>
// //                         </div>
// //                         <div>
// //                             <p className="text-sm">{transaction?.extra_discount ? formatRupiah(transaction.extra_discount) : '-'}</p>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Footer Tanda Tangan */}
// //                 <Divider />
// //                 <div className="grid grid-cols-2 gap-4 text-center text-xs sm:grid-cols-3 lg:grid-cols-6">
// //                     {[
// //                         { title: 'Sales', name: transaction?.sales?.name ?? '' },
// //                         { title: 'Sales Admin', name: '' },
// //                         { title: 'Sales Mgr', name: '' },
// //                         { title: 'Finance', name: '' },
// //                         { title: 'Acct', name: '' },
// //                         { title: 'Marketing', name: '' },
// //                     ].map((x, i) => (
// //                         <div key={i}>
// //                             <p className="font-semibold">{x.title}</p>
// //                             <div className="mx-auto mt-2 h-12 w-full max-w-[120px] border-b" />
// //                             {x.name && <p className="mt-1">{x.name}</p>}
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </AppLayout>
// //     );
// // }

import PdfTransaction from '@/components/pdf/pdfTransaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import { terbilangID } from '@/lib/formatTerbilang';
import { type BreadcrumbItem } from '@/types';
import type { Transaction } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import {
    BadgeDollarSign,
    BarChart3,
    Calendar,
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
import React from 'react';

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

    const items: any[] = transaction?.items ?? [];
    const day = transaction.rental_duration;

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
    const gudangKMJ = getWarehouseData('01');
    const gudangCabang = getWarehouseData('02');
    const gudangOS = getWarehouseData('04');

    // Hitung NetNet minus OS (KMJ + Cabang)
    const netNetMinusOS = transaction?.total_net_net - gudangOS.value;

    const subtotalNet = transaction?.total_net ?? items.reduce((acc, it) => acc + (it.net_price ?? it.price_deal ?? 0), 0);
    const discountPersen = (transaction.total_pricelist - transaction.total_net_net) / transaction.total_pricelist;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${transaction?.no_penawaran || ''}`} />

            {/* Header Section */}
            <div className="bg-gray-50 px-4 pt-4 dark:bg-neutral-900">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Detail Transaksi</h1>
                        <p className="text-muted-foreground">No. Penawaran: {transaction?.no_penawaran || '-'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
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
                            {({ url, loading, error }) =>
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

            <div className="flex min-h-screen flex-col space-y-6 bg-gray-50 p-6 dark:bg-neutral-900">
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
                                        <TableHead className="w-[80px]">Gudang</TableHead>
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
                                                <TableCell className="font-medium">{it?.product?.kode_gudang ?? '-'}</TableCell>
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
            </div>
        </AppLayout>
    );
}
