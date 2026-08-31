import { getAllPitches } from "@/lib/api/myPitch";
import {
    Sparkles,
    ArrowRight,
    FolderGit2,
    CheckCircle2,
    Clock,
    Users,
    Tag,
} from "lucide-react";
import Link from "next/link";

export default async function FeaturedPitchesSection() {
    let pitches = [];

    try {
        const response = await getAllPitches({ limit: 3 });

        pitches = Array.isArray(response)
            ? response
            : response?.data || response?.pitches || [];
    } catch (error) {
        console.error("Failed to fetch featured pitches:", error);
    }

    const displayPitches =
        pitches.length > 0
            ? pitches
            : [
                {
                    _id: "1",
                    title: "AI-Powered Smart Campus Navigator",
                    category: "Artificial Intelligence",
                    status: "Approved",
                    members: [{}, {}, {}, {}],
                },
                {
                    _id: "2",
                    title: "UniHub Decentralized Credential Verification",
                    category: "Blockchain",
                    status: "In Progress",
                    members: [{}, {}, {}],
                },
                {
                    _id: "3",
                    title: "Automated Thesis Allocation & Supervision System",
                    category: "Web Application",
                    status: "Completed",
                    members: [{}, {}, {}, {}, {}],
                },
            ];

    return (
        <section className="relative overflow-hidden border-t border-slate-900 bg-slate-950 py-28 text-slate-100">

            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[140px]" />
                <div className="absolute right-[10%] bottom-[15%] h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[140px]" />

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize: "45px 45px",
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">

                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Featured Innovations
                        </div>

                        <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
                            Featured{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-700 bg-clip-text text-transparent">
                                Project Pitches
                            </span>
                        </h2>

                        <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                            Discover innovative academic projects and ideas
                            created by the UniHub community.
                        </p>
                    </div>

                    <Link
                        href="/pitches"
                        className="group inline-flex items-center gap-2 self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-bold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white md:self-auto"
                    >
                        View All Pitches
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {displayPitches.map((pitch, index) => {
                        const isApproved = pitch.status === "Approved";
                        const isCompleted = pitch.status === "Completed";

                        const statusColor = isApproved
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : isCompleted
                                ? "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
                                : "text-amber-400 bg-amber-400/10 border-amber-400/20";

                        const StatusIcon =
                            isApproved || isCompleted
                                ? CheckCircle2
                                : Clock;

                        /* Member count */
                        const memberCount =
                            Array.isArray(pitch.members)
                                ? pitch.members.length
                                : Array.isArray(pitch.teamMembers)
                                    ? pitch.teamMembers.length
                                    : pitch.memberCount ||
                                    pitch.membersCount ||
                                    1;

                        return (
                            <div
                                key={pitch._id || index}
                                className="group relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0d1422] p-[1px] transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-500/10"
                            >
                                {/* Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                                {/* Card */}
                                <div className="relative flex min-h-[315px] flex-col overflow-hidden rounded-[27px] bg-[#0d1422]/95 p-7">

                                    {/* Decorative glow */}
                                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />

                                    {/* Top */}
                                    <div className="relative mb-7 flex items-center justify-between">

                                        {/* Category */}
                                        <div className="inline-flex max-w-[65%] items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
                                            <Tag className="h-3.5 w-3.5 shrink-0 text-indigo-400" />

                                            <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                {pitch.category || "General"}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusColor}`}
                                        >
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {pitch.status || "Pending"}
                                        </div>
                                    </div>

                                    {/* Project Icon */}
                                    <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10 text-indigo-400 shadow-lg shadow-indigo-500/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                        <FolderGit2 className="h-6 w-6" />
                                    </div>

                                    {/* Title */}
                                    <div className="relative">
                                        <h3 className="line-clamp-2 text-xl font-black leading-7 tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-300">
                                            {pitch.title}
                                        </h3>
                                    </div>

                                    {/* Spacer */}
                                    <div className="flex-1" />

                                    {/* Bottom */}
                                    <div className="relative mt-8 border-t border-white/[0.06] pt-5">

                                        <div className="flex items-center justify-between">

                                            {/* Members */}
                                            <div className="flex items-center gap-3">

                                                {/* User icons */}
                                                <div className="flex -space-x-2">
                                                    {Array.from({
                                                        length: Math.min(
                                                            memberCount,
                                                            5
                                                        ),
                                                    }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0d1422] bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-indigo-300"
                                                        >
                                                            <Users className="h-3.5 w-3.5" />
                                                        </div>
                                                    ))}

                                                    {memberCount > 5 && (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0d1422] bg-slate-800 text-[10px] font-bold text-slate-400">
                                                            +{memberCount - 5}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-slate-200">
                                                        {memberCount}{" "}
                                                        {memberCount === 1
                                                            ? "Member"
                                                            : "Members"}
                                                    </p>

                                                    <p className="text-[10px] text-slate-600">
                                                        Project Team
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <Link
                                                href={`/pitches/${pitch._id || "#"}`}
                                                className="group/link flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-bold text-indigo-400 transition-all duration-300 hover:border-indigo-400/20 hover:bg-indigo-500/10 hover:text-indigo-300"
                                            >
                                                Details
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Shine animation */}
                                    <div className="pointer-events-none absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/[0.04] blur-xl transition-all duration-1000 group-hover:left-[120%]" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom indicator */}
                <div className="mt-10 flex justify-center">
                    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[11px] font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                        Showing the latest featured innovations
                    </div>
                </div>
            </div>
        </section>
    );
}