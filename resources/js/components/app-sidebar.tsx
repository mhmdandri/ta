import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import customers from '@/routes/customers';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, DollarSign, LayoutGrid, NotebookPen, Package, PackagePlus, Receipt, Target, User2 } from 'lucide-react';
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
            icon: Building2,
            children: [
                {
                    title: 'Daftar Pelanggan',
                    href: customers.index(),
                    icon: Building2,
                },
                ...(isAdminUp
                    ? [
                          {
                              title: 'Tambah Pelanggan',
                              href: customers.create(),
                              icon: Building2,
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
        ...(isAdminUp
            ? [
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
                          {
                              title: 'Pendapatan COR',
                              href: '/report/revenue',
                              icon: NotebookPen,
                          },
                          {
                              title: 'Komisi Sales',
                              href: '/report/commisions',
                              icon: DollarSign,
                          },
                      ],
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        ...(isAdminUp
            ? [
                  {
                      title: 'Management Users',
                      href: '/users',
                      icon: User2,
                  },
                  {
                      title: 'Pengaturan Target',
                      href: '/targets',
                      icon: Target,
                  },
              ]
            : []),
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
