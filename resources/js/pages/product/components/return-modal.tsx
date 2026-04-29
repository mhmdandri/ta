import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const warehouses = ['01', '02', '04']; // 🔥 bisa ambil dari backend nanti

export default function ReturnModal({ transaction }: any) {
    const [open, setOpen] = useState(false);
    const [returns, setReturns] = useState<any[]>([]);

    const initData = () => {
        const data = transaction.items
            .filter((item: any) => item.product?.type !== 'jasa') // 🔥 FILTER DI SINI
            .map((item: any) => ({
                product_id: item.product_id,
                product_name: item.product?.name,
                product_type: item.product?.type, // 🔥 simpan juga
                total_qty: Number(item.qty),
                splits: [
                    {
                        qty: Number(item.qty),
                        kode_gudang: item.kode_gudang,
                    },
                ],
            }));

        setReturns(data);
    };

    const handleSplitChange = (i: number, j: number, field: string, value: any) => {
        const updated = [...returns];
        updated[i].splits[j][field] = value;
        setReturns(updated);
    };

    const addSplit = (i: number) => {
        const updated = [...returns];
        updated[i].splits.push({ qty: 0, kode_gudang: '' });
        setReturns(updated);
    };

    const removeSplit = (i: number, j: number) => {
        const updated = [...returns];
        updated[i].splits.splice(j, 1);
        setReturns(updated);
    };

    const handleSubmit = () => {
        // 🔥 VALIDASI TOTAL QTY
        console.log('returns:', returns);
        for (const item of returns) {
            const totalSplit = item.splits.reduce((sum: number, s: any) => sum + Number(s.qty || 0), 0);

            if (totalSplit !== Number(item.total_qty)) {
                alert(`Qty tidak sesuai untuk ${item.product_name}`);
                return;
            }
        }

        // 🔥 FLATTEN DATA
        const payload: any[] = [];

        returns.forEach((item) => {
            item.splits.forEach((s: any) => {
                payload.push({
                    product_id: item.product_id,
                    qty: s.qty,
                    kode_gudang: s.kode_gudang,
                });
            });
        });

        router.post(`/transactions/${transaction.id}/return`, {
            returns: payload, // 🔥 FIX
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) initData();
            }}
        >
            <DialogTrigger asChild>
                <Button size="sm">Return</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Return Barang</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {returns
                        .filter((item) => item.product_name) // atau cek type kalau dikirim
                        .map((item, i) => (
                            <div key={i} className="space-y-3 rounded border p-3">
                                <div className="font-semibold">
                                    {item.product_name} (Total: {item.total_qty})
                                </div>

                                {item.splits.map((split: any, j: number) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={split.qty}
                                            onChange={(e) => handleSplitChange(i, j, 'qty', Number(e.target.value))}
                                        />

                                        <Select value={split.kode_gudang} onValueChange={(val) => handleSplitChange(i, j, 'kode_gudang', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Gudang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {warehouses.map((w) => (
                                                    <SelectItem key={w} value={w}>
                                                        Gudang {w}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {item.splits.length > 1 && (
                                            <Button variant="outline" size="sm" onClick={() => removeSplit(i, j)}>
                                                X
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <Button size="sm" onClick={() => addSplit(i)}>
                                    Tambah Gudang
                                </Button>
                            </div>
                        ))}
                </div>

                <Button onClick={handleSubmit} className="mt-4 w-full">
                    Simpan Return
                </Button>
            </DialogContent>
        </Dialog>
    );
}
