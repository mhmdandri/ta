import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Target',
        href: '/users/targets',
    },
];

const TargetPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Target Sales" />

            <div className="space-y-6 p-4">
                <h1>Hello World</h1>
            </div>
        </AppLayout>
    );
};

export default TargetPage;
