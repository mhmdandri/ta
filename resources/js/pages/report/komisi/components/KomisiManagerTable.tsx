import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
    s: {
        avgDisc?: number; // mis. 30 -> 30%
        rateKomisiManager?: number; // mis. 1.5 -> 1.5%
        persenTarget?: number; // mis. 68 -> 68%
        netNetWithoutOS?: number; // nilai penjualan sendiri (tanpa OS)
        sum_total_net_net_os?: number; // nilai OS
        potongan_ca?: number; // angka rupiah
        potongan_tanggung_renteng?: number; // angka rupiah
    };
    formatRupiah: (n?: number, withSymbol?: boolean) => string;
    formatKomisi: (n?: number) => string;
};

export default function KomisiManagerTable({ s, formatRupiah, formatKomisi }: Props) {
    const avgDisc = s.avgDisc ?? 0;
    const rateKomisi = s.rateKomisiManager ?? 0;
    const persenTarget = s.persenTarget ?? 0;

    const barangSendiri = s.netNetWithoutOS ?? 0;
    const barangOs = s.sum_total_net_net_os ?? 0;

    const komisiBarangSendiri = Math.round(barangSendiri * (rateKomisi / 100));
    const komisiBarangOs = Math.round(barangOs * (1 / 100));

    const add25Pct = persenTarget > 100 ? 25 : 0; // penambahan 25%
    const cut25Pct = persenTarget <= 75 ? 25 : 0; // pengurangan 25%

    const subTotal = komisiBarangSendiri + komisiBarangOs;
    const addAmt = Math.round(subTotal * (add25Pct / 100));
    const cutAmt = Math.round(subTotal * (cut25Pct / 100));

    const finalKomisi = subTotal + addAmt - cutAmt;

    return (
        <div className="mt-4 overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="w-[50%]">Keterangan</TableHead>
                        <TableHead className="w-[25%] text-right">Nilai</TableHead>
                        <TableHead className="w-[25%] text-right">Komisi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Average Disc — Rate Komisi</TableCell>
                        <TableCell className="text-right">{formatKomisi(avgDisc)}</TableCell>
                        <TableCell className="text-right">{formatKomisi(rateKomisi)}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Total Komisi Barang Sendiri</TableCell>
                        <TableCell className="text-right">Rp {formatRupiah(barangSendiri, false)}</TableCell>
                        <TableCell className="text-right">Rp {formatRupiah(komisiBarangSendiri, false)}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Total Komisi OS</TableCell>
                        <TableCell className="text-right">{barangOs ? `Rp ${formatRupiah(barangOs, false)}` : '0'}</TableCell>
                        <TableCell className="text-right">{komisiBarangOs ? `Rp ${formatRupiah(komisiBarangOs, false)}` : '0'}</TableCell>
                    </TableRow>

                    {/* Penambahan bila > 100% target */}
                    <TableRow>
                        <TableCell className="font-medium">Penambahan Mencapai Target</TableCell>
                        <TableCell className="text-right">{add25Pct ? `${add25Pct}%` : '0'}</TableCell>
                        <TableCell className="text-right">{addAmt ? `Rp ${formatRupiah(addAmt, false)}` : '0'}</TableCell>
                    </TableRow>

                    {/* Subtotal */}
                    <TableRow className="bg-slate-50">
                        <TableCell className="font-semibold">Sub Total Komisi</TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">Rp {formatRupiah(subTotal, false)}</TableCell>
                    </TableRow>

                    {/* Pengurangan bila ≤ 75% target */}
                    <TableRow>
                        <TableCell className="font-medium text-red-600">Pengurangan Tidak Mencapai Target</TableCell>
                        <TableCell className="text-right text-red-600">{cut25Pct ? `${cut25Pct}%` : '−'}</TableCell>
                        <TableCell className="text-right text-red-600">{cutAmt ? `Rp ${formatRupiah(cutAmt, false)}` : '−'}</TableCell>
                    </TableRow>

                    {/* Final */}
                    <TableRow className="bg-cyan-50">
                        <TableCell className="font-semibold">Komisi (Periode) yang Diterima</TableCell>
                        <TableCell />
                        <TableCell className="text-right font-bold">Rp {formatRupiah(finalKomisi, false)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
