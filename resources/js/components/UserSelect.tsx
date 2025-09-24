import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { User } from '@/types/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    value?: User;
    onChange: (user: User) => void;
};

export function UserSelect({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [sales, setSales] = useState<User[]>([]);
    const [query, setQuery] = useState('');

    // Fetch customers setiap kali query berubah
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch(`/users/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data: User[]) => setSales(data))
                .catch(() => setSales([]));
        }, 300); // debounce biar gak terlalu sering hit API
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-xs justify-between">
                    {value ? `${value.name}` : 'Pilih sales...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-xs p-0">
                <Command>
                    <CommandInput
                        placeholder="Cari customer..."
                        onValueChange={setQuery} // <-- update query
                    />
                    <CommandList>
                        <CommandEmpty>Sales tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {sales.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={c.name}
                                    onSelect={() => {
                                        onChange(c);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value?.id === c.id ? 'opacity-100' : 'opacity-0')} />
                                    {c.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
