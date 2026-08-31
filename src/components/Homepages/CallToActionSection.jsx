import Link from "next/link";
import { Sparkles, ArrowRight, Rocket, ShieldCheck } from "lucide-react";

export default function CallToActionSection() {
    return (
        <section className="relative py-24 bg-[#090d16] text-slate-100 overflow-hidden border-t border-slate-900">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[160px] pointer-events-none rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative bg-gradient-to-br from-[#121a2c] via-[#0e1422] to-[#162035] border border-slate-800/80 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Decorative Background Pattern or Ring */}
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Left Content */}
                    <div className="max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Start Your Journey</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                            Ready to transform your academic project journey?
                        </h2>

                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                            Join UniHub today to pitch innovative ideas, collaborate seamlessly with peers, and access verified curriculum resources all in one place.
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Verified Academic Access
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Rocket className="w-4 h-4 text-indigo-400" />
                                Instant Proposal Workflow
                            </span>
                        </div>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto relative z-10 shrink-0">
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 group"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/sandbox"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <span>Explore Sandbox</span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}