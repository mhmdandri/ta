// components/TopNav.tsx
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils'; // opsional: helper classnames; hapus jika tidak ada
import { Link, usePage } from '@inertiajs/react';

type SubLink = { href: string; title: string; description?: string };
type MenuGroup = { label?: string; items: SubLink[] };

export default function TopNav() {
    const { url } = usePage(); // contoh: "/reports/rekap/cor"
    const isActive = (href: string) => url.startsWith(href);

    const rekapGroups: MenuGroup[] = [
        {
            items: [
                // { href: '/report/rekap', title: 'Rekap Umum', description: 'Semua transaksi ringkas' },
                { href: '/report/rekap/cor', title: 'Rekap COR' },
                { href: '/report/rekap/cos', title: 'Rekap COS' },
            ],
        },
        // {
        //     label: 'Detail',
        //     items: [
        //         { href: '/reports/rekap/barang', title: 'Per Barang', description: 'Penjualan & sewa per item' },
        //         { href: '/reports/rekap/customer', title: 'Per Customer', description: 'Performa pelanggan' },
        //     ],
        // },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* Menu dengan sublink */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className={cn(
                            navigationMenuTriggerStyle(),
                            // beri indikasi active kalau salah satu sublink aktif
                            rekapGroups.flatMap((g) => g.items).some((i) => isActive(i.href)) && 'text-primary',
                        )}
                    >
                        Rekap
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <div className="w-26">
                            {rekapGroups.map((group, gi) => (
                                <div key={gi} className="space-y-2">
                                    {group.label && <div className="px-2 text-xs font-semibold text-muted-foreground">{group.label}</div>}

                                    <ul className="grid gap-2">
                                        {group.items.map((item) => (
                                            <li key={item.href}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            'block rounded-md p-3 no-underline transition outline-none',
                                                            'hover:bg-muted focus:bg-muted',
                                                            isActive(item.href) ? 'ring-1 ring-primary' : 'ring-1 ring-transparent',
                                                        )}
                                                    >
                                                        <div className="text-sm leading-none font-medium">{item.title}</div>
                                                        {item.description && (
                                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                                                        )}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Contoh menu tanpa sublink (langsung Link) */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/transactions" className={cn(isActive('/transactions') && 'text-primary')}>
                            Transaksi
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
