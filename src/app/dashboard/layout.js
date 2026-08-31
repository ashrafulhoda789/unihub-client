import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/SIdebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="h-screen w-full overflow-hidden bg-slate-950 flex flex-col lg:flex-row">

            <Sidebar />

            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

                <DashboardNavbar />

                <main className="flex-1 overflow-y-auto p-6 sm:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}