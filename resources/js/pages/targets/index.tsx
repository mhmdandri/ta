// import { useToast } from '@/components/ToastProvider';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import AppLayout from '@/layouts/app-layout';
// import { BreadcrumbItem, SharedData } from '@/types';
// import { Head, router, usePage } from '@inertiajs/react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { id as idLocale } from 'date-fns/locale';
// import { useState } from 'react';

// interface Sales {
//     id: number;
//     name: string;
//     email: string;
//     target_sales: number;
// }

// interface SpvData {
//     id: number;
//     name: string;
//     email: string;
//     target_amount: number;
//     target_id: number | null;
//     sales: Sales[];
// }

// interface TargetData {
//     id: number | null;
//     target_amount: number;
// }
// interface ManagerLite {
//     id: number;
//     name: string;
//     email: string;
// }
// interface PageProps extends SharedData {
//     currentPeriod: string;
//     spvs?: SpvData[];
//     sales?: Sales[];
//     managerTarget?: TargetData;
//     spvTarget?: TargetData;
//     managers?: ManagerLite[];
//     selectedManagerId?: number;
// }

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Target Sales',
//         href: '/targets',
//     },
// ];

// const TargetPage = () => {
//     const { currentPeriod, spvs = [], sales = [], managerTarget, spvTarget, auth, managers, selectedManagerId } = usePage<PageProps>().props;
//     const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
//     const [loading, setLoading] = useState(false);
//     const { addToast } = useToast();

//     const isGm = auth.user.role === 'gm';
//     const [managerId, setManagerId] = useState<number | undefined>(selectedManagerId);

//     const handlePeriodChange = (newPeriod: string) => {
//         setSelectedPeriod(newPeriod);
//         router.get(
//             '/targets',
//             { period: newPeriod, ...(isGm && managerId ? { manager_id: managerId } : {}) }, // [EDIT]
//             {
//                 preserveState: false,
//                 preserveScroll: true,
//             },
//         );
//     };

//     const handleManagerChange = (newManagerId: string) => {
//         // [EDIT]
//         const idNum = Number(newManagerId); // [EDIT]
//         setManagerId(idNum); // [EDIT]
//         router.get(
//             // [EDIT]
//             '/targets', // [EDIT]
//             { period: selectedPeriod, manager_id: idNum }, // [EDIT]
//             { preserveState: false, preserveScroll: true }, // [EDIT]
//         ); // [EDIT]
//     };

//     const updateManagerTarget = async (targetAmount: number) => {
//         setLoading(true);
//         try {
//             await axios.post('/api/targets/manager', {
//                 period: selectedPeriod,
//                 target_amount: targetAmount,
//                 ...(isGm ? { manager_id: managerId } : {}),
//             });
//             addToast({ type: 'success', message: 'Target manager berhasil diperbarui' });
//             router.reload();
//         } catch (error: any) {
//             addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateSpvTarget = async (spvId: number, targetAmount: number) => {
//         setLoading(true);
//         try {
//             await axios.post('/api/targets/spv', {
//                 spv_id: spvId,
//                 period: selectedPeriod,
//                 target_amount: targetAmount,
//             });
//             addToast({ type: 'success', message: 'Target SPV berhasil diperbarui' });
//             router.reload();
//         } catch (error: any) {
//             addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateSalesTarget = async (salesId: number, targetAmount: number) => {
//         setLoading(true);
//         try {
//             await axios.post('/api/targets/sales', {
//                 sales_id: salesId,
//                 target_sales: targetAmount,
//             });
//             addToast({ type: 'success', message: 'Target sales berhasil diperbarui' });
//             router.reload();
//         } catch (error: any) {
//             addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generatePeriodOptions = () => {
//         const options = [];
//         const currentDate = new Date();

//         for (let i = -6; i <= 6; i++) {
//             const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
//             const value = format(date, 'yyyy-MM');
//             const label = format(date, 'MMMM yyyy', { locale: idLocale });
//             options.push({ value, label });
//         }

//         return options;
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Target Sales" />

//             <div className="space-y-6 p-4">
//                 <div className="flex items-center justify-between">
//                     <h1 className="text-2xl font-bold">Manajemen Target Sales</h1>

