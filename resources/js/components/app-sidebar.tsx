import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import customers from '@/routes/customers';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, NotebookPen, Package, PackagePlus, Receipt, User2, UserPlus, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdminUp = auth.user?.role === 'admin' || auth.user?.role === 'manager';
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Pelanggan',
            href: '#',
            icon: UsersRound,
            children: [
                {
                    title: 'Daftar Pelanggan',
                    href: customers.index(),
                    icon: User2,
                },
                ...(isAdminUp
                    ? [
                          {
                              title: 'Tambah Pelanggan',
                              href: customers.create(),
                              icon: UserPlus,
                          },
                      ]
                    : []),
            ],
        },
        {
            title: 'Produk',
            href: '#',
            icon: Package,
            children: [
                {
                    title: 'Daftar Produk',
                    href: '/product',
                    icon: Package,
                },
                ...(isAdminUp
                    ? [
                          {
                              title: 'Tambah Produk',
                              href: '/product/create',
                              icon: PackagePlus,
                          },
                      ]
                    : []),
            ],
        },
        {
            title: 'Transactions',
            href: '/transactions',
            icon: Receipt,
        },
        {
            title: 'Laporan',
            href: '/report',
            icon: NotebookPen,
            children: [
                {
                    title: 'Rekap COR',
                    href: '/report/rekap/cor',
                    icon: NotebookPen,
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
