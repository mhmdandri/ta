import Toast from '@/components/Toast';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
type Type = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
    id?: string;
    message: string;
    type?: Type;
    duration?: number;
    position?: Position;
};

type ToastItem = Required<ToastOptions>;

type Ctx = {
    addToast: (opts: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
};

const ToastCtx = createContext<Ctx | null>(null);
export const useToast = () => {
    const v = useContext(ToastCtx);
    if (!v) throw new Error('useToast must be used within ToastProvider');
    return v;
};

const defaultPosition: Position = 'top-right';

const positionWrapClass: Record<Position, string> = {
    'top-right': 'top-6 right-6 items-end',
    'top-left': 'top-6 left-6 items-start',
    'bottom-right': 'bottom-6 right-6 items-end',
    'bottom-left': 'bottom-6 left-6 items-start',
    'top-center': 'top-6 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clearToasts = useCallback(() => setToasts([]), []);

    const addToast = useCallback(
        (opts: ToastOptions) => {
            const id = opts.id ?? crypto.randomUUID();
            const t: ToastItem = {
                id,
                message: opts.message,
                type: opts.type ?? 'info',
                duration: opts.duration ?? 3000,
                position: opts.position ?? defaultPosition,
            };
            setToasts((prev) => [...prev, t]); // ⬅️ tambah, bukan replace
            // auto-dismiss
            window.setTimeout(() => removeToast(id), t.duration + 350); // + buffer animasi
            return id;
        },
        [removeToast],
    );

    const value = useMemo(() => ({ addToast, removeToast, clearToasts }), [addToast, removeToast, clearToasts]);

    // group by position agar tiap posisi punya stacknya sendiri
    const groups = useMemo(() => {
        const map = new Map<Position, ToastItem[]>();
        (Object.keys(positionWrapClass) as Position[]).forEach((p) => map.set(p, []));
        toasts.forEach((t) => map.get(t.position)!.push(t));
        return map;
    }, [toasts]);

    return (
        <ToastCtx.Provider value={value}>
            {children}
            {createPortal(
                <div className="pointer-events-none fixed inset-0 z-[9999]">
                    {[...groups.entries()].map(([pos, list]) => (
                        <div key={pos} className={`absolute flex max-w-sm flex-col gap-2 ${positionWrapClass[pos]}`}>
                            {list.map((t) => (
                                <Toast
                                    key={t.id}
                                    inline
                                    message={t.message}
                                    type={t.type}
                                    duration={t.duration}
                                    position={t.position}
                                    onClose={() => removeToast(t.id)}
                                    // biar bisa diklik
                                    className="pointer-events-auto"
                                />
                            ))}
                        </div>
                    ))}
                </div>,
                document.body,
            )}
        </ToastCtx.Provider>
    );
};
