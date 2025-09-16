import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import FormEditProduct from './components/form-edit-product';

interface Props {
    product: Product;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/product',
    },
    {
        title: 'Edit Produk',
        href: '',
    },
];

export default function ProductEdit({ product }: Props) {
    const handleSuccess = (updatedProduct: Product) => {
        router.visit('/product');
    };
    const handleCancel = () => {
        router.visit('/product');
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Produk - ${product.name}`} />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Produk</h1>
                    <p className="mt-1 text-muted-foreground">Perbarui informasi produk dan harga</p>
                </div>

                <FormEditProduct product={product} onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </AppLayout>
    );
}
