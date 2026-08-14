"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client"; // BetterAuth hooks
import {
    Search,
    Menu,
    X,
    Code2,
    GraduationCap,
    LayoutDashboard,
    FolderGit2,
    LogOut,
    User,
    ChevronDown,
    ShieldCheck,
    UserCheck
} from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const { data: session, isPending } = useSession(); // Fetch authentication session
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const user = session?.user;

    // Dynamic Dashboard Route based on User Role
    const dashboardPath = user?.role === "faculty" ? "/dashboard/faculty" : "/dashboard/student";

    // Handle Logout
    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsProfileOpen(false);
                    setIsMobileMenuOpen(false);
                    router.push("/auth/login");
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-wide shrink-0">
                        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span>Uni<span className="text-indigo-400">Hub</span></span>
                    </Link>

                    {/* Global Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search pitches, technologies, curriculum..."
                            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
                        <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                        <Link href="/pitches" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            <FolderGit2 className="w-4 h-4" /> Pitches
                        </Link>
                        <Link href="/resources" className="hover:text-indigo-400 transition-colors">Curriculum</Link>
                        <Link href="/ide" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-cyan-400" /> IDE Sandbox
                        </Link>
                    </nav>

                    {/* Action Buttons / Auth Controls */}
                    <div className="hidden sm:flex items-center gap-3">
                        {isPending ? (
                            // Loading Skeleton
                            <div className="h-9 w-24 bg-slate-800 rounded-lg animate-pulse" />
                        ) : user ? (
                            // LOGGED IN STATE
                            <div className="flex items-center gap-3">
                                <Link
                                    href={dashboardPath}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>

                                {/* Profile Dropdown Toggle */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                                            {user.name ? user.name[0] : "U"}
                                        </div>
                                        <span className="text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Profile Menu Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                                                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>

                                                {/* Role Badge */}
                                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-400 capitalize">
                                                    {user.role === "faculty" ? <ShieldCheck className="w-3 h-3 text-cyan-400" /> : <UserCheck className="w-3 h-3 text-indigo-400" />}
                                                    {user.role || "Student"}
                                                </div>
                                            </div>

                                            <Link
                                                href={dashboardPath}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Workspace Dashboard
                                            </Link>

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // LOGGED OUT STATE
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search pitches, skills..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <Link href="/" className="block py-2 text-slate-300 hover:text-indigo-400">Home</Link>
                    <Link href="/pitches" className="block py-2 text-slate-300 hover:text-indigo-400">Open Pitches</Link>
                    <Link href="/resources" className="block py-2 text-slate-300 hover:text-indigo-400">Curriculum Library</Link>
                    <Link href="/ide" className="block py-2 text-cyan-400">IDE Sandbox</Link>

                    <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                                        {user.name ? user.name[0] : "U"}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 capitalize">{user.role || "Student"}</p>
                                    </div>
                                </div>

                                <Link
                                    href={dashboardPath}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-2.5 text-center text-red-400 bg-red-500/10 border border-red-500/20 font-medium text-sm rounded-xl flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-2 text-slate-300 border border-slate-700 rounded-xl font-medium text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}