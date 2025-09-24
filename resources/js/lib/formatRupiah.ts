/**
 * Format angka ke Rupiah (IDR).
 *
 * @param value Angka atau string numerik
 * @param withPrefix Tambahkan "Rp " di depan
 */
export function formatRupiah(value?: number | string | null, withPrefix = true): string {
    if (value == null || value === '') return '0';

    let num = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(num)) return '0';

    // bulatkan ke integer (hilangkan koma)
    num = Math.round(num);

    if (num === 0) {
        // tetap tampil "0", tapi hilangkan prefix Rp
        return '0';
    }

    return (withPrefix ? 'Rp ' : '') + num.toLocaleString('id-ID');
}

/**
 * Format angka ke persen, dibulatkan integer.
 *
 * @param value Angka pecahan (0–1), persen langsung, atau null
 */
export function formatPercent(value?: number | string | null): string {
    if (value == null || value === '') return '0%';

    let num = typeof value === 'string' ? Number(value) : value;

    // tangani NaN atau Infinity
    if (!Number.isFinite(num)) return '0%';

    // Kalau nilainya pecahan 0–1 atau -1 <= num < 0, anggap decimal → dikali 100
    if (num > -1 && num < 1) {
        num = num * 100;
    }

    num = Math.round(num);

    return `${num}%`;
}
export function formatKomisi(value?: number | string | null): string {
    if (value == null || value === '') return '0%';

    let num = typeof value === 'string' ? Number(value) : value;

    // tangani NaN atau Infinity
    if (!Number.isFinite(num)) return '0%';

    const rounded = parseFloat(num.toFixed(1));

    return `${rounded}%`;
}
