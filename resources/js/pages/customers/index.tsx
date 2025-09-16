import { useToast } from '@/components/ToastProvider';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Customer } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import TableCustomers from './components/table-customers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelanggan',
        href: '/product',
    },
];
export default function PelangganCreate() {
    const { addToast } = useToast();
    const handleEdit = (customer: Customer) => {
        router.visit(`/customers/${customer.id}/edit`);
    };
    // const handleDelete = (customer: Customer) => {
    //     addToast({
    //         message: `Delete product: ${customer.name}`,
    //         type: 'warning',
    //         position: 'top-right',
    //         duration: 3000,
    //     });
    // };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pelanggan" />
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Pelanggan</h1>
                    <p className="mt-1 text-muted-foreground">Daftar semua pelanggan di sistem</p>
                </div>
                <TableCustomers showActions={true} onEdit={handleEdit} />
            </div>
        </AppLayout>
    );
}
