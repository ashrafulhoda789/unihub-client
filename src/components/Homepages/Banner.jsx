"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, BookOpen, ArrowRight, Code, ShieldCheck, Users } from "lucide-react";

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-slate-900 pt-16 pb-24 lg:pt-24 lg:pb-32">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6"
                    >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        Next-Gen Academic Collaboration Platform
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
                    >
                        Bridge Theory with <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-200 bg-clip-text text-transparent">
                            Real-World Engineering
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed"
                    >
                        UniHub integrates project pitch matchmaking, faculty supervision, agile Kanban tracking, and cloud coding environments into a unified campus ecosystem.
                    </motion.p>

                    {/* Dual CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/pitches"
                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Rocket className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            Pitch a Project
                            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/resources"
                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                            Explore Resources
                        </Link>
                    </motion.div>

                    {/* Live Feature Highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 flex flex-col md:flex-row gap-4 text-left"
                    >
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Matchmaking</h4>
                                <p className="text-slate-400 text-xs">Find peers & supervisors</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <Code className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">In-Browser IDE</h4>
                                <p className="text-slate-400 text-xs">C, C++, Python & Java</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3 col-span-2 md:col-span-1">
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Agile Validation</h4>
                                <p className="text-slate-400 text-xs">Faculty review gates</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}