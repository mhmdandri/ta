import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    bgPattern?: string; // background belakang (png)
    redPanel?: string; // panel merah kanan (png)
    logoLeft1?: string; // logo kiri atas 1
}

export default function Login({
    status,
    canResetPassword,
    bgPattern = '/bg-page-2.png',
    redPanel = '/segitiga-2.png',
    logoLeft1 = '/logo.png',
}: LoginProps) {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-white">
            <Head title="Log in" />

            {/* BACKGROUND: gunakan PNG tanpa className */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundImage: `url('${bgPattern}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 1,
                }}
            />

            {/* RIGHT RED PANEL: gunakan PNG tanpa className */}
            <div
                className="absolute inset-y-0 right-0 hidden w-1/2 lg:block"
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '70%',
                    minWidth: 640,
                    backgroundImage: `url('${redPanel}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.25))',
                }}
            />
            <div className="pointer-events-none absolute top-4 left-4 z-30 flex items-center gap-4 md:top-8 md:left-10">
                <img src={logoLeft1} alt="Karindo" className="h-12 md:h-14" />
            </div>
            {/* Content grid */}
            <div className="relative mx-auto grid min-h-screen w-full max-w-[1280px] grid-cols-1 items-center px-6 py-10 md:px-10 lg:grid-cols-2 lg:gap-6">
                {/* Left: welcome text */}
                <div className="z-10 flex flex-col gap-10 lg:gap-16">
                    <div className="mx-auto max-w-2xl xl:mx-0 2xl:-mx-2">
                        <h1 className="text-5xl font-extrabold tracking-tight text-[#b10b0b] sm:text-6xl">Welcome</h1>
                    </div>
                </div>

                {/* Right: login card */}
                <div className="relative z-20 flex w-full items-center justify-center lg:justify-end">
                    <div className="w-full max-w-md">
                        <h2 className="mb-6 text-center text-4xl font-extrabold text-[#b9151b] lg:text-white">Login</h2>

                        <div className="rounded-2xl border border-white/20 bg-[#b9151b] p-6 backdrop-blur-[2px] sm:bg-[#b9151b] lg:bg-white/0">
                            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            {/* Email */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-white/90">
                                                    Email address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="example@karindo.com"
                                                    className="h-12 rounded-full border-2 border-white/80 bg-transparent px-5 text-white placeholder:text-white/60 focus-visible:ring-white"
                                                />
                                                <InputError className="text-slate-900" message={errors.email} />
                                            </div>

                                            {/* Password */}
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password" className="text-white/90">
                                                        Password
                                                    </Label>
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    className="h-12 rounded-full border-2 border-white/80 bg-transparent px-5 text-white placeholder:text-white/60 focus-visible:ring-white"
                                                />
                                                <InputError className="text-slate-900" message={errors.password} />
                                            </div>

                                            {/* Remember me */}
                                            <div className="flex items-center space-x-3">
                                                <Checkbox id="remember" name="remember" tabIndex={3} className="data-[state=checked]:bg-white" />
                                                <Label htmlFor="remember" className="text-white/90">
                                                    Remember me
                                                </Label>
                                            </div>

                                            {/* Submit */}
                                            <Button
                                                type="submit"
                                                className="mt-2 h-12 w-full rounded-full bg-white text-lg font-semibold text-[#9c0000] hover:bg-white/90"
                                                tabIndex={4}
                                                disabled={processing}
                                            >
                                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                Log in
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                            {status && <div className="mt-4 text-center text-sm font-medium text-emerald-200">{status}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
