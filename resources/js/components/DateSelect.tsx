// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar'; // pastikan ada Calendar dari shadcn
// import { Label } from '@/components/ui/label';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { ChevronDownIcon } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// type DurationInfo = {
//     days: number;
//     label?: string;
// };

// type Props = {
//     value?: { startDate: Date | null; endDate: Date | null };
//     onChange: (value: { startDate: Date | null; endDate: Date | null; duration: DurationInfo }) => void;
// };

// export function DateRangeSelect({ value, onChange }: Props) {
//     const [openStartDate, setOpenStartDate] = useState(false);
//     const [openEndDate, setOpenEndDate] = useState(false);
//     const [startDate, setStartDate] = useState<Date | null>(value?.startDate ?? null);
//     const [endDate, setEndDate] = useState<Date | null>(value?.endDate ?? null);

//     const durationInfo: DurationInfo | null = useMemo(() => {
//         if (startDate && endDate) {
//             const start = new Date(startDate);
//             const end = new Date(endDate);

//             // normalisasi jam ke 00:00 biar ga kena offset
//             start.setHours(0, 0, 0, 0);
//             end.setHours(0, 0, 0, 0);

//             const diffMs = end.getTime() - start.getTime();
//             const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

//             return { days };
//         }
//         return null;
//     }, [startDate, endDate]);

//     // panggil ke parent
//     useEffect(() => {
//         onChange({
//             startDate,
//             endDate,
//             duration: durationInfo ?? { days: 0 },
//         });
//     }, [startDate, endDate, durationInfo]);

//     return (
//         <div className="flex gap-4">
//             {/* Start Date */}
//             <div className="flex flex-col gap-2">
//                 <Label htmlFor="start_date">Tanggal Mulai Event</Label>
//                 <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
//                     <PopoverTrigger asChild>
//                         <Button variant="outline" id="start_date" className="w-xs justify-between font-normal">
//                             {startDate ? startDate.toLocaleDateString() : 'Pilih tanggal'}
//                             <ChevronDownIcon />
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                             mode="single"
//                             selected={startDate ?? undefined}
//                             onSelect={(date) => {
//                                 setStartDate(date ?? null);
//                                 setOpenStartDate(false);
//                             }}
//                             className="w-80 rounded-md border"
//                         />
//                     </PopoverContent>
//                 </Popover>
//             </div>

//             {/* End Date */}
//             <div className="flex flex-col gap-2">
//                 <Label htmlFor="end_date">Tanggal Selesai Event</Label>
//                 <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
//                     <PopoverTrigger asChild>
//                         <Button variant="outline" id="end_date" className="w-xs justify-between font-normal">
//                             {endDate ? endDate.toLocaleDateString() : 'Pilih tanggal'}
//                             <ChevronDownIcon />
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                             mode="single"
//                             selected={endDate ?? undefined}
//                             onSelect={(date) => {
//                                 setEndDate(date ?? null);
//                                 setOpenEndDate(false);
//                             }}
//                             className="w-80 rounded-md border"
//                         />
//                     </PopoverContent>
//                 </Popover>
//             </div>

//             {/* Duration Info */}
//             <div className="flex flex-col gap-4">
//                 <Label>Durasi:</Label>
//                 <p className="items-center text-sm">{durationInfo ? <>{durationInfo.days} hari</> : '0 hari'}</p>
//             </div>
//         </div>
//     );
// }

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateSafe } from '@/lib/formatDateSafe';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type DurationInfo = {
    days: number;
    label?: string;
};

type Props = {
    value?: { startDate: Date | null; endDate: Date | null };
    onChange: (value: { startDate: Date | null; endDate: Date | null; duration: DurationInfo }) => void;
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

export function DateRangeSelect({ value, onChange }: Props) {
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(value?.startDate ?? null);
    const [endDate, setEndDate] = useState<Date | null>(value?.endDate ?? null);

    // state jam (HH:mm)
    const [startTime, setStartTime] = useState<string>(getHHmm(value?.startDate ?? null));
    const [endTime, setEndTime] = useState<string>(getHHmm(value?.endDate ?? null));

    // durasi tetap dihitung per-hari (normalisasi ke 00:00)
    const durationInfo: DurationInfo | null = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            const diffMs = end.getTime() - start.getTime();
            const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
            return { days };
        }
        return null;
    }, [startDate, endDate]);

    // panggil parent (kirim Date dengan jam yang dipilih)
    useEffect(() => {
        const startWithTime = mergeDateAndTime(startDate, startTime);
        const endWithTime = mergeDateAndTime(endDate, endTime);

        onChange({
            startDate: startWithTime,
            endDate: endWithTime,
            duration: durationInfo ?? { days: 0 },
        });
    }, [startDate, endDate, startTime, endTime, durationInfo, onChange]);

    const startDisplay = startDate ? `${startDate.toLocaleDateString()} ${startTime}` : 'Pilih tanggal & jam';
    const endDisplay = endDate ? `${endDate.toLocaleDateString()} ${endTime}` : 'Pilih tanggal & jam';

    return (
        <div className="flex flex-col flex-wrap items-start gap-4">
            {/* Start Date */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="start_date">Tanggal Mulai Event</Label>
                <div className="flex items-center gap-4">
                    <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="start_date" className="w-xs justify-between font-normal">
                                {formatDateSafe(startDisplay)}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="w-80 rounded-md border">
                                <Calendar
                                    mode="single"
                                    selected={startDate ?? undefined}
                                    className="w-80 rounded-md border"
                                    onSelect={(date) => {
                                        setStartDate(date ?? null);
                                        // tidak auto-close agar user bisa set jam juga via input di luar
                                        setOpenStartDate(false);
                                    }}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* Time picker */}
                    <input
                        type="time"
                        className="h-9 w-[110px] rounded-md border border-input bg-background px-3 text-sm"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value || '00:00')}
                    />
                </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="end_date">Tanggal Selesai Event</Label>
                <div className="flex items-center gap-4">
                    <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="end_date" className="w-xs justify-between font-normal">
                                {formatDateSafe(endDisplay)}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="w-80 rounded-md border">
                                <Calendar
                                    mode="single"
                                    selected={endDate ?? undefined}
                                    className="w-80 rounded-md border"
                                    onSelect={(date) => {
                                        setEndDate(date ?? null);
                                        setOpenEndDate(false);
                                    }}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* Time picker */}
                    <input
                        type="time"
                        className="h-9 w-[110px] rounded-md border border-input bg-background px-3 text-sm"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value || '00:00')}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Durasi:</Label>
                <p className="items-center text-sm">{durationInfo ? <>{durationInfo.days} hari</> : '0 hari'}</p>
            </div>
        </div>
    );
}
