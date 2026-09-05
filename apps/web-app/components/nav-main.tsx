"use client";

import {ChevronRight} from "lucide-react";
import {type Icon, IconBell, IconClockPlay} from "@tabler/icons-react";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface NavItemType {
    title: string;
    url?: string;
    icon?: Icon;
    isActive?: boolean;
    items?: NavItemType[];
}

export function NavMain({ items }: { items: NavItemType[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-3">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            asChild
                            tooltip="Marcar Asistencia"
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                        >
                            <Link href="/attendance/new" className="flex items-center gap-2">
                                <IconClockPlay className="size-4" />
                                <span className="font-semibold">Marcar Asistencia</span>
                            </Link>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="size-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                            asChild
                        >
                            <Link href="/notifications">
                                <IconBell className="size-4" />
                                <span className="sr-only">Notificaciones</span>
                            </Link>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                    {items.map((item) => (
                        <NavItem key={item.title} item={item} />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function NavItem({ item, isSub = false }: { item: NavItemType; isSub?: boolean }) {
    const hasSubItems = Boolean(item.items && item.items.length > 0);

    if (!hasSubItems) {
        if (isSub) {
            return (
                <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                        <Link href={item.url || "#"} className="flex items-center gap-2">
                            {item.icon && <item.icon className="size-4 shrink-0" />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            );
        }

        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url || "#"}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    if (isSub) {
        return (
            <Collapsible asChild defaultOpen={item.isActive} className="group/sub-collapsible">
                <SidebarMenuSubItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton className="w-full cursor-pointer">
                            {item.icon && <item.icon className="size-4 shrink-0" />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90" />
                        </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub className="mr-0 pr-0">
                            {item.items?.map((subItem) => (
                                <NavItem key={subItem.title} item={subItem} isSub />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuSubItem>
            </Collapsible>
        );
    }

    return (
        <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <NavItem key={subItem.title} item={subItem} isSub />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}