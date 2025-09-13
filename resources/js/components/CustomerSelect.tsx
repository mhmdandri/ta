import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Customer } from '@/types/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

type Props = {
    value?: Customer;
    onChange: (customer: Customer) => void;
};

export function CustomerSelect({ value, onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [query, setQuery] = React.useState('');

    // Fetch customers setiap kali query berubah
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetch(`/customers/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data: Customer[]) => setCustomers(data))
                .catch(() => setCustomers([]));
        }, 300); // debounce biar gak terlalu sering hit API
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-xs justify-between">
                    {value ? `${value.name}` : 'Pilih customer...'}
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
                        <CommandEmpty>Customer tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {customers.map((c) => (
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
