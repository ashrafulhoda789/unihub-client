"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Code2, GraduationCap, LayoutDashboard, FolderGit2 } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-wide">
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

                    {/* Action Buttons */}
                    <div className="hidden sm:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/dashboard/student"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200"
                        />
                    </div>
                    <Link href="/" className="block py-2 text-slate-300 hover:text-indigo-400">Home</Link>
                    <Link href="/pitches" className="block py-2 text-slate-300 hover:text-indigo-400">Open Pitches</Link>
                    <Link href="/resources" className="block py-2 text-slate-300 hover:text-indigo-400">Curriculum Library</Link>
                    <Link href="/ide" className="block py-2 text-cyan-400">IDE Sandbox</Link>
                    <div className="pt-2 flex flex-col gap-2">
                        <Link href="/login" className="w-full text-center py-2 text-slate-300 border border-slate-700 rounded-lg">Sign In</Link>
                        <Link href="/dashboard/student" className="w-full text-center py-2 bg-indigo-600 text-white rounded-lg">Dashboard</Link>
                    </div>
                </div>
            )}
        </header>
    );
}