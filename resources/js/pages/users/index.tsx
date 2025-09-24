import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TableUser from './components/TableUser';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface PageProps extends SharedData {
    users?: User[];
    filter: string;
}

const UserPage = () => {
    const { users = [], filter } = usePage<PageProps>().props;

    const [filters, setFilters] = useState(filter || '');
    const debounceRef = useRef<number | null>(null);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(value);
        console.log('Filter changed:', { [key]: value });

        // Clear previous debounce timer
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Set new debounce timer
        debounceRef.current = window.setTimeout(() => {
            applyFilters(value);
        }, 500); // 500ms delay
    };

    const applyFilters = (searchValue: string) => {
        router.get(
            '/users',
            { filter: searchValue || '' },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true, // Replace current history entry
                only: ['users'], // Only reload users data
            },
        );
    };

    // Cleanup debounce on component unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    // Sync local state with props when they change
    useEffect(() => {
        setFilters(filter || '');
    }, [filter]);

    const handleDeleteUser = (user: User) => {
        router.delete(`/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('User deleted successfully');
            },
            onError: (error) => {
                console.error('Error deleting user:', error);
            },
        });
    };
    const handleEditUser = (updated: User) => {
        // diasumsikan updated.role sudah berisi role baru dari dialog
        router.put(`/users/${updated.id}`, updated as any, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('User updated successfully');
            },
            onError: (error) => {
                console.error('Error updating user:', error);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar User" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Manage your team members and their permissions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/users/create">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Link>
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="search">Pencarian</Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Cari nama user atau email..."
                                        value={filters}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <TableUser users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                </Card>
            </div>
        </AppLayout>
    );
};

export default UserPage;
