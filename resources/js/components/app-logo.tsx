export default function AppLogo() {
    return (
        <>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="flex items-center justify-center">
                <img src="/logo.png" alt="PT. KMJ Logo" className="size-10 dark:hidden" />
                <img src="/logo-dark.png" alt="PT. KMJ Logo" className="hidden size-10 dark:block" />
            </div>
            <div className="mt-3 ml-1 grid flex-1 items-center text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">PT. KMJ</span>
            </div>
        </>
    );
}
