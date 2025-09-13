import SubNav from '@/components/SubNav';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: 'report',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <div className="m-2 flex min-h-screen flex-1 flex-col gap-4 overflow-x-auto rounded-xl border-2 p-4">
                <div>
                    <SubNav></SubNav>
                </div>
            </div>
        </AppLayout>
    );
}
