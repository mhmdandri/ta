// components/DateRangePicker.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';

function formatRange(r?: DateRange) {
    if (!r?.from && !r?.to) return 'Select dates';
    const f = (d?: Date) => (d ? d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
    return r?.from && r?.to ? `${f(r.from)} – ${f(r.to)}` : f(r?.from);
}

export default function DateRangePicker({ value, onChange }: { value?: DateRange; onChange?: (v: DateRange | undefined) => void }) {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange | undefined>(value);

    // Sync internal state with external value
    React.useEffect(() => {
        setRange(value);
    }, [value]);

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatRange(range)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                    <Calendar
                        selected={range}
                        onSelect={(r) => {
                            setRange(r);
                            onChange?.(r);
                        }}
                        mode="range"
                        className="w-80 rounded-md border"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
