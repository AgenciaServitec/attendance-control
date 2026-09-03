"use client";

import {useEffect, useState} from "react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {IconClock, IconUsersGroup} from "@tabler/icons-react";

export function SiteHeader() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4 transition-[width,height] ease-linear lg:px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

                <Separator
                    orientation="vertical"
                    className="h-4 bg-border"
                />

                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <IconUsersGroup className="size-4 text-primary" />
                    <span className="text-foreground font-semibold">
                        Sistemas - Turno Mañana
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                    <IconClock className="size-3.5 text-primary" />
                    <span className="font-semibold text-foreground">
                        {time || "00:00:00 AM"}
                    </span>
                </div>

                <Separator
                    orientation="vertical"
                    className="h-4 bg-border hidden sm:block"
                />

                <div className="hidden sm:flex flex-col text-right">
                    <span className="font-semibold text-foreground leading-tight">
                        Adminitrador
                    </span>
                </div>
            </div>
        </header>
    );
}