//                     <div className="flex items-center gap-2">
//                         {isGm && (
//                             <>
//                                 <Label htmlFor="manager">Manager:</Label>
//                                 <Select value={managerId ? String(managerId) : undefined} onValueChange={handleManagerChange}>
//                                     <SelectTrigger className="w-56">
//                                         <SelectValue placeholder="Pilih Manager" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {managers?.map((m) => (
//                                             <SelectItem key={m.id} value={String(m.id)}>
//                                                 {m.name} — {m.email}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </>
//                         )}
//                         <Label htmlFor="period">Periode:</Label>
//                         <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
//                             <SelectTrigger className="w-48">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {generatePeriodOptions().map((option) => (
//                                     <SelectItem key={option.value} value={option.value}>
//                                         {option.label}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* Manager View */}
//                 {auth.user.role === 'manager' && (
//                     <>
//                         {/* Manager Target Card */}
//                         <ManagerTargetCard target={managerTarget} onUpdate={updateManagerTarget} loading={loading} />

//                         {/* SPV Cards */}
//                         <div className="grid gap-6">
//                             {spvs.map((spv) => (
//                                 <SpvCard
//                                     key={spv.id}
//                                     spv={spv}
//                                     onUpdateSpvTarget={updateSpvTarget}
//                                     onUpdateSalesTarget={updateSalesTarget}
//                                     loading={loading}
//                                 />
//                             ))}
//                         </div>
//                     </>
//                 )}

//                 {/* SPV View */}
//                 {auth.user.role === 'spv' && (
//                     <>
//                         {/* SPV Target Card */}
//                         <SpvTargetCard target={spvTarget} loading={loading} />

//                         {/* Sales Cards */}
//                         <SalesListCard sales={sales} onUpdateSalesTarget={updateSalesTarget} loading={loading} />
//                     </>
//                 )}
//             </div>
//         </AppLayout>
//     );
// };

// // Manager Target Component
// const ManagerTargetCard = ({ target, onUpdate, loading }: { target?: TargetData; onUpdate: (amount: number) => void; loading: boolean }) => {
//     const [targetAmount, setTargetAmount] = useState(target?.target_amount?.toString() || '0');

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onUpdate(parseFloat(targetAmount) || 0);
//     };

//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//         }).format(amount);
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Target Manager</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form onSubmit={handleSubmit} className="flex items-end gap-4">
//                     <div className="flex-1">
//                         <Label htmlFor="manager-target">Target Bulanan</Label>
//                         <Input
//                             id="manager-target"
//                             type="number"
//                             value={targetAmount}
//                             onChange={(e) => setTargetAmount(e.target.value)}
//                             placeholder="0"
//                         />
//                         <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(parseFloat(targetAmount) || 0)}</p>
//                     </div>
//                     <Button type="submit" disabled={loading}>
//                         {loading ? 'Menyimpan...' : 'Simpan'}
//                     </Button>
//                 </form>
//             </CardContent>
//         </Card>
//     );
// };

// // SPV Target Component (Read only for SPV)
// const SpvTargetCard = ({ target, loading }: { target?: TargetData; loading: boolean }) => {
//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//         }).format(amount);
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Target SPV Anda</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="text-2xl font-bold text-green-600">{formatCurrency(target?.target_amount || 0)}</div>
//                 <p className="mt-1 text-sm text-muted-foreground">Target bulanan yang ditetapkan oleh Manager</p>
//             </CardContent>
//         </Card>
//     );
// };

// // SPV Card Component
// const SpvCard = ({
//     spv,
//     onUpdateSpvTarget,
//     onUpdateSalesTarget,
//     loading,
// }: {
//     spv: SpvData;
//     onUpdateSpvTarget: (spvId: number, amount: number) => void;
//     onUpdateSalesTarget: (salesId: number, amount: number) => void;
//     loading: boolean;
// }) => {
//     const [spvTarget, setSpvTarget] = useState(spv.target_amount?.toString() || '0');
//     const [salesTargets, setSalesTargets] = useState<Record<number, string>>(
//         spv.sales.reduce(
//             (acc, sales) => ({
//                 ...acc,
//                 [sales.id]: sales.target_sales?.toString() || '0',
//             }),
//             {},
//         ),
//     );

