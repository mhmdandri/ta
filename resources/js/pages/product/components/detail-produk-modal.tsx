import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Product } from '@/types/types';
import { router } from '@inertiajs/react';
import React from 'react';
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
};

export default function DetailProdukModal({ open, onOpenChange, product }: Props) {
    const [fromGudang, setFromGudang] = React.useState('');
    const [toGudang, setToGudang] = React.useState('');
    const [qty, setQty] = React.useState(1);
    const [showTransfer, setShowTransfer] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Stock Produk</DialogTitle>
                </DialogHeader>

                {product && (
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.code}</p>
                        </div>

                        <div className="space-y-2">
                            {product.stocks?.map((s) => (
                                <div
                                    key={s.kode_gudang}
                                    className="flex cursor-pointer justify-between border-b pb-1 text-sm hover:bg-muted/50"
                                    onClick={() => setFromGudang(s.kode_gudang)}
                                >
                                    <span>Gudang {s.kode_gudang}</span>

                                    <span className={Number(s.stock) === 0 ? 'font-medium text-red-500' : 'font-medium text-green-600'}>
                                        {s.stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* TRANSFER GUDANG */}
                        <div className="mt-4 border-t pt-3">
                            {!showTransfer ? (
                                <Button variant="outline" className="w-full" onClick={() => setShowTransfer(true)}>
                                    Transfer Gudang
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold">Transfer Gudang</p>

                                    <div className="flex gap-2">
                                        <Input placeholder="Dari (01)" value={fromGudang} onChange={(e) => setFromGudang(e.target.value)} />
                                        <Input placeholder="Ke (04)" value={toGudang} onChange={(e) => setToGudang(e.target.value)} />
                                        <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            className="w-full"
                                            disabled={!fromGudang || !toGudang || qty <= 0 || loading}
                                            onClick={() => {
                                                if (!product) return;

                                                setLoading(true);

                                                router.post(
                                                    '/stock/transfer',
                                                    {
                                                        product_id: product.id,
                                                        from_kode_gudang: fromGudang,
                                                        to_kode_gudang: toGudang,
                                                        qty: qty,
                                                    },
                                                    {
                                                        onFinish: () => {
                                                            setLoading(false);
                                                            setFromGudang('');
                                                            setToGudang('');
                                                            setQty(1);
                                                            setShowTransfer(false); // ✅ auto close form
                                                        },
                                                    },
                                                );
                                            }}
                                        >
                                            {loading ? 'Memproses...' : 'Transfer'}
                                        </Button>

                                        <Button variant="outline" onClick={() => setShowTransfer(false)}>
                                            Batal
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
