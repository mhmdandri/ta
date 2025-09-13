import { formatDate, formatOnlyDate, formatOnlyTime } from '@/lib/formatDateSafe';
import { formatPercent, formatRupiah } from '@/lib/formatRupiah';
import { terbilangID } from '@/lib/formatTerbilang';
import type { Transaction } from '@/types/types';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Register fonts (optional)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// });

const toStr = (v: unknown) => (v === 0 ? '0' : v == null ? '' : String(v));
export const Txt: React.FC<{ children?: React.ReactNode }> = ({ children }) => <Text>{toStr(children as any)}</Text>;

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    customerInfo: {
        flex: 1,
        marginRight: 20,
    },
    corInfo: {
        flex: 1,
        border: '1px solid #000',
        padding: 10,
    },
    corTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    table: {
        marginTop: 10,
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #000',
        paddingVertical: 5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ccc',
        paddingVertical: 3,
    },
    tableFooter: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #000',
        paddingVertical: 5,
        fontWeight: 'bold',
    },
    col1: { width: '10%', paddingHorizontal: 3, fontSize: 8 },
    col2: { width: '25%', paddingHorizontal: 3, fontSize: 8 },
    col3: { width: '8%', paddingHorizontal: 3, fontSize: 8, textAlign: 'center' },
    col4: { width: '8%', paddingHorizontal: 3, fontSize: 8, textAlign: 'center' },
    col5: { width: '12%', paddingHorizontal: 3, fontSize: 8, textAlign: 'right' },
    col6: { width: '12%', paddingHorizontal: 3, fontSize: 8, textAlign: 'right' },
    col7: { width: '12%', paddingHorizontal: 3, fontSize: 8, textAlign: 'right' },
    col8: { width: '10%', paddingHorizontal: 3, fontSize: 8, textAlign: 'right' },
    terbilang: {
        border: '1px solid #000',
        padding: 8,
        marginVertical: 10,
        flexDirection: 'row',
    },
    terbilangLabel: {
        width: 60,
        fontSize: 9,
        fontWeight: 'bold',
    },
    terbilangText: {
        flex: 1,
        fontSize: 9,
        fontStyle: 'italic',
    },
    eventSection: {
        flexDirection: 'row',
        marginVertical: 10,
        gap: 15,
    },
    eventInfo: {
        flex: 1,
        border: '1px solid #ccc',
        padding: 8,
    },
    eventInfoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    eventInfoLabel: {
        width: 120,
        fontSize: 9,
        color: '#666',
    },
    eventInfoValue: {
        flex: 1,
        fontSize: 9,
        fontWeight: '',
        textAlign: 'right',
    },
    summaryInfo: {
        flex: 1,
        gap: 10,
    },
    summaryCard: {
        border: '1px solid #ccc',
        padding: 8,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    extraDiscount: {
        border: '1px solid #000',
        padding: 8,
        marginVertical: 10,
        flexDirection: 'row',
    },
    signatures: {
        flexDirection: 'row',
        marginTop: 20,
        borderTop: '1px solid #000',
        paddingTop: 20,
    },
    signatureBox: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    signatureLine: {
        borderBottom: '1px solid #000',
        height: 40,
        marginTop: 10,
        marginBottom: 5,
    },
    divider: {
        borderBottom: '1px solid #ccc',
        marginVertical: 15,
    },
});

interface PdfTransactionProps {
    transaction: Transaction & {
        customer?: { name: string; address?: string };
        sales?: { name: string };
        items?: any[];
    };
}
const formatAddress = (addr?: string | null) => {
    if (!addr) return '-';
    return addr.replace(/,\s*/g, ',\n');
};

