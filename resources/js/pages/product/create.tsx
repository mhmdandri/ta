import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import FormAddProduct from './components/form-add-product';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produk',
        href: '/product',
    },
    {
        title: 'Tambah Produk',
        href: '/product/create',
    },
];

export default function ProductCreate() {
    const handleSuccess = (product: Product) => {
        // Redirect ke halaman index setelah berhasil menambah produk
        router.visit('/product', {
            onSuccess: () => {
                // Toast sudah ditampilkan di FormAddProduct
            },
        });
    };

    const handleCancel = () => {
        router.visit('/product');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah Produk</h1>
                    <p className="mt-1 text-muted-foreground">Tambahkan produk baru beserta informasi harga</p>
                </div>

                <FormAddProduct onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </AppLayout>
    );
}
