import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DetailModal({ transaction }: any) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    Detail
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Barang - {transaction.no_penawaran}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    {transaction.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between border-b pb-2 text-sm">
                            <div>
                                <div className="font-medium">{item.product?.name ?? 'Produk'}</div>
                                <div className="text-xs text-muted-foreground">Gudang: {item.kode_gudang || '-'}</div>
                            </div>

                            <div className="font-semibold">Qty: {item.qty}</div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
