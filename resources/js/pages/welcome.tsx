// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';

// type Props = {
//     stageImage?: string; // gambar perangkat di panggung (png transparan)
//     bgPattern?: string; // opsional: kalau punya pattern khusus
//     logoLeft1?: string; // logo kiri atas 1
//     logoLeft2?: string; // logo kiri atas 2 (LED)
//     logoRight?: string; // logo kanan atas
// };

// export default function Welcome({
//     stageImage = '/produk.png',
//     bgPattern = '/bg-page-2.png',
//     logoLeft1 = '/logo-1.png',
//     logoLeft2 = '/logo-2.png',
//     logoRight = '/logo.png',
// }: Props) {
//     const { auth } = usePage<SharedData>().props;

//     return (
//         <>
//             <Head title="Welcome">
//                 <link rel="preconnstageImageect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
//             </Head>

//             <div
//                 className="relative min-h-[100svh] overflow-hidden bg-white text-slate-900"
//                 /* fallback pattern kalau tidak pakai file png: bikin chevron diagonal lembut */
//                 style={
//                     bgPattern
//                         ? { backgroundImage: `url('${bgPattern}')`, backgroundSize: 'cover' }
//                         : {
//                               backgroundImage:
//                                   'repeating-linear-gradient( 60deg, rgba(0,0,0,0.035) 0, rgba(0,0,0,0.035) 2px, transparent 2px, transparent 80px )',
//                           }
//                 }
//             >
//                 {/* LOGO KIRI ATAS (dua logo) */}
//                 <div className="pointer-events-none absolute top-4 left-4 z-30 flex items-center gap-4 md:top-8 md:left-10">
//                     <img src={logoLeft1} alt="Karindo" className="h-7 md:h-9" />
//                     <img src={logoLeft2} alt="Karindo LED" className="h-7 md:h-9" />
//                 </div>

//                 {/* LOGO KANAN ATAS */}
//                 <div className="pointer-events-none absolute top-4 right-4 z-30 md:top-3 md:right-10">
//                     <img src={logoRight} alt="Brand" className="h-13 md:h-15" />
//                 </div>

//                 <div className="relative z-20 px-4 text-center md:mt-20">
//                     <h1 className="mb-4 text-3xl font-bold drop-shadow-lg md:text-5xl">PT Karindo Mitra Jakarta</h1>
//                     <p className="mx-auto mb-6 max-w-xl text-sm text-gray-300 drop-shadow md:text-xl">
//                         Smart System Solution - All in One Rental Solution
//                     </p>
//                     {auth.user ? (
//                         <Link
//                             href="/dashboard"
//                             className="inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/60 md:px-8 md:py-3.5 md:text-base"
//                         >
//                             Dashboard
//                         </Link>
//                     ) : (
//                         <Link
//                             href="/login"
//                             className="inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/60 md:px-8 md:py-3.5 md:text-base"
//                         >
//                             Get Started
//                         </Link>
//                     )}
//                 </div>

//                 {/* KARPET MERAH (polygon) */}
//                 <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[46vh] md:h-[42vh]">
//                     <img src="/segitiga.png" alt="Karpet Merah" className="h-full w-full object-cover object-bottom" />
//                 </div>

//                 {/* DEVICE CLUSTER (gambar utama) */}
//                 <div className="absolute inset-x-0 bottom-[8vh] z-30 flex justify-center md:bottom-[-10vh]">
//                     <img src={stageImage} alt="Devices" className="w-[88%] max-w-[880px] drop-shadow-2xl" loading="eager" />
//                 </div>
//             </div>
//         </>
//     );
// }

import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type Props = {
    stageImage?: string;
    bgPattern?: string;
    logoLeft1?: string;
    logoLeft2?: string;
    logoRight?: string;
};

export default function Welcome({
    stageImage = '/produk.png',
    bgPattern = '/bg-page-2.png',
    logoLeft1 = '/logo-1.png',
    logoLeft2 = '/logo-2.png',
    logoRight = '/logo.png',
}: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                {/* FIX: preconnect typo */}
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div
                className="relative min-h-[100svh] overflow-hidden bg-white text-slate-900"
                style={
                    bgPattern
                        ? { backgroundImage: `url('${bgPattern}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : {
                              backgroundImage:
                                  'repeating-linear-gradient(60deg, rgba(0,0,0,0.035) 0, rgba(0,0,0,0.035) 2px, transparent 2px, transparent 80px)',
                          }
                }
            >
                {/* TOP BAR: Logos — mobile disusun rapi, tidak tumpang tindih */}
                <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex items-center justify-between px-4 sm:top-4 sm:px-6 md:top-6 md:px-10">
                    {/* KIRI: dua logo */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <img src={logoLeft1} alt="Karindo" className="h-6 w-auto object-contain sm:h-7 md:h-9" />
                        <img src={logoLeft2} alt="Karindo LED" className="h-6 w-auto object-contain sm:h-7 md:h-9" />
                    </div>

                    {/* KANAN: logo besar disembunyikan di layar kecil untuk cegah overlap */}
                    <div className="">
                        <img src={logoRight} alt="Brand" className="h-8 w-auto object-contain sm:h-10 md:h-12" />
                    </div>
                </div>

                {/* Overlay halus untuk kontras teks ketika pakai gambar bg yang terang */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/0"></div>

                {/* HERO TEXT */}
                <div className="relative z-20 mx-auto max-w-4xl px-4 pt-60 text-center sm:pt-28 md:pt-10">
                    <h1 className="mb-3 text-2xl font-bold drop-shadow sm:text-3xl md:mb-4 md:pt-10 md:text-5xl">PT Karindo Mitra Jakarta</h1>
                    <p className="mx-auto mb-6 max-w-xl text-[13px] text-slate-700 sm:text-sm md:text-lg">
                        Smart System Solution — All in One Rental Solution
                    </p>

                    {auth.user ? (
                        <Link
                            href="/dashboard"
                            className="inline-block rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/60 sm:px-6 sm:py-3 md:px-8 md:py-3.5 md:text-base"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-block rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/60 sm:px-6 sm:py-3 md:px-8 md:py-3.5 md:text-base"
                        >
                            Get Started
                        </Link>
                    )}
                </div>

                {/* KARPET MERAH */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38vh] sm:h-[42vh] md:h-[44vh] lg:h-[46vh]">
                    <img src="/segitiga.png" alt="Karpet Merah" className="h-full w-full object-cover object-bottom" loading="lazy" />
                </div>

                {/* DEVICE CLUSTER */}
                <div className="absolute inset-x-0 bottom-[5vh] z-30 flex justify-center sm:bottom-[0vh] md:bottom-[0vh] lg:bottom-[-10vh]">
                    <img
                        src={stageImage}
                        alt="Devices"
                        className="w-[92%] max-w-[520px] drop-shadow-2xl sm:max-w-[680px] md:max-w-[880px]"
                        loading="eager"
                    />
                </div>
            </div>
        </>
    );
}
