// components/ConfirmDeleteDialog.tsx
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

type ConfirmDeleteDialogProps = {
    /** Tombol/elemen pemicu dialog (mis. <Button>Hapus</Button>) */
    trigger: React.ReactNode;
    /** Judul dialog */
    title?: string;
    /** Deskripsi singkat (opsional) */
    description?: string;
    /** Teks tombol konfirmasi */
    confirmText?: string;
    /** Teks tombol batal */
    cancelText?: string;
    /** Dipanggil saat user menekan konfirmasi */
    onConfirm: () => Promise<void> | void;
};

export default function DeleteCustomer({
    trigger,
    title = 'Hapus Data?',
    description = 'Tindakan ini tidak dapat dibatalkan.',
    confirmText = 'Hapus',
    cancelText = 'Batal',
    onConfirm,
}: ConfirmDeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        try {
            setSubmitting(true);
            await onConfirm();
            setOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <DialogFooter className="gap-2 sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={submitting}>
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" className="text-gray-200" onClick={handleConfirm} disabled={submitting}>
                        {submitting ? 'Menghapus…' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
