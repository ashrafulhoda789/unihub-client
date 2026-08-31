'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import {
    FolderGit2,
    Code2,
    BookOpen,
    CheckSquare,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function CoreFeaturesSection() {
    const { data: session, status } = useSession();

    const userRole = session?.user?.role || "student";
    const isFaculty = userRole === "faculty";

    const features = [
        {
            icon: FolderGit2,
            title: "Project Pitching & Collaboration",
            description: "Submit your final-year project proposals, track milestones, and connect directly with faculty supervisors.",
            topBadge: "WORKFLOW ENGINE",
            pills: ["Pitch Submission", "Supervisor Match", "Milestone Tracking"],
            link: "/pitches",
            accentColor: "from-indigo-600/30 to-indigo-900/10 border-indigo-500/30 text-indigo-400"
        },
        {
            icon: Code2,
            title: "Interactive Code Sandbox",
            description: "Run code inside isolated browser web workers, test algorithms live, and debug syntax in real time.",
            topBadge: "PLAYGROUND IDE",
            pills: ["Isolated Web Worker", "Live Console", "Multi-Language"],
            link: "/sandbox",
            accentColor: "from-cyan-600/30 to-cyan-900/10 border-cyan-500/30 text-cyan-400"
        },
        {
            icon: BookOpen,
            title: "Curriculum & Shared Resources",
            description: "Access curated semester syllabi, lecture notes, technical documentation, and essential materials easily.",
            topBadge: "KNOWLEDGE BASE",
            pills: ["Semester Syllabus", "Faculty Notes", "Cloud Docs"],
            link: "/resources",
            accentColor: "from-emerald-600/30 to-emerald-900/10 border-emerald-500/30 text-emerald-400"
        },
        {
            icon: CheckSquare,
            title: isFaculty ? "Supervision & Proposal Review" : "Supervision & Milestone Tracking",
            description: isFaculty
                ? "Streamlined dashboard for faculty members to review, approve, and track student project requests efficiently."
                : "Track your assigned supervisor feedback, review project evaluations, and monitor approval progress.",
            topBadge: isFaculty ? "FACULTY PORTAL" : "STUDENT TRACKER",
            pills: isFaculty
                ? ["Proposal Approval", "Request Queue", "Direct Feedback"]
                : ["Supervisor Status", "Evaluation Feedback", "Milestone Progress"],
            link: isFaculty ? "/dashboard/faculty/faculty-pitch-request" : "/dashboard/student/my-pitches",
            accentColor: "from-rose-600/30 to-rose-900/10 border-rose-500/30 text-rose-400"
        }
    ];

    return (
        <section className="relative py-28 bg-slate-950 text-slate-100 overflow-hidden border-t border-slate-900">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Platform Modules</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Engineered for Modern Academics
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Explore the core pillars designed to streamline collaboration between students, faculty, and administrators.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="group relative bg-[#101728]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-950/40">

                                    {/* Card Inner Content Area */}
                                    <div className="p-8 sm:p-10">

                                        {/* Top Row: Main Icon & Top-Right Badge */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 shadow-inner group-hover:scale-105 transition-transform">
                                                <IconComponent className="w-6 h-6" />
                                            </div>

                                            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                                                {feature.topBadge}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                                            {feature.title}
                                        </h3>

                                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                                            {feature.description}
                                        </p>

                                        {/* Feature Pills / Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {feature.pills.map((pill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-medium text-slate-300"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Action Footer Bar */}
                                    <Link
                                        href={feature.link}
                                        className={`relative px-8 py-5 bg-gradient-to-r ${feature.accentColor} border-t flex items-center justify-between group-hover:bg-slate-900/40 transition-colors`}
                                    >
                                        <span className="font-semibold text-sm text-white tracking-wide">
                                            Explore module
                                        </span>

                                        <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </Link>

                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}