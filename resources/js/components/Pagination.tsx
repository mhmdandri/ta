import type { Link, PaginationProps } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function Pagination({ links, className = '' }: PaginationProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!links || links.length <= 1) return null;

    const handlePageChange = (url: string) => {
        setIsLoading(true);
        router.visit(url, {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    // index halaman aktif
    const activeIndex = links.findIndex((l) => l.active);

    const getVisibleLinks = () => {
        const total = links.length;
        const result: (Link | { label: string; url: null; active: false })[] = [];

        const showRange = 1; // jumlah halaman kiri-kanan dari aktif yang ditampilkan

        // tambahkan "previous" dan page pertama
        result.push(links[0]);
        if (total > 2) result.push(links[1]);

        // cek apakah perlu ellipsis sebelum range aktif
        if (activeIndex > showRange + 2) {
            result.push({ label: '...', url: null, active: false });
        }

        // range sekitar aktif
        const start = Math.max(2, activeIndex - showRange);
        const end = Math.min(total - 3, activeIndex + showRange);

        for (let i = start; i <= end; i++) {
            result.push(links[i]);
        }

        // cek apakah perlu ellipsis setelah range aktif
        if (activeIndex < total - (showRange + 3)) {
            result.push({ label: '...', url: null, active: false });
        }

        // tambahkan page terakhir + next (kalau lebih dari 1 halaman)
        if (total > 3) result.push(links[total - 2]);
        result.push(links[total - 1]);

        return result;
    };

    const visibleLinks = getVisibleLinks();

    return (
        <>
            <div className={`flex flex-wrap justify-start gap-1 ${className}`}>
                {visibleLinks.map((link, index) => (
                    <Button
                        key={index}
                        disabled={!link.url || isLoading}
                        onClick={() => link.url && handlePageChange(link.url)}
                        className={`min-w-[2.5rem] rounded border px-3 py-1 text-sm transition-all focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none ${
                            link.active
                                ? 'dark:border-primary-600 dark:bg-primary-600 border-gray-800 text-white dark:text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
                        } ${!link.url ? 'cursor-not-allowed opacity-50 dark:opacity-60' : 'hover:shadow-sm dark:hover:shadow-neutral-700/50'} ${
                            isLoading ? 'cursor-wait' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        aria-current={link.active ? 'page' : undefined}
                        aria-disabled={isLoading}
                    />
                ))}
            </div>
        </>
    );
}
