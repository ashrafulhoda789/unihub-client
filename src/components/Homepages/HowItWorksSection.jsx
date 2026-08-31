'use client'

import { motion } from "framer-motion";
import { Sparkles, UserPlus, Rocket, FolderGitIcon } from "lucide-react";

export default function HowItWorksSection() {
    const steps = [
        {
            stepNum: "01",
            icon: UserPlus,
            title: "Sign Up & Select Role",
            description: "Register with your university credentials and instantly access tailored workflows for students or faculty members.",
            accentBorder: "group-hover:border-indigo-500/60",
            iconBg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
            glowColor: "group-hover:bg-indigo-600/[0.04]"
        },
        {
            stepNum: "02",
            icon: FolderGitIcon,
            title: "Pitch or Review Projects",
            description: "Students submit final-year project proposals while supervisors review, provide feedback, and track milestones seamlessly.",
            accentBorder: "group-hover:border-cyan-500/60",
            iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
            glowColor: "group-hover:bg-cyan-600/[0.04]"
        },
        {
            stepNum: "03",
            icon: Rocket,
            title: "Execute & Collaborate",
            description: "Leverage the built-in IDE sandbox, access shared curriculum resources, and drive your academic project to success.",
            accentBorder: "group-hover:border-emerald-500/60",
            iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            glowColor: "group-hover:bg-emerald-600/[0.04]"
        }
    ];

    return (
        <section className="relative py-28 bg-[#0c1220] text-slate-100 overflow-hidden border-t border-slate-900/80">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 right-1/4 w-[450px] h-[300px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
            <div className="absolute bottom-10 left-1/4 w-[400px] h-[250px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Seamless Workflow</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        How UniHub Works
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        A streamlined three-step journey designed to eliminate friction and maximize academic collaboration.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative group"
                            >
                                <div className={`h-full bg-[#162035] backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/80 ${item.accentBorder} ${item.glowColor}`}>
                                    
                                    <div>
                                        {/* Top Row: Icon & Large Step Number */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className={`p-4 rounded-2xl border ${item.iconBg} shadow-inner group-hover:scale-110 transition-transform`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <span className="text-4xl sm:text-5xl font-black text-slate-700 group-hover:text-slate-600 transition-colors select-none">
                                                {item.stepNum}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Bottom Indicator Line */}
                                    <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                                        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            Step {item.stepNum} of 03
                                        </span>
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 group-hover:scale-125 transition-all" />
                                    </div>

                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}