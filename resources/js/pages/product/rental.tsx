import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TableRental from './components/table-rental';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rental Produk',
        href: '/product/rental',
    },
];

export default function RentalPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Rental Produk" />
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Rental Produk</h1>
                    <p className="mt-1 text-muted-foreground">Daftar produk yang sedang dirental & mendekati selesai</p>
                </div>

                <TableRental />
            </div>
        </AppLayout>
    );
}
