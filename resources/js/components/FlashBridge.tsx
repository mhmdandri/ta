import { useToast } from '@/components/ToastProvider';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

type FlashBag = { success?: string; error?: string; info?: string; warning?: string };

export default function FlashBridge() {
    const { props } = usePage<{ flash?: FlashBag }>();
    const flash = props.flash || {};
    const { addToast } = useToast();
    const lastRef = useRef<string>('');
    // stringify untuk deteksi perubahan value
    const sig = JSON.stringify(flash);
    useEffect(() => {
        if (!sig || sig === lastRef.current) return;
        lastRef.current = sig;

        const entries: Array<['success' | 'error' | 'info' | 'warning', string]> = [];
        if (flash.success) entries.push(['success', flash.success]);
        if (flash.error) entries.push(['error', flash.error]);
        if (flash.info) entries.push(['info', flash.info]);
        if (flash.warning) entries.push(['warning', flash.warning]);

        // tampilkan semua flash yang ada; pos & durasi bisa kamu atur
        for (const [type, message] of entries) {
            addToast({ type, message, position: 'top-right', duration: 3500 });
        }
    }, [sig, flash.success, flash.error, flash.info, flash.warning, addToast]);
    return null;
}
