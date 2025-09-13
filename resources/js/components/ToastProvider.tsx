// import Toast from '@/components/Toast';
// import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// type ToastType = 'success' | 'error' | 'info' | 'warning';
// type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

// export type AddToastInput = {
//     message: string;
//     type?: ToastType;
//     duration?: number;
//     position?: ToastPosition;
// };

// type ToastItem = Required<AddToastInput> & { id: string };

// type ToastContextValue = {
//     addToast: (input: AddToastInput) => void;
// };

// const ToastContext = createContext<ToastContextValue | null>(null);

// export function useToast() {
//     const ctx = useContext(ToastContext);
//     if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
//     return ctx;
// }

// export default function ToastProvider({ children }: { children: React.ReactNode }) {
//     const [items, setItems] = useState<ToastItem[]>([]);

//     const addToast = useCallback((input: AddToastInput) => {
//         const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
//         const item: ToastItem = {
//             id,
//             message: input.message,
//             type: input.type ?? 'info',
//             duration: input.duration ?? 3000,
//             position: input.position ?? 'top-right',
//         };
//         setItems((prev) => [...prev, item]);
//     }, []);

//     const removeToast = useCallback((id: string) => {
//         setItems((prev) => prev.filter((t) => t.id !== id));
//     }, []);

//     // group by position agar stack rapi per sudut/center
//     const groups = useMemo(() => {
//         const map: Record<ToastPosition, ToastItem[]> = {
//             'top-right': [],
//             'top-left': [],
//             'bottom-right': [],
//             'bottom-left': [],
//             'top-center': [],
//             'bottom-center': [],
//         };
//         for (const t of items) map[t.position].push(t);
//         return map;
//     }, [items]);

//     const value = useMemo(() => ({ addToast }), [addToast]);

//     return (
//         <ToastContext.Provider value={value}>
//             {children}

//             {/* Render per posisi */}
//             {(Object.keys(groups) as ToastPosition[]).map((pos) => (
//                 <div
//                     key={pos}
//                     className={
//                         // fixed container dengan space yang cukup untuk multiple toast
//                         `pointer-events-none fixed z-[9998] w-96 max-w-sm ${
//                             pos.includes('top') ? 'top-6' : pos.includes('bottom') ? 'bottom-6' : ''
//                         } ${
//                             pos.includes('right')
//                                 ? 'right-6'
//                                 : pos.includes('left')
//                                   ? 'left-6'
//                                   : pos.includes('center')
//                                     ? 'left-1/2 -translate-x-1/2'
//                                     : ''
//                         }`
//                     }
//                 >
//                     <div className="flex max-h-screen flex-col gap-3 overflow-y-auto">
//                         {groups[pos].map((t, index) => (
//                             <div
//                                 key={t.id}
//                                 className="pointer-events-auto duration-300 animate-in fade-in slide-in-from-right-full"
//                                 style={{
//                                     // Tambah delay untuk animasi bertingkat
//                                     animationDelay: `${index * 100}ms`,
//                                     // Pastikan z-index menurun untuk yang lebih baru di atas
//                                     zIndex: 9999 - index,
//                                 }}
//                             >
//                                 <Toast
//                                     message={t.message}
//                                     type={t.type}
//                                     duration={t.duration}
//                                     position={t.position}
//                                     onClose={() => removeToast(t.id)}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </ToastContext.Provider>
//     );
// }

// ToastProvider.tsx
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

const defaultPosition: Position = 'bottom-right';

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
