// import { Button } from '@/components/ui/button';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import type { Product } from '@/types/types';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import * as React from 'react';

// type Props = {
//     value?: Product;
//     onChange: (product: Product) => void;
// };

// export function ProductSelect({ value, onChange }: Props) {
//     const [open, setOpen] = React.useState(false);
//     const [products, setProducts] = React.useState<Product[]>([]);
//     const [query, setQuery] = React.useState('');

//     // Fetch products setiap kali query berubah
//     React.useEffect(() => {
//         const timeout = setTimeout(() => {
//             fetch(`/products/search?q=${encodeURIComponent(query)}`)
//                 .then((res) => res.json())
//                 .then((data: Product[]) => setProducts(data))
//                 .catch(() => setProducts([]));
//         }, 300); // debounce biar gak terlalu sering hit API

//         return () => clearTimeout(timeout);
//     }, [query]);

//     return (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button variant="outline" role="combobox" aria-expanded={open} className="w-[300px] justify-between">
//                     {value ? `${value.name}` : 'Pilih produk...'}
//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[300px] p-0">
//                 <Command>
//                     <CommandInput
//                         placeholder="Cari produk..."
//                         onValueChange={setQuery} // <-- update query
//                     />
//                     <CommandList>
//                         <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
//                         <CommandGroup>
//                             {products.map((p) => (
//                                 <CommandItem
//                                     key={p.id}
//                                     value={p.name}
//                                     onSelect={() => {
//                                         onChange(p);
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     <Check className={cn('mr-2 h-4 w-4', value?.id === p.id ? 'opacity-100' : 'opacity-0')} />
//                                     {p.name}
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// }

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

type Props = {
    value?: Product;
    onChange: (product: Product) => void;

    /** (opsional) pakai controlled value untuk kode gudang */
    warehouseCode?: string;
    onWarehouseCodeChange?: (kode: string) => void;

    /** (opsional) default kode gudang saat uncontrolled */
    defaultWarehouseCode?: string; // default: "01"
};

export function ProductSelect({ value, onChange, warehouseCode, onWarehouseCodeChange, defaultWarehouseCode = '01' }: Props) {
    const [open, setOpen] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [query, setQuery] = React.useState('');

    // uncontrolled fallback
    const [kodeGudangInternal, setKodeGudangInternal] = React.useState(defaultWarehouseCode);
    const kodeGudang = warehouseCode ?? kodeGudangInternal;

    const setKodeGudang = (val: string) => {
        if (onWarehouseCodeChange) onWarehouseCodeChange(val);
        else setKodeGudangInternal(val);

        // Reset selected product ketika kode gudang berubah
        if (value && value.kode_gudang !== val) {
            onChange({} as Product);
        }
    };

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const url = `/products/search?q=${encodeURIComponent(query)}&kode_gudang=${encodeURIComponent(kodeGudang || '')}`;
            console.log('Fetching URL:', url); // Debug
            fetch(url)
                .then((res) => res.json())
                .then((data: Product[]) => {
                    console.log('Response data:', data); // Debug
                    setProducts(data);

                    // Jika produk yang dipilih tidak ada di hasil filter, reset
                    if (value && value.id && data.length > 0 && !data.find((p) => p.id === value.id)) {
                        onChange({} as Product);
                    }
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                    setProducts([]);
                });
        }, 300); // debounce

        return () => clearTimeout(timeout);
    }, [query, kodeGudang]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-xs justify-between">
                    {value?.id ? `${value.name}` : 'Pilih produk...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-xs p-0">
                {/* Baris input Kode Gudang */}
                <div className="flex items-center gap-2 border-b p-2">
                    <label htmlFor="kode-gudang" className="min-w-[96px] text-sm text-muted-foreground">
                        Kode Gudang
                    </label>
                    <Input
                        id="kode-gudang"
                        value={kodeGudang}
                        onChange={(e) => setKodeGudang(e.target.value)}
                        placeholder="01"
                        className="h-8"
                        maxLength={10}
                    />
                </div>

                <Command>
                    <CommandInput placeholder="Cari produk..." onValueChange={setQuery} />
                    <CommandList>
                        <CommandEmpty>Produk tidak ditemukan untuk gudang "{kodeGudang}".</CommandEmpty>
                        <CommandGroup>
                            {products.map((p) => (
                                <CommandItem
                                    key={`${p.id}-${p.kode_gudang}`} // Unique key dengan kombinasi id dan kode_gudang
                                    value={`${p.name}-${p.kode_gudang}`} // Unique value
                                    onSelect={() => {
                                        onChange(p);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value?.id === p.id ? 'opacity-100' : 'opacity-0')} />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{p.name}</span>
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span>Code: {p.code}</span>
                                            <span>Gudang: {p.kode_gudang}</span>
                                            <span>Stock: {p.stock}</span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
