import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import FormAddCustomers from './components/form-add-customers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelanggan',
        href: '/customers',
    },
    {
        title: 'Tambah Pelanggan',
        href: '/customers/create',
    },
];
export default function PelangganCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pelanggan" />
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah Pelanggan</h1>
                    <p className="mt-1 text-muted-foreground">Tambah pelanggan baru di sistem</p>
                </div>
                <FormAddCustomers />
            </div>
        </AppLayout>
    );
}
