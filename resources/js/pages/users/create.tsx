import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Tambah User',
        href: '/users/create',
    },
];
type UserCreateProps = {
    spv?: Array<{ id: string | number; name: string }>;
};

export default function UserCreate() {
    const { spv = [] } = usePage<UserCreateProps>().props;
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [level, setLevel] = useState('');
    const [targetSales, setTargetSales] = useState('');
    const [spvId, setSpvId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLevelChange = (value: string) => {
        setLevel(value);
        // Reset sales-specific fields if not selecting sales
        if (value !== 'sales') {
            setTargetSales('');
            setSpvId('');
        }
    };

    const handleSpvChange = (value: string) => {
        console.log('Selected supervisor ID:', value);
        setSpvId(value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        // Basic validation
        if (!name || !email || !password || !confirmPassword || !level) {
            addToast({ type: 'error', message: 'Semua field wajib diisi' });
            return;
        }

        if (password !== confirmPassword) {
            addToast({ type: 'error', message: 'Password dan konfirmasi password tidak sesuai' });
            return;
        }

        if (level === 'sales' && (!targetSales || !spvId)) {
            addToast({ type: 'error', message: 'Field target sales dan supervisor wajib diisi untuk level sales' });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData: any = {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
                role: level,
            };
            // Add sales-specific fields if level is sales
            if (level === 'sales') {
                formData.target_sales = parseFloat(targetSales);
                formData.supervisor_id = parseInt(spvId);
            }
            console.log('Submitting form data:', formData);

            router.post('/users', formData, {
                onSuccess: () => {
                    // Redirect to users list on success
                    router.visit('/users');
                },
                onError: (errors) => {
                    addToast({ type: 'error', message: `${errors.email}` });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            setIsSubmitting(false);
            addToast({ type: 'error', message: `Terjadi kesalahan saat menyimpan data ${error}` });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah User" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah User</h1>
                    <p className="mt-1 text-muted-foreground">Tambahkan akun baru beserta informasi data</p>
                </div>
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 rounded-lg border bg-white p-4">
                    <div className="w-1/2 space-y-4">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Masukkan nama"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Masukkan email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <Label htmlFor="level">Level Akun</Label>
                        <Select value={level} onValueChange={handleLevelChange} disabled={isSubmitting}>
                            <SelectTrigger id="level" className="w-full">
                                <SelectValue placeholder="Pilih level akun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {level === 'sales' && (
                        <>
                            <div className="w-1/2 space-y-4">
                                <Label htmlFor="target_sales">Target Sales</Label>
                                <Input
                                    id="target_sales"
                                    type="number"
                                    placeholder="Masukkan target sales"
                                    value={targetSales}
                                    onChange={(e) => setTargetSales(e.target.value)}
                                    min="0"
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="w-1/2 space-y-4">
                                <Label htmlFor="spv_id">Supervisor</Label>
                                <Select value={spvId} onValueChange={handleSpvChange} disabled={isSubmitting}>
                                    <SelectTrigger id="spv_id" className="w-full">
                                        <SelectValue placeholder="Pilih supervisor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spv?.length > 0 ? (
                                            spv.map((supervisor) => (
                                                <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                                                    {supervisor.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                Tidak ada supervisor tersedia
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                    <div className="flex gap-4">
                        <Button type="submit" className="max-w-28" disabled={isSubmitting}>
                            <Save />
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.visit('/users')} disabled={isSubmitting}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
