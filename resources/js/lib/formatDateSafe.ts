export function formatDate(
    dateInput: Date | string | null | undefined,
    mode: 'relative' | 'absolute' | 'auto' = 'absolute',
    showTime: boolean = true,
): string {
    if (!dateInput) return '-';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return '-';

    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // detik
    const absDiff = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

    if (mode === 'absolute') {
        const datePart = formatOnlyDate(date);
        if (!showTime) return datePart;
        const timePart = formatOnlyTime(date);
        return `${datePart}, ${timePart}`;
    }

    if (mode === 'relative') {
        if (absDiff < 60) return rtf.format(Math.round(diff), 'second');
        if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute');
        if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
        if (absDiff < 604800) return rtf.format(Math.round(diff / 86400), 'day');
    }

    // mode auto (campuran)
    if (absDiff < 60) return rtf.format(Math.round(diff), 'second');
    if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (absDiff < 604800) return rtf.format(Math.round(diff / 86400), 'day');

    const datePart = formatOnlyDate(date);
    if (!showTime) return datePart;
    const timePart = formatOnlyTime(date);
    return `${datePart}, ${timePart}`;
}
export function formatDateSafe(
    dateInput: Date | string | null | undefined,
    mode: 'relative' | 'absolute' | 'auto' = 'absolute',
    showTime: boolean = true,
): string {
    if (!dateInput) return '-';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Pilih tanggal';

    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // dalam detik
    const absDiff = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

    if (mode === 'absolute') {
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            ...(showTime && {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
        });
    }

    if (mode === 'relative') {
        if (absDiff < 60) return rtf.format(Math.round(diff), 'second');
        if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute');
        if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
        if (absDiff < 604800) return rtf.format(Math.round(diff / 86400), 'day');
    }

    // mode auto (campuran)
    if (absDiff < 60) return rtf.format(Math.round(diff), 'second');
    if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (absDiff < 604800) return rtf.format(Math.round(diff / 86400), 'day');

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(showTime && {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        }),
    });
}

export function formatOnlyTime(dateInput: Date | string | null | undefined, locale: string = 'id-ID'): string {
    if (!dateInput) return '-';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', // pakai jam 24
    });
}

export function formatOnlyDate(dateInput: Date | string | null | undefined, locale: string = 'id-ID'): string {
    if (!dateInput) return '-';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