export default function PdfTransaction({ transaction }: PdfTransactionProps) {
    const items = transaction?.items ?? [];
    const subtotalNet = transaction?.total_net ?? items.reduce((acc: number, it: any) => acc + (it.net_price ?? it.price_deal ?? 0), 0);
    const discountPersen = (transaction.total_pricelist - transaction.total_net_net) / transaction.total_pricelist;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {/* Customer Info */}
                    <View style={styles.customerInfo}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>{transaction?.customer?.name ?? '-'}</Text>
                        <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{formatAddress(transaction?.customer?.address)}</Text>
                    </View>

                    {/* COR Info */}
                    <View style={styles.corInfo}>
                        <Text style={styles.corTitle}>Confirmation of Rental</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Tanggal</Text>
                                    <Text style={styles.infoValue}>{formatDate(transaction?.rental_start)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>TOP</Text>
                                    <Text style={styles.infoValue}>{transaction?.termin_of_payment ?? '-'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Expedisi</Text>
                                    <Text style={styles.infoValue}>{transaction.delivery}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>No. PO</Text>
                                    <Text style={styles.infoValue}>{transaction?.no_po ?? '-'}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>No. Pesanan</Text>
                                    <Text style={styles.infoValue}>{transaction?.no_po ?? '-'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>No. COR</Text>
                                    <Text style={styles.infoValue}>{transaction?.no_penawaran ?? '-'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Penjual</Text>
                                    <Text style={styles.infoValue}>{transaction?.sales?.name ?? '-'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Pembayaran</Text>
                                    <Text style={styles.infoValue}>{transaction?.payment ?? '-'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Table Items */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.col1}>WH</Text>
                        <Text style={styles.col2}>Nama Barang</Text>
                        <Text style={styles.col3}>Hari</Text>
                        <Text style={styles.col4}>Qty</Text>
                        <Text style={styles.col5}>Price List</Text>
                        <Text style={styles.col6}>Net Price</Text>
                        <Text style={styles.col7}>Net Net</Text>
                        <Text style={styles.col8}>Diskon</Text>
                    </View>

                    {/* Body */}
                    {items.length === 0 ? (
                        <View style={styles.tableRow}>
                            <Text style={{ width: '100%', textAlign: 'center', padding: 10 }}>Tidak ada item</Text>
                        </View>
                    ) : (
                        items.map((item: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.col1}>{item?.product?.kode_gudang ?? '-'}</Text>
                                <Text style={styles.col2}>{item?.product?.name ?? '-'}</Text>
                                <Text style={styles.col3}>{transaction?.rental_duration ?? '-'}</Text>
                                <Text style={styles.col4}>{item?.qty ?? 0}</Text>
                                <Text style={styles.col5}>{formatRupiah(item?.product?.type == 'jasa' ? 0 : item?.price_pricelist, false)}</Text>
                                <Text style={styles.col6}>{formatRupiah(item?.net_price ?? item?.price_deal, false)}</Text>
                                <Text style={styles.col7}>{formatRupiah(item?.product?.type == 'jasa' ? 0 : item?.net_net, false)}</Text>
                                <Text style={styles.col8}>{formatPercent(item?.discount_percent)}</Text>
                            </View>
                        ))
                    )}

                    {/* Footer */}
                    <View style={styles.tableFooter}>
                        <Text style={[styles.col1, styles.col2, styles.col3, styles.col4, { width: '51%', textAlign: 'center' }]}>TOTAL</Text>
                        <Text style={styles.col5}>{formatRupiah(transaction?.total_pricelist, false)}</Text>
                        <Text style={styles.col6}>{formatRupiah(transaction?.total_net, false)}</Text>
                        <Text style={styles.col7}>{formatRupiah(transaction?.total_net_net, false)}</Text>
                        <Text style={styles.col8}>{formatPercent(discountPersen)}</Text>
                    </View>
                </View>

                {/* Terbilang */}
                <View style={styles.terbilang}>
                    <Text style={styles.terbilangLabel}>Terbilang:</Text>
                    <Text style={styles.terbilangText}>{terbilangID(transaction?.total_net_net)} rupiah</Text>
                </View>

                {/* Event Section and Summary */}
                <View style={styles.eventSection}>
                    {/* Event Info */}
                    <View style={styles.eventInfo}>
                        <Text style={styles.cardTitle}>Keterangan Event</Text>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Lokasi</Text>
                            <Text style={styles.eventInfoValue}>{transaction?.location ?? '-'}</Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Jenis Instalasi</Text>
                            <Text style={styles.eventInfoValue}>{transaction?.jenis_instalasi ?? '-'}</Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Tanggal Event</Text>
                            <Text style={styles.eventInfoValue}>
                                {formatOnlyDate(transaction?.rental_start)} – {formatOnlyDate(transaction?.rental_end)}
                            </Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Jam Event</Text>
                            <Text style={styles.eventInfoValue}>
                                {formatOnlyTime(transaction?.rental_start)} – {formatOnlyTime(transaction?.rental_end)}
                            </Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Tgl & Jam Instalasi</Text>
                            <Text style={styles.eventInfoValue}>{formatDate(transaction?.install_date)}</Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Tgl & Jam Dismantled</Text>
                            <Text style={styles.eventInfoValue}>{formatDate(transaction?.uninstall_date)}</Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>PIC</Text>
                            <Text style={styles.eventInfoValue}>{transaction?.pic ?? '-'}</Text>
                        </View>
                        <View style={styles.eventInfoRow}>
                            <Text style={styles.eventInfoLabel}>Deskripsi</Text>
                            <Text style={styles.eventInfoValue}>{transaction?.description ?? '-'}</Text>
                        </View>
                    </View>

                    {/* Summary */}
                    <View style={styles.summaryInfo}>
                        {/* Subtotal Card */}
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text>Sub Total (NP)</Text>
                                <Text>{formatRupiah(transaction.total_net, false)}</Text>
                            </View>
                            {transaction?.is_ppn && (
                                <View style={styles.summaryRow}>
                                    <Text>PPN 11%</Text>
                                    <Text>{formatRupiah(transaction.ppn_value, false)}</Text>
                                </View>
                            )}
                            <View style={styles.summaryRow}>
                                <Text style={{ fontWeight: 'bold' }}>Total</Text>
                                <Text style={{ fontWeight: 'bold' }}>{formatRupiah(transaction?.total_final)}</Text>
                            </View>
                        </View>

                        {/* Summary COR Card */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.cardTitle}>Summary COR</Text>
                            <View style={styles.summaryRow}>
                                <Text>Net Net</Text>
                                <Text>{formatRupiah(transaction.total_net_net, false)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text>Barang OS</Text>
                                <Text>-</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text>Netnet-OS</Text>
                                <Text>-</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Extra Discount */}
                <View style={styles.extraDiscount}>
                    <Text style={{ width: 100, fontSize: 9, fontWeight: 'bold' }}>Extra discount:</Text>
                    <Text style={{ fontSize: 9 }}>{transaction?.extra_discount ? formatRupiah(transaction.extra_discount) : '-'}</Text>
                </View>

                {/* Signatures */}
                <View style={styles.divider} />
                <View style={styles.signatures}>
                    {[
                        { title: 'Sales', name: transaction?.sales?.name ?? '' },
                        { title: 'Sales Admin', name: '' },
                        { title: 'Sales Mgr', name: '' },
                        { title: 'Finance', name: '' },
                        { title: 'Acct', name: '' },
                        { title: 'Marketing', name: '' },
                    ].map((sig, index) => (
                        <View key={index} style={styles.signatureBox}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{sig.title}</Text>
                            <View style={styles.signatureLine} />
                            {sig.name && <Text style={{ fontSize: 8 }}>{sig.name}</Text>}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
