// src/lib/terbilang.ts
export function terbilangID(value: number | string, opts?: { withRupiah?: boolean; capitalize?: boolean }): string {
    const v = Number(value);
    if (!Number.isFinite(v)) return '-';

    const abs = Math.floor(Math.abs(v));
    const angka = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

    const toWords = (n: number): string => {
        if (n < 12) return angka[n];
        if (n < 20) return toWords(n - 10) + ' belas';
        if (n < 100) return toWords(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + toWords(n % 10) : '');
        if (n < 200) return 'seratus' + (n - 100 ? ' ' + toWords(n - 100) : '');
        if (n < 1000) return toWords(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + toWords(n % 100) : '');
        if (n < 2000) return 'seribu' + (n - 1000 ? ' ' + toWords(n - 1000) : '');
        if (n < 1_000_000) return toWords(Math.floor(n / 1000)) + ' ribu' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
        if (n < 1_000_000_000) return toWords(Math.floor(n / 1_000_000)) + ' juta' + (n % 1_000_000 ? ' ' + toWords(n % 1_000_000) : '');
        if (n < 1_000_000_000_000)
            return toWords(Math.floor(n / 1_000_000_000)) + ' miliar' + (n % 1_000_000_000 ? ' ' + toWords(n % 1_000_000_000) : '');
        if (n < 1_000_000_000_000_000)
            return toWords(Math.floor(n / 1_000_000_000_000)) + ' triliun' + (n % 1_000_000_000_000 ? ' ' + toWords(n % 1_000_000_000_000) : '');
        // di atas triliun (opsional)
        return String(n);
    };

    let res = abs === 0 ? 'nol' : toWords(abs);
    if (v < 0) res = 'minus ' + res;
    if (opts?.withRupiah) res += ' rupiah';
    if (opts?.capitalize) res = res.charAt(0).toUpperCase() + res.slice(1);
    return res.replace(/\s+/g, ' ').trim();
}
