"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
    FolderGit2,
    Kanban,
    User,
    Code2,
    GraduationCap,
    CheckSquare,
    BookOpen,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    UserCheck,
    ChevronRight,
    LayoutDashboard,
    FolderCheck
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const user = session?.user;
    const isFaculty = user?.role === "faculty" || user?.role === "FACULTY";

    // Navigation Links based on Role
    const studentNav = [
        { name: "My Pitches", href: "/dashboard/student/my-pitches", icon: FolderGit2 },
        { name: "My Pitch Request", href: "/dashboard/student/pitch-request", icon: FolderCheck },
        { name: "IDE Sandbox", href: "/sandbox", icon: Code2 },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
    ];

    const facultyNav = [
        { name: "My Pitch", href: "/dashboard/faculty/my-pitches", icon: FolderGit2 },
        { name: "Supervision Requests", href: "/dashboard/faculty/faculty-pitch-request", icon: CheckSquare },
        { name: "Curriculum & Resources", href: "/dashboard/faculty/resources", icon: BookOpen },
        { name: "Profile", href: "/dashboard/faculty/profile", icon: User },
    ];

    const navItems = isFaculty ? facultyNav : studentNav;

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/login");
                },
            },
        });
    };

    return (
        <>
            {/* Mobile Top Navbar with Hamburger Toggle */}
            <div className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
                    <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <span>Uni<span className="text-indigo-400">Hub</span></span>
                </Link>

                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700/60"
                >
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer Overlay Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container (Desktop Sticky + Mobile Drawer) */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div>
                    {/* Brand Logo Header */}
                    <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white tracking-wide">
                            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <span>Uni<span className="text-indigo-400">Hub</span></span>
                        </Link>
                    </div>

                    {/* Role Badge Indicator */}
                    <div className="px-6 py-4">
                        <div className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isFaculty ? (
                                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                ) : (
                                    <UserCheck className="w-4 h-4 text-indigo-400" />
                                )}
                                <span className="text-xs font-semibold text-slate-300 capitalize">
                                    {isFaculty ? "Faculty Portal" : "Student Portal"}
                                </span>
                            </div>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                                            ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Footer Profile & SignOut */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {user?.name ? user.name[0] : "U"}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-semibold text-white truncate">{user?.name || "User Account"}</p>
                                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            title="Sign Out"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}