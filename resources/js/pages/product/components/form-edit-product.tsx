import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Product } from '@/types/types';
import { useForm } from '@inertiajs/react';
import { Edit, Info, Package, Save } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface FormEditProductProps {
    product: Product;
    className?: string;
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
    isModal?: boolean;
}

interface FormData {
    name: string;
    code: string;
    description: string;
    type: string;
    stock: number;
    price_1_day: number;
    price_3_days: number;
    price_5_days: number;
    price_7_days: number;
    price_10_days: number;
    price_30_days: number;
}
const CardWrapper = ({
    children,
    isModal,
    className,
    productName,
}: {
    children: React.ReactNode;
    isModal: boolean;
    className?: string;
    productName?: string;
}) => {
    if (isModal) {
        return <div className="space-y-6">{children}</div>;
    }
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Produk: {productName}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};

export default function FormEditProduct({ product, className = '', onSuccess, onCancel, isModal = false }: FormEditProductProps) {
    const { data, setData, put, processing, errors, reset } = useForm<FormData>({
        name: '',
        code: '',
        description: '',
        type: product.type,
        stock: 0,
        price_1_day: 0,
        price_3_days: 0,
        price_5_days: 0,
        price_7_days: 0,
        price_10_days: 0,
        price_30_days: 0,
    });

    // Load product data when component mounts
    useEffect(() => {
        if (product) {
            setData({
                name: product.name || '',
                code: product.code || '',
                description: product.description || '',
                type: product.type || '',
                stock: product.stock || 0,
                price_1_day: product?.price_list?.price_1_day || 0,
                price_3_days: product.price_list?.price_3_days || 0,
                price_5_days: product.price_list?.price_5_days || 0,
                price_7_days: product.price_list?.price_7_days || 0,
                price_10_days: product.price_list?.price_10_days || 0,
                price_30_days: product.price_list?.price_30_days || 0,
            });
        }
    }, [product]);

    const productTypes = [
        { value: 'sewa', label: 'Sewa' },
        { value: 'jual', label: 'Jual' },
        { value: 'jasa', label: 'Jasa' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/product/${product.id}`, {
            onSuccess: (response: any) => {
                //toast.success('Produk berhasil diperbarui!');
                if (onSuccess && response.props?.product) {
                    onSuccess(response.props.product);
                }
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                //toast.error('Gagal memperbarui produk. Periksa kembali data yang dimasukkan.');
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
        <CardWrapper isModal={isModal} className={className} productName={product?.name}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Anda sedang mengedit produk <strong>{product?.name}</strong>
                        {product?.kode_gudang && ` di gudang ${product.kode_gudang}`}. Perubahan akan mempengaruhi stok dan harga produk ini.
                    </AlertDescription>
                </Alert>

                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Produk <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama produk"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Kode Produk <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                placeholder="Masukkan kode produk"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">
                                Tipe Produk <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)} disabled={processing}>
                                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih tipe produk..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {productTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">
                                Stok <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                className={errors.stock ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                placeholder="Masukkan deskripsi produk"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={errors.description ? 'border-red-500' : ''}
                                disabled={processing}
                                rows={3}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* Price Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informasi Harga</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="price_1_day">
                                Harga 1 Hari <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price_1_day"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_1_day}
                                onChange={(e) => setData('price_1_day', parseInt(e.target.value) || 0)}
                                className={errors.price_1_day ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_1_day && <p className="text-sm text-red-500">{errors.price_1_day}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_3_days">Harga 3 Hari</Label>
                            <Input
                                id="price_3_days"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_3_days}
                                onChange={(e) => setData('price_3_days', parseInt(e.target.value) || 0)}
                                className={errors.price_3_days ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_3_days && <p className="text-sm text-red-500">{errors.price_3_days}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_5_days">Harga 5 Hari</Label>
                            <Input
                                id="price_5_days"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_5_days}
                                onChange={(e) => setData('price_5_days', parseInt(e.target.value) || 0)}
                                className={errors.price_5_days ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_5_days && <p className="text-sm text-red-500">{errors.price_5_days}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_7_days">Harga 7 Hari</Label>
                            <Input
                                id="price_7_days"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_7_days}
                                onChange={(e) => setData('price_7_days', parseInt(e.target.value) || 0)}
                                className={errors.price_7_days ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_7_days && <p className="text-sm text-red-500">{errors.price_7_days}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_10_days">Harga 10 Hari</Label>
                            <Input
                                id="price_10_days"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_10_days}
                                onChange={(e) => setData('price_10_days', parseInt(e.target.value) || 0)}
                                className={errors.price_10_days ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_10_days && <p className="text-sm text-red-500">{errors.price_10_days}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_30_days">Harga 30 Hari</Label>
                            <Input
                                id="price_30_days"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.price_30_days}
                                onChange={(e) => setData('price_30_days', parseInt(e.target.value) || 0)}
                                className={errors.price_30_days ? 'border-red-500' : ''}
                                disabled={processing}
                            />
                            {errors.price_30_days && <p className="text-sm text-red-500">{errors.price_30_days}</p>}
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
                                Memperbarui...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Perbarui Produk
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </CardWrapper>
    );
}
