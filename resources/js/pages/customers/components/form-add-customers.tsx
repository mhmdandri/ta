import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Product, Customer } from '@/types/types';
import { useForm } from '@inertiajs/react';
import { Package, Plus, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
interface CustomerProps {
    className?: string;
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
    isModal?: boolean;
}
const CardWrapper = ({ children, isModal, className }: { children: React.ReactNode; isModal: boolean; className?: string }) => {
    if (isModal) {
        return <div className="space-y-6">{children}</div>;
    }
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Tambah Pelanggan Baru
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};

export default function FormAddCustomers({ className = '', onSuccess, onCancel, isModal = false }: CustomerProps) {
    const { addToast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm<Customer>({
        id: 0,
        code: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        npwp: '',
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/customers', {
            onSuccess: (response: any) => {
                reset();
                if (onSuccess && response.props?.product) {
                    onSuccess(response.props.product);
                }
            },
            onError: (errors) => {
                addToast({
                    message: 'Terjadi kesalahan. Silakan periksa kembali form.',
                    type: 'error',
                    position: 'top-right',
                    duration: 5000,
                });
            },
        });
    };
    const handleCancel = () => {
        reset();
        if (onCancel) {
            onCancel();
        }
    };
    return (
        <CardWrapper isModal={isModal} className={className}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Pelanggan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama pelanggan"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Kode Pelanggan <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                placeholder="Masukkan kode pelanggan"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Nomor Telepon <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Masukkan nomor telepon"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={errors.phone ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukkan email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="npwp">NPWP</Label>
                            <Input
                                id="npwp"
                                placeholder="Masukkan NPWP"
                                value={data.npwp}
                                onChange={(e) => setData('npwp', e.target.value)}
                                className={errors.npwp ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.npwp && <p className="text-sm text-red-500">{errors.npwp}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea
                                id="address"
                                placeholder="Masukkan alamat lengkap"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className={errors.address ? 'border-red-500' : ''}
                                disabled={processing}
                                rows={3}
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 border-t pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                            Batal
                        </Button>
                    )}
                    <Button type="submit" disabled={processing} className="gap-2">
                        {processing ? (
                            <>
                                <Package className="h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Simpan Pelanggan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </CardWrapper>
    );
}
