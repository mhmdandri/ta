import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SharedData } from '@/types';
import { Customer, type Paginator } from '@/types/types';
import { router, usePage } from '@inertiajs/react';
import { Building, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DeleteCustomer from './delete-customer';

type PageProps = {
    customers: Paginator<Customer>;
    filters: {
        search: string;
    };
};

type TableCustomerProps = {
    className?: string;
    showActions?: boolean;
    onEdit?: (customer: Customer) => void;
};

export default function TableCustomers({ className = '', showActions = true, onEdit }: TableCustomerProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdminUp = auth.user?.role === 'admin' || auth.user?.role === 'manager';
    const { customers, filters } = usePage<PageProps>().props;
    const source = customers?.data ?? [];
    const [filter, setFilter] = useState(filters);
    const debounceRef = useRef<number | null>(null);
    const applyFilters = (next: typeof filter, replace = true) => {
        router.get(
            window.location.pathname, // tetap di halaman ini
            {
                search: next.search || '',
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace, // agar tidak menumpuk history saat mengetik
            },
        );
    };
    // sinkron ketika props filters dari server berubah (mis. pindah halaman)
    useEffect(() => {
        setFilter(filters);
    }, [filters.search]);
    const handleFilterChange = (key: keyof typeof filter, value: string) => {
        const next = { ...filter, [key]: value };
        setFilter(next);
        if (key === 'search') {
            // debounce 400ms
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout(() => {
                applyFilters(next, true);
            }, 400);
        } else {
            // dropdown langsung apply tanpa debounce
            applyFilters(next, false);
        }
    };
    const handleDelete = async (customer: Customer) => {
        await new Promise<void>((resolve) => {
            router.delete(`/customers/${customer.id}`, {
                preserveScroll: true,
                onFinish: () => resolve(),
            });
        });
    };
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Search className="h-5 w-5" />
                        Filter & Pencarian
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="search">Cari Pelanggan</Label>
                            <Input
                                id="search"
                                placeholder="Cari nama pelanggan..."
                                value={filter.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Table Section */}
            <Card>
                <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Daftar Pelanggan
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Menampilkan {customers?.from ?? 1} dari {customers?.to ?? source.length} dari pelanggan
                        </p>
                    </div>
                    {showActions && (
                        <Button className="gap-2" onClick={() => router.visit('/customers/create')}>
                            <Plus className="h-4 w-4" />
                            Tambah Pelanggan
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Pelanggan</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>No. Telpon</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>NPWP</TableHead>
                                    {showActions && <TableHead className="text-center">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {source.length > 0 ? (
                                    source.map((customer) => (
                                        <TableRow key={customer.id} className="group">
                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                            <TableCell className="max-w-xs truncate text-muted-foreground">{customer.address || '-'}</TableCell>
                                            <TableCell>{customer.phone || '-'}</TableCell>
                                            <TableCell className="text-left font-medium">{customer.email}</TableCell>
                                            <TableCell>{customer.npwp || '-'}</TableCell>
                                            {showActions && (
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                                        {onEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => onEdit(customer)}
                                                                className="h-8 w-8 p-0 text-[var(--gray-bg)] hover:text-[var(--gray-bg)]"
                                                                disabled={!isAdminUp}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <DeleteCustomer
                                                            trigger={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-[var(--red-bg)] hover:text-[var(--red-bg)]"
                                                                    disabled={!isAdminUp}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                            title="Hapus Produk?"
                                                            description={`Anda akan menghapus customer "${customer.name}" Tindakan ini tidak dapat dibatalkan.`}
                                                            confirmText="Ya, Hapus"
                                                            cancelText="Batal"
                                                            onConfirm={() => handleDelete(customer)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={showActions ? 8 : 7} className="h-24 text-center">
                                            {customers.total === 0 ? 'Belum ada data pelanggan' : 'Tidak ada pelanggan yang sesuai dengan filter'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <Pagination links={customers.links || []} />
        </div>
    );
}
