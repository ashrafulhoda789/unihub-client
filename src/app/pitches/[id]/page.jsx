import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, Clock, Code, Lock } from 'lucide-react';
import { getPitchById } from '@/lib/api/myPitch';
import JoinRequestForm from '@/components/modals/pitchModal/JoinRequestForm';

const PitchDetailPage = async ({ params }) => {
    const { id } = await params;

    let pitch = null;
    try {
        const res = await getPitchById(id);
        pitch = res?._id ? res : res?.data;
    } catch (err) {
        console.error("Error fetching pitch detail on server:", err);
    }

    if (!pitch) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-2">Pitch Not Found</h2>
                <Link href="/pitches" className="text-indigo-400 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Pitches
                </Link>
            </div>
        );
    }

    // Lock check condition
    const isLocked = pitch.isFinalized === true;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/pitches" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to all pitches
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    {pitch.category}
                                </span>
                                {isLocked ? (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> LOCKED 
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {pitch.status}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{pitch.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-slate-500" /> Posted: {new Date(pitch.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-slate-500" /> Expires: {new Date(pitch.expiresAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-white mb-3">Project Description</h3>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{pitch.description}</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Code className="w-5 h-5 text-indigo-400" /> Required Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {pitch.requiredSkills?.map((skill, idx) => (
                                    <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Interactive Client Form with Lock state */}
                        <JoinRequestForm pitchId={id} isFinalized={isLocked} />

                        {/* Current Team Members List with Names */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-400" /> Current Team ({pitch.members?.length || 0})
                            </h3>
                            <div className="space-y-3">
                                {pitch.members && pitch.members.length > 0 ? (
                                    pitch.members.map((m, idx) => {
                                        const memberName = m.name || m.userName || m.applicantName || m.user?.name || "Team Member";
                                        return (
                                            <div key={idx} className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {memberName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-100 truncate">{memberName}</p>
                                                    <p className="text-[11px] font-medium text-indigo-400 truncate">{m.roleInTeam || m.role || "Member"}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No members joined yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PitchDetailPage;