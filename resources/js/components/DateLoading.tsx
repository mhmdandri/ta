import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateSafe } from '@/lib/formatDateSafe';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
type Props = {
    value?: { loadingDate: Date | null; unloadingDate: Date | null };
    onChange: (value: { loadingDate: Date | null; unloadingDate: Date | null }) => void;
};

function getHHmm(d: Date | null) {
    if (!d) return '00:00';
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

function mergeDateAndTime(date: Date | null, hhmm: string): Date | null {
    if (!date) return null;
    const [h, m] = hhmm.split(':').map((x) => parseInt(x || '0', 10));
    const merged = new Date(date);
    merged.setHours(h || 0, m || 0, 0, 0);
    return merged;
}

export function DateLoading({ value, onChange }: Props) {
    const [openLoadingDate, setOpenLoadingDate] = useState(false);
    const [openUnloadingDate, setOpenUnloadingDate] = useState(false);

    const [loadingDate, setLoadingDate] = useState<Date | null>(value?.loadingDate ?? null);
    const [unloadingDate, setUnloadingDate] = useState<Date | null>(value?.unloadingDate ?? null);

    // state jam (HH:mm)
    const [loadingTime, setLoadingTime] = useState<string>(getHHmm(value?.loadingDate ?? null));
    const [unloadingTime, setUnloadingTime] = useState<string>(getHHmm(value?.unloadingDate ?? null));

    // sinkronkan ke parent: kirim Date yang sudah mengandung jam terpilih
    useEffect(() => {
        onChange({
            loadingDate: mergeDateAndTime(loadingDate, loadingTime),
            unloadingDate: mergeDateAndTime(unloadingDate, unloadingTime),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingDate, unloadingDate, loadingTime, unloadingTime]);

    const loadingDisplay = loadingDate ? `${loadingDate.toLocaleDateString()} ${loadingTime}` : 'Pilih tanggal & jam';

    const unloadingDisplay = unloadingDate ? `${unloadingDate.toLocaleDateString()} ${unloadingTime}` : 'Pilih tanggal & jam';

    return (
        <div className="flex flex-wrap items-end gap-4">
            {/* Loading (Install) */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="loading_date">Tanggal Installasi</Label>
                <div className="flex items-center gap-4">
                    <Popover open={openLoadingDate} onOpenChange={setOpenLoadingDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="loading_date" className="w-xs justify-between font-normal">
                                {formatDateSafe(loadingDisplay)}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="w-80 rounded-md border">
                                <Calendar
                                    mode="single"
                                    selected={loadingDate ?? undefined}
                                    className="w-80 rounded-2xl"
                                    onSelect={(date) => {
                                        setLoadingDate(date ?? null);
                                        setOpenLoadingDate(false);
                                    }}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <input
                        type="time"
                        className="h-9 w-[110px] rounded-md border border-input bg-background px-3 text-sm"
                        value={loadingTime}
                        onChange={(e) => setLoadingTime(e.target.value || '00:00')}
                    />
                </div>
            </div>

            {/* Unloading (Deinstall) */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="unloading_date">Tanggal Deinstallasi</Label>
                <div className="flex items-center gap-4">
                    <Popover open={openUnloadingDate} onOpenChange={setOpenUnloadingDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="unloading_date" className="w-xs justify-between font-normal">
                                {formatDateSafe(unloadingDisplay)}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="w-80 rounded-md border">
                                <Calendar
                                    mode="single"
                                    selected={unloadingDate ?? undefined}
                                    className="w-80 rounded-2xl"
                                    onSelect={(date) => {
                                        setUnloadingDate(date ?? null);
                                        setOpenUnloadingDate(false);
                                    }}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <input
                        type="time"
                        className="h-9 w-[110px] rounded-md border border-input bg-background px-3 text-sm"
                        value={unloadingTime}
                        onChange={(e) => setUnloadingTime(e.target.value || '00:00')}
                    />
                </div>
            </div>
        </div>
    );
}
