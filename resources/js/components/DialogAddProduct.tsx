// components/DialogAddProduct.tsx
import { ProductSelect } from '@/components/ProductSelect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product } from '@/types/types';
import { useEffect, useState } from 'react';

type Props = {
    onAdd: (payload: { product: Product; qty: number; netPrice: number; price: number }) => void;
    triggerClassName?: string;
};

export default function DialogAddProduct({ onAdd, triggerClassName }: Props) {
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState<number>(1);
    const [netPrice, setNetPrice] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // Reset form tiap kali dialog ditutup
    useEffect(() => {
        if (!open) {
            setProduct(null);
            setQty(1);
            setNetPrice(0);
            setPrice(0);
        }
    }, [open]);

    const canSubmit = !!product && qty > 0;

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (!canSubmit || !product) return;
        onAdd({ product, qty, netPrice, price });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" className={triggerClassName ?? 'w-40'}>
                    + Tambah Produk
                </Button>
            </DialogTrigger>

            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah Produk</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Product */}
                        <div className="col-span-1 sm:col-span-2">
                            <Label className="mb-1 block">Product</Label>
                            <ProductSelect value={product ?? undefined} onChange={(p) => setProduct(p)} />
                        </div>

                        {/* Qty */}
                        <div>
                            <Label className="mb-1 block">Qty</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                min={0}
                                value={Number.isNaN(qty) ? '' : qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                placeholder="Qty"
                            />
                        </div>

                        {/* Net Price */}
                        <div>
                            <Label className="mb-1 block">Net Price</Label>
                            <Input
                                type="number"
                                inputMode="numeric"
                                value={Number.isNaN(netPrice) ? '' : netPrice}
                                onChange={(e) => setNetPrice(Number(e.target.value))}
                                placeholder="Net Price"
                            />
                        </div>

                        {/* Harga */}
                        <div className="sm:col-span-2">
                            <Label className="mb-1 block">Harga</Label>
                            <Input
                                type="number"
                                inputMode="numeric"
                                value={Number.isNaN(price) ? '' : price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="Harga"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            Tambah
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
