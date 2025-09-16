import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Customer } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import FormEditCustomer from './components/form-edit-customer';
interface Props {
    customer: Customer;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelanggan',
        href: '/customers',
    },
    {
        title: 'Edit Pelanggan',
        href: '',
    },
];

export default function ProductEdit({ customer }: Props) {
    const handleSuccess = (updatedCustomer: Customer) => {
        router.visit('/customers', {
            onSuccess: () => {},
        });
    };

    const handleCancel = () => {
        router.visit('/customers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pelanggan - ${customer.name}`} />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Pelanggan</h1>
                    <p className="mt-1 text-muted-foreground">Perbarui informasi pelanggan</p>
                </div>

                <FormEditCustomer customer={customer} onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </AppLayout>
    );
}
