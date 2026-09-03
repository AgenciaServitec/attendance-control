"use client";

import {useState} from "react";
import {AdminDashboard} from "@/app/(dashboard)/dashboard/adminDashboard";
import {EmployeeDashboard} from "@/app/(dashboard)/dashboard/employeeDashboard";

export function DashboardClient() {
    const [userRole] = useState<"admin" | "employee">("admin");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-xs text-muted-foreground">
                        {userRole === "admin"
                            ? "Resumen de asistencia general e incidencias en tiempo real."
                            : "Gestiona tus marcas de asistencia y horarios."}
                    </p>
                </div>
            </div>

            {userRole === "admin" ? <AdminDashboard /> : <EmployeeDashboard />}
        </div>
    );
}