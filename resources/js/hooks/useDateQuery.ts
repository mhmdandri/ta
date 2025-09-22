// src/hooks/useDateQuery.ts
import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

export type UseDateQueryOptions = {
    // default range dari server (YYYY-MM-DD), opsional
    serverStart?: string;
    serverEnd?: string;
    // path tujuan GET (contoh: '/report/revenue' atau '/report/commisions')
    path: string;
    // query extra (mis. { ppn, sales_id }) — akan disisipkan saat apply
    extra?: Record<string, string | number | boolean | undefined>;
    // ketika reset, mau default ke bulan berjalan? (true default)
    resetToThisMonth?: boolean;
};

const toYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export function useDateQuery(opts: UseDateQueryOptions) {
    const { serverStart, serverEnd, path, extra = {}, resetToThisMonth = true } = opts;

    // default dari server → DateRange
    const defaultRange: DateRange | undefined = useMemo(() => {
        if (serverStart && serverEnd) {
            return {
                from: new Date(serverStart + 'T00:00:00'),
                to: new Date(serverEnd + 'T00:00:00'),
            };
        }
        return undefined;
    }, [serverStart, serverEnd]);

    const [range, setRange] = useState<DateRange | undefined>(defaultRange);
    const [loading, setLoading] = useState(false);

    const canApply = !!range?.from && !!range?.to;

    const apply = useCallback(
        (extraNow?: Record<string, string | number | boolean | undefined>) => {
            if (!range?.from || !range?.to) return;
            setLoading(true);
            const qs: Record<string, any> = {
                start: toYmd(range.from),
                end: toYmd(range.to),
                ...extra,
                ...extraNow,
            };
            router.get(path, qs, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        },
        [range, extra, path],
    );

    const reset = useCallback(
        (extraNow?: Record<string, string | number | boolean | undefined>) => {
            setLoading(true);

            let startStr = serverStart;
            let endStr = serverEnd;

            if (resetToThisMonth || !serverStart || !serverEnd) {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                startStr = toYmd(startOfMonth);
                endStr = toYmd(endOfMonth);
                setRange({ from: startOfMonth, to: endOfMonth });
            } else {
                // pakai range server bila tersedia
                setRange(defaultRange);
            }

            const qs: Record<string, any> = {
                start: startStr,
                end: endStr,
                ...extra,
                ...extraNow,
            };

            router.get(path, qs, {
                preserveState: false,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        },
        [serverStart, serverEnd, resetToThisMonth, defaultRange, extra, path],
    );

    return { range, setRange, canApply, apply, reset, loading };
}
