import { CustomerSelect } from '@/components/CustomerSelect';
import { DateLoading } from '@/components/DateLoading';
import { DateRangeSelect } from '@/components/DateSelect';
import { ProductSelect } from '@/components/ProductSelect';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserSelect } from '@/components/UserSelect';
import AppLayout from '@/layouts/app-layout';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import { type BreadcrumbItem } from '@/types';
import type { Customer, Item, Product, User } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: 'transactions.create',
    },
];
export default function TransactionsCreate() {
    const { errors } = usePage().props;
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
    const [selectedType, setSelectedType] = useState('rental');
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{
        startDate: Date | null;
        endDate: Date | null;
        duration: { days: number };
    }>({ startDate: null, endDate: null, duration: { days: 0 } });
    const [items, setItems] = useState<Item[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [netPrice, setNetPrice] = useState(0);
    const [pricelist, setPricelist] = useState<any>(null);
    const [discount, setDiscount] = useState(0);
    const [extraDiscount, setExtraDiscount] = useState(0);
    const [netNet, setNetNet] = useState(0);
    const [isPpn, setIsPpn] = useState(false);
    const [ppnAmount, setPpnAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [noPenawaran, setNoPenawaran] = useState('');
    const [lokasiEvent, setLokasiEvent] = useState('');
    const [noPo, setNoPo] = useState('');
    const [pic, setPic] = useState('');
    const [dateInstall, setDateInstall] = useState<{
        loadingDate: Date | null;
        unloadingDate: Date | null;
    }>({ loadingDate: null, unloadingDate: null });
    const [paymentType, setPaymentType] = useState('');
    const [termin, setTermin] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [jenisInstall, setJenisInstall] = useState('');
    const [delivery, setDelivery] = useState('');
    const [location, setLocation] = useState('');
    const { addToast } = useToast();
    const [confirmOpen, setConfirmOpen] = useState(false);
    useEffect(() => {
        if (errors) {
            Object.entries(errors).forEach(([field, message]) => {
                addToast({
                    message: `${field}: ${message}`,
                    type: 'error',
                    position: 'top-right',
                    duration: 4000,
                });
            });
        }
    }, [errors]);
    useEffect(() => {
        if (selectedProduct) {
            fetch(`/pricelists/${selectedProduct.id}`)
                .then((res) => res.json())
                .then((data) => setPricelist(data))
                .catch(() => setPricelist(null));
        }
    }, [selectedProduct]);
    useEffect(() => {
        if (pricelist && dateRange.duration.days > 0) {
            let price = 0;
            const days = dateRange.duration.days;
            if (days >= 25) price = (pricelist.price_30_days / 30) * dateRange.duration.days;
            else if (days >= 10) price = (pricelist.price_10_days / 10) * dateRange.duration.days;
            else if (days >= 7) price = (pricelist.price_7_days / 7) * dateRange.duration.days;
            else if (days >= 5) price = (pricelist.price_5_days / 5) * dateRange.duration.days;
            else if (days >= 3) price = (pricelist.price_3_days / 3) * dateRange.duration.days;
            else price = pricelist.price_1_day;
            setPrice(price);
        }
    }, [pricelist, dateRange]);
    const handleAddProduct = () => {
        console.log(price);
        if (!selectedProduct) return;
        const day = dateRange.duration.days || 1;
        let ttlpricelist = 0;
        if (day < 3) {
            ttlpricelist = price * quantity * day;
        } else {
            ttlpricelist = price * quantity;
        }
        const disc = ttlpricelist - netPrice;
        let persen = 0;
        if (ttlpricelist > 0) {
            persen = (disc / ttlpricelist) * 100;
        }
        if (!Number.isFinite(persen)) {
            persen = 0;
        }
        persen = Math.round(persen);
        // const persen = (disc / (price * quantity * dateRange.duration.days)) * 100 || 0;
        setDiscountPercent(persen);
        setDiscount(disc);
        console.log({ disc, persen });
        const newItem: Item = {
            product: selectedProduct,
            qty: quantity,
            price: ttlpricelist || selectedProduct.price, // ambil dari input, kalau kosong fallback ke harga product
            discount: disc,
            discount_percent: persen,
            netPrice: netPrice || selectedProduct.price,
            netNet: netPrice || selectedProduct.price,
            pricelist: ttlpricelist,
        };
        setItems((prev) => [...prev, newItem]);
        setDiscount(0);
        setDiscountPercent(0);
        setSelectedProduct(undefined);
        setQuantity(1);
        setPrice(0);
        setNetPrice(0);
    };

    const handleDeleteProduct = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };
    // hitungTotal
    const totals = () => {
        return items.reduce(
            (acc, item) => {
                const price = Number(item.pricelist) || 0;
                if (item.product?.type != 'jasa') {
                    acc.totalNetNet += item.netNet;
                    acc.totalPrice += item.price;
                    acc.totalPricelist += price;
                }
                acc.totalNetPrice += item.netPrice;
                acc.totalDiscount += item.discount;

                return acc;
            },
            { totalPrice: 0, totalNetPrice: 0, totalDiscount: 0, totalNetNet: 0, totalPricelist: 0 },
        );
    };
    useEffect(() => {
        const { totalNetNet } = totals();
        setNetNet(totalNetNet - extraDiscount);
    }, [items, extraDiscount]);
    useEffect(() => {
        const { totalNetPrice } = totals();
        if (isPpn) {
            const ppn = totalNetPrice * 0.11;
            setPpnAmount(ppn);
        } else {
            setPpnAmount(0); // Reset PPN if checkbox is unchecked
        }
    }, [isPpn, items, extraDiscount]);
    useEffect(() => {
        const { totalNetNet, totalNetPrice } = totals();
        const gtotal = totalNetPrice + ppnAmount;
        setGrandTotal(gtotal);
    }, [ppnAmount, items, extraDiscount]);
    // semua data siap di kirim ke server
    const prepareTransactionData = () => {
        const { totalPrice, totalNetPrice, totalDiscount, totalNetNet, totalPricelist } = totals();
        return {
            customer_id: selectedCustomer?.id,
            sales_id: selectedUser?.id,
            no_penawaran: noPenawaran,
            no_po: noPo,
            termin_of_payment: termin,
            payment: paymentType,
            operate_fee: 0, // Ganti sesuai data jika ada biaya operasi
            total_pricelist: totalPricelist, //total harga vendor
            price_deal: totalNetPrice, // net price dari sales
            total_discount: totalDiscount, // total diskon per item
            extra_discount: extraDiscount, // ed dari sales
            total_net: totalNetPrice, // Total net sebelum pajak
            total_net_net: netNet, // total net net - extra diskon
            is_ppn: isPpn,
            ppn_value: ppnAmount, // ppn 11 persen dari harga net
            total_final: grandTotal, // grandtotal harga net plus ppn
            transaction_type: selectedType,
            rental_start: dateRange.startDate,
            rental_end: dateRange.endDate,
            rental_duration: dateRange.duration.days,
            install_date: dateInstall.loadingDate,
            uninstall_date: dateInstall.unloadingDate,
            location: location,
            delivery: delivery,
            jenis_install: jenisInstall,
            description: lokasiEvent,
            pic: pic,
            items: items.map((item) => ({
                product_id: item.product?.id,
                qty: item.qty,
                price: item.price,
                discount: item.discount,
                discount_percent: item.discount_percent,
                net_price: item.netPrice,
                net_net: item.netNet,
            })),
        };
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = prepareTransactionData();
        console.log('Data transaksi yang akan dikirim:', transactionData);
        // router.post('/transactions', transactionData, {
        //     onSuccess: () => {
        //         // console.log('Transaksi berhasil disimpan');
        //         setConfirmOpen(false);
        //     },
        //     onError: (errors) => {
        //         // console.error('Terjadi kesalahan:', errors);
        //     },
        // });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Transaksi" />
            <div className="m-2 flex min-h-screen flex-1 flex-col gap-4 overflow-x-auto rounded-xl border-2 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Tambah Transaksi</h1>
                </div>
                <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Customer */}
                    <div className="flex flex-col gap-2 border border-gray-300 p-4">
                        <h1 className="font text-lg font-semibold">Form Customer</h1>
                        <div className="flex gap-4 p-2">
                            {/* Customer Form */}
                            <div className="flex flex-col gap-2">
                                <Label>Pilih Customer</Label>
                                <CustomerSelect value={selectedCustomer} onChange={(customer) => setSelectedCustomer(customer)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>No. PO</Label>
                                <Input
                                    type="text"
                                    value={noPo}
                                    onChange={(e) => setNoPo(e.target.value)}
                                    placeholder="No. PO"
                                    className="w-xs"
                                ></Input>
                            </div>
                        </div>
                        <div className="flex gap-4 p-2">
                            <div className="flex flex-col gap-2">
                                <Label>Pilih Sales</Label>
                                <UserSelect value={selectedUser} onChange={(sales) => setSelectedUser(sales)}></UserSelect>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>T.O.P</Label>
                                <Select onValueChange={(top) => setTermin(top)}>
                                    <SelectTrigger className="w-xs">
                                        <SelectValue placeholder="Pilih T.O.P..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>TOP</SelectLabel>
                                            <SelectItem value="cod">COD</SelectItem>
                                            <SelectItem value="7hari">7 Hari</SelectItem>
                                            <SelectItem value="15hari">15 Hari</SelectItem>
                                            <SelectItem value="30hari">30 Hari</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-4 p-2">
                            <div className="flex flex-col gap-2">
                                <Label>Payment</Label>
                                <Select onValueChange={(top) => setPaymentType(top)}>
                                    <SelectTrigger className="w-xs">
                                        <SelectValue placeholder="Pilih payment..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Payment</SelectLabel>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="transfer">Transfer</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* Form Event Detail */}
                    <div className="flex flex-col gap-2 border border-gray-300 p-4">
                        <div className="w-3xl">
                            <h1 className="font mb-2 text-lg font-semibold">Event Detail</h1>
                            {/* Tanggal */}
                            <div className="flex gap-2 p-2">
                                <DateRangeSelect value={dateRange} onChange={setDateRange}></DateRangeSelect>
                            </div>
                            {/* Tanggal Install & Deinstall */}
                            <div className="flex">
                                <div className="flex flex-col gap-2 p-2">
                                    <DateLoading value={dateInstall} onChange={setDateInstall}></DateLoading>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col gap-2 p-2">
                                    <Label>PIC</Label>
                                    <Input
                                        type="text"
                                        value={pic}
                                        onChange={(e) => setPic(e.target.value)}
                                        placeholder="PIC..."
                                        className="w-xs"
                                    ></Input>
                                </div>
                                <div className="flex gap-4 p-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>Jenis Instalasi</Label>
                                        <Select onValueChange={(install) => setJenisInstall(install)}>
                                            <SelectTrigger className="w-xs">
                                                <SelectValue placeholder="Pilih instalasi..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Instalasi</SelectLabel>
                                                    <SelectItem value="indoor">Indoor</SelectItem>
                                                    <SelectItem value="outdoor">Outdoor</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            {/* Lokasi deskripsi dan PIC */}
                            <div className="flex">
                                <div className="flex flex-col gap-2 p-2">
                                    <Label>Lokasi</Label>
                                    <Input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Lokasi event..."
                                        className="w-xs"
                                    ></Input>
                                </div>
                                <div className="flex gap-4 p-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>Pengiriman</Label>
                                        <Select onValueChange={(d) => setDelivery(d)}>
                                            <SelectTrigger className="w-xs">
                                                <SelectValue placeholder="Pilih pengiriman..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Pengiriman</SelectLabel>
                                                    <SelectItem value="internal">Internal</SelectItem>
                                                    <SelectItem value="vendor">Vendor</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    rows={3}
                                    value={lokasiEvent}
                                    onChange={(e) => setLokasiEvent(e.target.value)}
                                    placeholder="Deskripsi..."
                                    className="w-full"
                                ></Textarea>
                            </div>
                        </div>
                    </div>
                    {/* Produk */}
                    <div className="flex flex-col gap-2 border border-gray-300 p-4">
                        <h1 className="font text-lg font-semibold">Form Product</h1>
                        <div className="w-3xl">
                            <div className="flex flex-col gap-2 p-2">
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Product</Label>
                                        <div className="flex items-center gap-2">
                                            <ProductSelect value={selectedProduct} onChange={(product) => setSelectedProduct(product)} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Harga</Label>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            placeholder="Harga"
                                            className="w-28 flex-none"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Qty</Label>
                                        <Input
                                            type="number"
                                            step={0.1}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            placeholder="Qty"
                                            className="w-38 min-w-0 flex-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Net Price</Label>
                                        <Input
                                            type="number"
                                            value={netPrice}
                                            onChange={(e) => setNetPrice(Number(e.target.value))}
                                            placeholder="Net Price"
                                            className="w-38 flex-none"
                                        />
                                    </div>
                                </div>

                                <Button type="button" onClick={handleAddProduct} disabled={!selectedProduct} className="w-xs">
                                    + Tambah
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* Tabel produk */}
                        <table className="w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">WH</th>
                                    <th className="border p-2">Produk</th>
                                    <th className="border p-2">Qty</th>
                                    {/* <th className="border p-2">Harga PL</th> */}
                                    <th className="border p-2">Pricelist</th>
                                    <th className="border p-2">Harga Net</th>
                                    <th className="border p-2">Diskon</th>
                                    <th className="border p-2">Net Net</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="border p-2">{item.product?.kode_gudang}</td>
                                        <td className="border p-2">{item.product?.name}</td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                className="w-16 rounded border p-1"
                                                value={item.qty}
                                                min={1}
                                                disabled
                                                // onChange={(e) => handleChangeQty(i, parseInt(e.target.value) || 1)}
                                            />
                                        </td>
                                        {/* <td className="border p-2">{formatRupiah(item.price)}</td> */}
                                        <td className="border p-2">{formatRupiah(item.pricelist)}</td>
                                        <td className="border p-2">{formatRupiah(item.netPrice)}</td>
                                        <td className="border p-2">
                                            <div className="text-xs">
                                                <div>{formatRupiah(item.discount)}</div>
                                                <div>{formatPercent(item.discount_percent)}</div>
                                            </div>
                                        </td>
                                        <td className="border p-2">{formatRupiah(item.netNet)}</td>
                                        <td className="border p-2 text-center">
                                            <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteProduct(i)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold">
                                {(() => {
                                    const { totalPrice, totalDiscount, totalNetPrice, totalNetNet, totalPricelist } = totals();
                                    return (
                                        <tr>
                                            <td className="border p-2 text-center" colSpan={3}>
                                                TOTAL
                                            </td>
                                            {/* <td className="border p-2">{formatRupiah(totalPrice)}</td> */}
                                            <td className="border p-2">{formatRupiah(totalPricelist)}</td>
                                            <td className="border p-2">{formatRupiah(totalNetPrice)}</td>
                                            <td className="border p-2">{formatRupiah(totalDiscount)}</td>
                                            <td className="border p-2">{formatRupiah(totalNetNet)}</td>
                                        </tr>
                                    );
                                })()}
                                <tr>
                                    <td className="border p-2 text-right" colSpan={6}>
                                        ED
                                    </td>
                                    <td className="border p-2">{extraDiscount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2 text-right" colSpan={6}>
                                        Net Net
                                    </td>
                                    <td className="border p-2">{netNet.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2 text-right" colSpan={6}>
                                        PPN
                                    </td>
                                    <td className="border p-2">{ppnAmount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2 text-right" colSpan={6}>
                                        GrandTotal
                                    </td>
                                    <td className="border p-2">{grandTotal.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="mt-4 space-y-3 rounded-md border bg-gray-50 p-3 dark:bg-gray-800">
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="global-extra-discount" className="min-w-fit">
                                Extra Discount (Rp):
                            </Label>
                            <Input
                                id="global-extra-discount"
                                type="number"
                                value={extraDiscount}
                                onChange={(e) => setExtraDiscount(Number(e.target.value))}
                                placeholder="0"
                                className="w-40"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ppn-transaction" checked={isPpn} onCheckedChange={(c) => setIsPpn(c as boolean)} />
                                <Label htmlFor="ppn-transaction">PPN (11%)</Label>
                            </div>
                        </div>
                    </div>
                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogTrigger asChild>
                            <Button type="button">Simpan Transaksi</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Apakah anda yakin sudah mengisi semua form?</DialogTitle>
                                <DialogDescription>
                                    Cek kembali data transaksi sebelum disimpan. Setelah disimpan, data tidak dapat diubah lagi.
                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                                            Batal
                                        </Button>

                                        {/* 3) tombol submit menunjuk ke form lewat atribut form */}
                                        <Button type="submit" form="transaction-form" onClick={() => setConfirmOpen(false)}>
                                            Ya, Simpan Transaksi
                                        </Button>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </form>
            </div>
        </AppLayout>
    );
}
