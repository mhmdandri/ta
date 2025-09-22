// components/DateRangePicker.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';
import { Calendar } from './ui/calendar';

type Preset = {
    label: string;
    getRange: () => DateRange;
};

function formatRange(r?: DateRange) {
    if (!r?.from && !r?.to) return 'Select dates';
    const f = (d?: Date) => (d ? d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
    return r?.from && r?.to ? `${f(r.from)} – ${f(r.to)}` : f(r?.from);
}

function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function endOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
}

export default function DateRangePickers({
    value,
    onChange,
    minDate,
    maxDate,
    closeOnComplete = true,
    showClear = true,
    presets,
    className,
}: {
    value?: DateRange;
    onChange?: (v: DateRange | undefined) => void;
    /** tanggal minimum yang diizinkan (opsional) */
    minDate?: Date;
    /** tanggal maksimum yang diizinkan (opsional) */
    maxDate?: Date;
    /** tutup popover otomatis setelah from+to terpilih */
    closeOnComplete?: boolean;
    /** tampilkan tombol Clear */
    showClear?: boolean;
    /** daftar preset cepat (opsional) */
    presets?: Preset[];
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange | undefined>(value);

    // Sync internal state with external value
    React.useEffect(() => {
        setRange(value);
    }, [value]);

    // Default presets kalau tidak dikirim dari parent
    const effectivePresets: Preset[] = React.useMemo(() => {
        if (presets && presets.length) return presets;
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();

        return [
            {
                label: 'This month',
                getRange: () => ({
                    from: startOfDay(new Date(y, m, 1)),
                    to: endOfDay(new Date(y, m + 1, 0)),
                }),
            },
            {
                label: 'Last month',
                getRange: () => ({
                    from: startOfDay(new Date(y, m - 1, 1)),
                    to: endOfDay(new Date(y, m, 0)),
                }),
            },
            {
                label: 'YTD',
                getRange: () => ({
                    from: startOfDay(new Date(y, 0, 1)),
                    to: endOfDay(now),
                }),
            },
        ];
    }, [presets]);

    // Default month agar kalender kebuka di bulan yang relevan
    const defaultMonth = React.useMemo(() => {
        if (range?.from) return range.from;
        if (range?.to) return range.to;
        return new Date();
    }, [range]);

    // Normalize: jika user pilih to < from, react-day-picker akan swap — aman.
    const handleSelect = (r?: DateRange) => {
        setRange(r);
        onChange?.(r);
        if (closeOnComplete && r?.from && r?.to) {
            // kasih sedikit delay biar animasi klik terasa
            setTimeout(() => setOpen(false), 50);
        }
    };

    const handlePreset = (p: Preset) => {
        const r = p.getRange();
        setRange(r);
        onChange?.(r);
        if (closeOnComplete) setOpen(false);
    };

    const handleClear = () => {
        setRange(undefined);
        onChange?.(undefined);
    };

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatRange(range)}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-2" align="start">
                    {/* Presets */}
                    {effectivePresets.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2 px-1">
                            {effectivePresets.map((p) => (
                                <Button key={p.label} size="sm" variant="secondary" onClick={() => handlePreset(p)}>
                                    {p.label}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Calendar */}
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        defaultMonth={defaultMonth}
                        className="w-80 rounded-md border"
                        disabled={(date) => {
                            if (minDate && date < startOfDay(minDate)) return true;
                            if (maxDate && date > endOfDay(maxDate)) return true;
                            return false;
                        }}
                    />

                    {/* Actions */}
                    <div className="mt-2 flex items-center justify-between">
                        {showClear ? (
                            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!range?.from && !range?.to}>
                                Clear
                            </Button>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
