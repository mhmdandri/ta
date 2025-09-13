import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Transaction {
    id: number;
    no_cor: string;
    customer_name: string;
    sales_name: string;
    status: string;
    kode_gudang: string;
    divisi: string;
    total_qty: number;
    total_pricelist: number;
    total_net: number;
    total_net_net: number;
    ppn_value: number;
    total_final: number;
    extra_discount: number;
    operate_fee: number;
    rental_start: string;
    rental_end: string;
    install_date: string;
    uninstall_date: string;
    pic: string;
    location: string | null;
    total_discount: number;
    created_at: string;
    items: any[];
}

export interface Summary {
    total_transactions: number;
    total_customers: number;
    total_value: number;
    total_qty: number;
}