//     const handleSpvTargetSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onUpdateSpvTarget(spv.id, parseFloat(spvTarget) || 0);
//     };

//     const handleSalesTargetSubmit = (salesId: number, e: React.FormEvent) => {
//         e.preventDefault();
//         onUpdateSalesTarget(salesId, parseFloat(salesTargets[salesId]) || 0);
//     };

//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//         }).format(amount);
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <span>SPV: {spv.name}</span>
//                     <span className="text-sm font-normal text-muted-foreground">{spv.email}</span>
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 {/* SPV Target */}
//                 <div>
//                     <h4 className="mb-2 font-medium">Target SPV</h4>
//                     <form onSubmit={handleSpvTargetSubmit} className="flex items-end gap-4">
//                         <div className="flex-1">
//                             <Input type="number" value={spvTarget} onChange={(e) => setSpvTarget(e.target.value)} placeholder="0" />
//                             <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(parseFloat(spvTarget) || 0)}</p>
//                         </div>
//                         <Button type="submit" disabled={loading} size="sm">
//                             Update
//                         </Button>
//                     </form>
//                 </div>

//                 {/* Sales under this SPV */}
//                 <div>
//                     <h4 className="mb-4 font-medium">Sales di bawah SPV ini ({spv.sales.length})</h4>
//                     <div className="space-y-3">
//                         {spv.sales.map((sales) => (
//                             <div key={sales.id} className="rounded-lg border p-4">
//                                 <div className="mb-2 flex items-center justify-between">
//                                     <h5 className="font-medium">{sales.name}</h5>
//                                     <span className="text-sm text-muted-foreground">{sales.email}</span>
//                                 </div>
//                                 <form onSubmit={(e) => handleSalesTargetSubmit(sales.id, e)} className="flex items-end gap-4">
//                                     <div className="flex-1">
//                                         <Label htmlFor={`sales-${sales.id}`}>Target Sales</Label>
//                                         <Input
//                                             id={`sales-${sales.id}`}
//                                             type="number"
//                                             value={salesTargets[sales.id] || '0'}
//                                             onChange={(e) =>
//                                                 setSalesTargets((prev) => ({
//                                                     ...prev,
//                                                     [sales.id]: e.target.value,
//                                                 }))
//                                             }
//                                             placeholder="0"
//                                         />
//                                         <p className="mt-1 text-sm text-muted-foreground">
//                                             {formatCurrency(parseFloat(salesTargets[sales.id]) || 0)}
//                                         </p>
//                                     </div>
//                                     <Button type="submit" disabled={loading} size="sm">
//                                         Update
//                                     </Button>
//                                 </form>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// // Sales List Component
// const SalesListCard = ({
//     sales,
//     onUpdateSalesTarget,
//     loading,
// }: {
//     sales: Sales[];
//     onUpdateSalesTarget: (salesId: number, amount: number) => void;
//     loading: boolean;
// }) => {
//     const [salesTargets, setSalesTargets] = useState<Record<number, string>>(
//         sales.reduce(
//             (acc, s) => ({
//                 ...acc,
//                 [s.id]: s.target_sales?.toString() || '0',
//             }),
//             {},
//         ),
//     );

//     const handleSalesTargetSubmit = (salesId: number, e: React.FormEvent) => {
//         e.preventDefault();
//         onUpdateSalesTarget(salesId, parseFloat(salesTargets[salesId]) || 0);
//     };

//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//         }).format(amount);
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Target Sales Tim Anda ({sales.length})</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-4">
//                     {sales.map((s) => (
//                         <div key={s.id} className="rounded-lg border p-4">
//                             <div className="mb-2 flex items-center justify-between">
//                                 <h5 className="font-medium">{s.name}</h5>
//                                 <span className="text-sm text-muted-foreground">{s.email}</span>
//                             </div>
//                             <form onSubmit={(e) => handleSalesTargetSubmit(s.id, e)} className="flex items-end gap-4">
//                                 <div className="flex-1">
//                                     <Label htmlFor={`sales-target-${s.id}`}>Target Sales</Label>
//                                     <Input
//                                         id={`sales-target-${s.id}`}
//                                         type="number"
//                                         value={salesTargets[s.id] || '0'}
//                                         onChange={(e) =>
//                                             setSalesTargets((prev) => ({
//                                                 ...prev,
//                                                 [s.id]: e.target.value,
//                                             }))
//                                         }
//                                         placeholder="0"
//                                     />
//                                     <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(parseFloat(salesTargets[s.id]) || 0)}</p>
//                                 </div>
//                                 <Button type="submit" disabled={loading} size="sm">
//                                     Update
//                                 </Button>
//                             </form>
//                         </div>
//                     ))}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default TargetPage;

