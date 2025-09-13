import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { addToast } = useToast();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex min-h-screen items-center justify-center rounded-2xl border border-red-500">
                <Button
                    onClick={() =>
                        addToast({
                            message: 'Toast manual jalan ✅',
                            type: 'success',
                            position: 'top-right',
                            duration: 4000,
                        })
                    }
                >
                    Click Me
                </Button>
            </div>
        </AppLayout>
    );
}
