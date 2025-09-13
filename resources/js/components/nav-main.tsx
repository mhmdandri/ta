// import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';

// export function NavMain({ items = [] }: { items: NavItem[] }) {
//     const page = usePage();
//     return (
//         <SidebarGroup className="px-2 py-0">
//             <SidebarGroupLabel>Menu</SidebarGroupLabel>
//             <SidebarMenu>
//                 {items.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                         <SidebarMenuButton
//                             asChild
//                             isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
//                             tooltip={{ children: item.title }}
//                         >
//                             <Link href={item.href} prefetch>
//                                 {item.icon && <item.icon />}
//                                 <span>{item.title}</span>
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 ))}
//             </SidebarMenu>
//         </SidebarGroup>
//     );
// }

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

type Props = { items: NavItem[] };

function getHref(href?: string | { url: string }) {
    if (!href) return '#';
    return typeof href === 'string' ? href : href.url;
}

function useIsActive() {
    const page = usePage();
    return React.useCallback(
        (href?: string | { url: string }) => {
            const target = getHref(href);
            if (!target || target === '#') return false;
            return page.url === target || page.url.startsWith(target);
        },
        [page.url],
    );
}

export function NavMain({ items = [] }: Props) {
    const isActive = useIsActive();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.children && item.children.length > 0 ? (
                        <DropdownNode key={item.title} item={item} isActive={isActive} />
                    ) : (
                        <LeafNode key={item.title} item={item} isActive={isActive} />
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function LeafNode({ item, isActive }: { item: NavItem; isActive: (h?: NavItem['href']) => boolean }) {
    const href = getHref(item.href);
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }}>
                <Link href={href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function DropdownNode({ item, isActive }: { item: NavItem; isActive: (h?: NavItem['href']) => boolean }) {
    // buka otomatis jika salah satu child aktif
    const childActive = (item.children ?? []).some((c) => isActive(c.href));
    const [open, setOpen] = React.useState(childActive);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton type="button" isActive={childActive || isActive(item.href)} tooltip={{ children: item.title }}>
                        {item.icon && <item.icon />}
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-1 pl-7">
                    <div className="flex flex-col gap-1">
                        {(item.children ?? []).map((child) => {
                            const href = getHref(child.href);
                            return (
                                <SidebarMenuButton
                                    key={child.title}
                                    asChild
                                    size="sm"
                                    className="h-8 px-2"
                                    isActive={isActive(child.href)}
                                    tooltip={{ children: child.title }}
                                >
                                    <Link href={href} prefetch className="text-sm">
                                        {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                                        <span className="text-sm">{child.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            );
                        })}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