import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useState } from 'react';

interface Sales {
    id: number;
    name: string;
    email: string;
    target_sales: number;
}

interface SpvData {
    id: number;
    name: string;
    email: string;
    target_amount: number;
    target_id: number | null;
    sales: Sales[];
}

interface TargetData {
    id: number | null;
    target_amount: number;
}
interface ManagerLite {
    id: number;
    name: string;
    email: string;
}
interface PageProps extends SharedData {
    currentPeriod: string;
    spvs?: SpvData[];
    sales?: Sales[];
    managerTarget?: TargetData;
    spvTarget?: TargetData;
    managers?: ManagerLite[];
    selectedManagerId?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Target Sales',
        href: '/targets',
    },
];

const TargetPage = () => {
    // --------------------------------------------------------------------------------
    // [EDIT] tarik juga managers & selectedManagerId dari props
    // --------------------------------------------------------------------------------
    const {
        currentPeriod,
        spvs = [],
        sales = [],
        managerTarget,
        spvTarget,
        auth,
        managers = [], // [EDIT]
        selectedManagerId, // [EDIT]
    } = usePage<PageProps>().props;

    const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    // --------------------------------------------------------------------------------
    // [EDIT] flag role GM + state manager yang dipilih (untuk GM)
    // --------------------------------------------------------------------------------
    const isGm = auth.user.role === 'gm'; // [EDIT]
    const [managerId, setManagerId] = useState<number | undefined>( // [EDIT]
        selectedManagerId, // [EDIT]
    ); // [EDIT]

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        // --------------------------------------------------------------------------------
        // [EDIT] saat GM, ikutkan manager_id agar data sesuai manager terpilih
        // --------------------------------------------------------------------------------
        router.get(
            '/targets',
            { period: newPeriod, ...(isGm && managerId ? { manager_id: managerId } : {}) }, // [EDIT]
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    // --------------------------------------------------------------------------------
    // [EDIT] handler ganti manager (khusus GM)
    // --------------------------------------------------------------------------------
    const handleManagerChange = (newManagerId: string) => {
        // [EDIT]
        const idNum = Number(newManagerId); // [EDIT]
        setManagerId(idNum); // [EDIT]
        router.get(
            // [EDIT]
            '/targets', // [EDIT]
            { period: selectedPeriod, manager_id: idNum }, // [EDIT]
            { preserveState: false, preserveScroll: true }, // [EDIT]
        ); // [EDIT]
    }; // [EDIT]

    const updateManagerTarget = async (targetAmount: number) => {
        setLoading(true);
        try {
            // --------------------------------------------------------------------------------
            // [EDIT] saat GM, kirim manager_id ke backend
            // --------------------------------------------------------------------------------
            await axios.post('/api/targets/manager', {
                period: selectedPeriod,
                target_amount: targetAmount,
                ...(isGm ? { manager_id: managerId } : {}), // [EDIT]
            });
            addToast({ type: 'success', message: 'Target manager berhasil diperbarui' });
            router.reload();
        } catch (error: any) {
            addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
        } finally {
            setLoading(false);
        }
    };

    const updateSpvTarget = async (spvId: number, targetAmount: number) => {
        setLoading(true);
        try {
            await axios.post('/api/targets/spv', {
                spv_id: spvId,
                period: selectedPeriod,
                target_amount: targetAmount,
            });
            addToast({ type: 'success', message: 'Target SPV berhasil diperbarui' });
            router.reload();
        } catch (error: any) {
            addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
        } finally {
            setLoading(false);
        }
    };

    const updateSalesTarget = async (salesId: number, targetAmount: number) => {
        setLoading(true);
        try {
            await axios.post('/api/targets/sales', {
                sales_id: salesId,
                target_sales: targetAmount,
            });
            addToast({ type: 'success', message: 'Target sales berhasil diperbarui' });
            router.reload();
        } catch (error: any) {
            addToast({ type: 'error', message: error.response?.data?.error || 'Terjadi kesalahan' });
        } finally {
            setLoading(false);
        }
    };

    const generatePeriodOptions = () => {
        const options = [];
        const currentDate = new Date();

        for (let i = -6; i <= 6; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const value = format(date, 'yyyy-MM');
            const label = format(date, 'MMMM yyyy', { locale: idLocale });
            options.push({ value, label });
        }

        return options;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Target Sales" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Target Sales</h1>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* -------------------------------------------------------------------- */}
                        {/* [EDIT] Dropdown pilih Manager (hanya GM) */}
                        {/* -------------------------------------------------------------------- */}
                        {isGm && (
                            <>
                                <Label htmlFor="manager">Manager:</Label>
                                <Select value={managerId ? String(managerId) : undefined} onValueChange={handleManagerChange}>
                                    <SelectTrigger className="w-56">
                                        <SelectValue placeholder="Pilih Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((m) => (
                                            <SelectItem key={m.id} value={String(m.id)}>
                                                {m.name} — {m.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        )}

                        <Label htmlFor="period">Periode:</Label>
                        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {generatePeriodOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ------------------------------------------------------------------------ */}
                {/* [EDIT] GM View: wajib pilih manager dulu agar konten muncul */}
                {/* ------------------------------------------------------------------------ */}
                {isGm ? (
                    managerId ? (
                        <>
                            <ManagerTargetCard target={managerTarget} onUpdate={updateManagerTarget} loading={loading} />
                            <div className="grid gap-6">
                                {spvs.map((spv) => (
                                    <SpvCard
                                        key={spv.id}
                                        spv={spv}
                                        onUpdateSpvTarget={updateSpvTarget}
                                        onUpdateSalesTarget={updateSalesTarget}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Pilih Manager</CardTitle>
                            </CardHeader>
                            <CardContent>Silakan pilih Manager terlebih dahulu untuk melihat dan mengelola targetnya.</CardContent>
                        </Card>
                    )
                ) : null}

                {/* Manager View */}
                {!isGm && auth.user.role === 'manager' && (
                    <>
                        <ManagerTargetCard target={managerTarget} onUpdate={updateManagerTarget} loading={loading} />

                        <div className="grid gap-6">
                            {spvs.map((spv) => (
                                <SpvCard
                                    key={spv.id}
                                    spv={spv}
                                    onUpdateSpvTarget={updateSpvTarget}
                                    onUpdateSalesTarget={updateSalesTarget}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* SPV View */}
                {auth.user.role === 'spv' && (
                    <>
                        <SpvTargetCard target={spvTarget} loading={loading} />

                        <SalesListCard sales={sales} onUpdateSalesTarget={updateSalesTarget} loading={loading} />
                    </>
                )}
            </div>
        </AppLayout>
    );
};

// Manager Target Component
const ManagerTargetCard = ({ target, onUpdate, loading }: { target?: TargetData; onUpdate: (amount: number) => void; loading: boolean }) => {
    const [targetAmount, setTargetAmount] = useState(target?.target_amount?.toString() || '0');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(parseFloat(targetAmount) || 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Target Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="manager-target">Target Bulanan</Label>
                        <Input
                            id="manager-target"
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="0"
                        />
                        <p className="mt-1 mb-2 text-sm text-muted-foreground">{formatCurrency(parseFloat(targetAmount) || 0)}</p>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

// SPV Target Component (Read only for SPV)
const SpvTargetCard = ({ target, loading }: { target?: TargetData; loading: boolean }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Target SPV Anda</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(target?.target_amount || 0)}</div>
                <p className="mt-1 text-sm text-muted-foreground">Target bulanan yang ditetapkan oleh Manager</p>
            </CardContent>
        </Card>
    );
};

// SPV Card Component
const SpvCard = ({
    spv,
    onUpdateSpvTarget,
    onUpdateSalesTarget,
    loading,
}: {
    spv: SpvData;
    onUpdateSpvTarget: (spvId: number, amount: number) => void;
    onUpdateSalesTarget: (salesId: number, amount: number) => void;
    loading: boolean;
}) => {
    const [spvTarget, setSpvTarget] = useState(spv.target_amount?.toString() || '0');
    const [salesTargets, setSalesTargets] = useState<Record<number, string>>(
        spv.sales.reduce(
            (acc, sales) => ({
                ...acc,
                [sales.id]: sales.target_sales?.toString() || '0',
            }),
            {},
        ),
    );

    const handleSpvTargetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSpvTarget(spv.id, parseFloat(spvTarget) || 0);
    };

    const handleSalesTargetSubmit = (salesId: number, e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSalesTarget(salesId, parseFloat(salesTargets[salesId]) || 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>SPV: {spv.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{spv.email}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* SPV Target */}
                <div>
                    <h4 className="mb-2 font-medium">Target SPV</h4>
                    <form onSubmit={handleSpvTargetSubmit} className="flex items-end gap-4">
                        <div className="flex-1">
                            <Input type="number" value={spvTarget} onChange={(e) => setSpvTarget(e.target.value)} placeholder="0" />
                            <p className="mt-1 mb-2 text-sm text-muted-foreground">{formatCurrency(parseFloat(spvTarget) || 0)}</p>
                            <Button type="submit" disabled={loading} size="sm">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sales under this SPV */}
                <div>
                    <h4 className="mb-4 font-medium">Sales di bawah SPV ini ({spv.sales.length})</h4>
                    <div className="space-y-3">
                        {spv.sales.map((sales) => (
                            <div key={sales.id} className="rounded-lg border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h5 className="font-medium">{sales.name}</h5>
                                    <span className="text-sm text-muted-foreground">{sales.email}</span>
                                </div>
                                <form onSubmit={(e) => handleSalesTargetSubmit(sales.id, e)} className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor={`sales-${sales.id}`}>Target Sales</Label>
                                        <Input
                                            id={`sales-${sales.id}`}
                                            type="number"
                                            value={salesTargets[sales.id] || '0'}
                                            onChange={(e) =>
                                                setSalesTargets((prev) => ({
                                                    ...prev,
                                                    [sales.id]: e.target.value,
                                                }))
                                            }
                                            placeholder="0"
                                        />
                                        <p className="mt-1 mb-2 text-sm text-muted-foreground">
                                            {formatCurrency(parseFloat(salesTargets[sales.id]) || 0)}
                                        </p>
                                        <Button type="submit" disabled={loading} size="sm">
                                            Update
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Sales List Component
const SalesListCard = ({
    sales,
    onUpdateSalesTarget,
    loading,
}: {
    sales: Sales[];
    onUpdateSalesTarget: (salesId: number, amount: number) => void;
    loading: boolean;
}) => {
    const [salesTargets, setSalesTargets] = useState<Record<number, string>>(
        sales.reduce(
            (acc, s) => ({
                ...acc,
                [s.id]: s.target_sales?.toString() || '0',
            }),
            {},
        ),
    );

    const handleSalesTargetSubmit = (salesId: number, e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSalesTarget(salesId, parseFloat(salesTargets[salesId]) || 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Target Sales Tim Anda ({sales.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sales.map((s) => (
                        <div key={s.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h5 className="font-medium">{s.name}</h5>
                                <span className="text-sm text-muted-foreground">{s.email}</span>
                            </div>
                            <form onSubmit={(e) => handleSalesTargetSubmit(s.id, e)} className="flex items-end gap-4">
                                <div className="flex-1">
                                    <Label htmlFor={`sales-target-${s.id}`}>Target Sales</Label>
                                    <Input
                                        id={`sales-target-${s.id}`}
                                        type="number"
                                        value={salesTargets[s.id] || '0'}
                                        onChange={(e) =>
                                            setSalesTargets((prev) => ({
                                                ...prev,
                                                [s.id]: e.target.value,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(parseFloat(salesTargets[s.id]) || 0)}</p>
                                </div>
                                <Button type="submit" disabled={loading} size="sm">
                                    Update
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TargetPage;
