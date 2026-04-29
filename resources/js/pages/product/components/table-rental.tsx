import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatOnlyDate } from '@/lib/formatDateSafe';
import { usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';
import DetailModal from './detail-modal';
import ReturnModal from './return-modal';

type Item = {
    qty: number;
    kode_gudang: string;
};

type Transaction = {
    id: number;
    no_penawaran: string;
    rental_end: string;
    customer?: {
        name: string;
    };
    items: Item[];
};

export default function TableRental() {
    const { transactions } = usePage<{ transactions: Transaction[] }>().props;

    const source = transactions ?? [];
    console.log('transactions', transactions);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Daftar Rental
                </CardTitle>
                <p className="text-sm text-muted-foreground">Menampilkan {source.length} transaksi</p>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No COR</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Gudang</TableHead>
                                <TableHead>Tgl Selesai</TableHead>
                                <TableHead>Sisa Hari</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {source.length > 0 ? (
                                source.map((trx) => {
                                    const items = trx.items ?? [];

                                    const gudangList = [...new Set(items.map((i) => i.kode_gudang).filter(Boolean))];

                                    const diff = Math.ceil((new Date(trx.rental_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <TableRow key={trx.id}>
                                            <TableCell className="font-medium">{trx.no_penawaran}</TableCell>

                                            <TableCell>{trx.customer?.name ?? '-'}</TableCell>

                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {gudangList.length > 0
                                                        ? gudangList.map((g) => (
                                                              <span key={g} className="rounded bg-muted px-2 py-1 text-xs">
                                                                  {g}
                                                              </span>
                                                          ))
                                                        : '-'}
                                                </div>
                                            </TableCell>

                                            <TableCell>{formatOnlyDate(trx.rental_end)}</TableCell>

                                            <TableCell>
                                                {diff < 0 ? (
                                                    <span className="text-red-500">Terlambat {Math.abs(diff)} hari</span>
                                                ) : diff === 0 ? (
                                                    <span className="text-orange-500">Hari ini</span>
                                                ) : diff <= 2 ? (
                                                    <span className="text-yellow-600">{diff} hari lagi</span>
                                                ) : (
                                                    <span className="text-green-600">{diff} hari lagi</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="flex justify-center gap-2">
                                                <DetailModal transaction={trx} />
                                                <ReturnModal transaction={trx} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Tidak ada data rental
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
