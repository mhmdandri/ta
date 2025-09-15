import { useToast } from '@/components/ToastProvider';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import TableProduct from './components/table-product';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/product',
    },
];
export default function ProductCreate() {
    const { addToast } = useToast();

    const handleEdit = (product: Product) => {
        router.visit(`/product/${product.id}/edit`);
    };

    const handleDelete = (product: Product) => {
        addToast({
            message: `Delete product: ${product.name}`,
            type: 'warning',
            position: 'top-right',
            duration: 3000,
        });
        // Implement delete logic here
    };

    const handleView = (product: Product) => {
        addToast({
            message: `View product: ${product.name}`,
            type: 'info',
            position: 'top-right',
            duration: 3000,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Produk" />
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Produk</h1>
                    <p className="mt-1 text-muted-foreground">Daftar semua produk di sistem</p>
                </div>
                <TableProduct showActions={true} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
            </div>
        </AppLayout>
    );
}
