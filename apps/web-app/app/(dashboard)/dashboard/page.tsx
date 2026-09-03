import {DashboardClient} from "@/app/(dashboard)/dashboard/dashboard";

export default function DashboardPage() {
    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <DashboardClient/>
                    </div>
                </div>
            </div>
        </>
    )
}