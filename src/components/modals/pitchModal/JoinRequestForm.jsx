'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { submitJoinRequest } from '@/lib/action/joinRequest';
import { authClient } from '@/lib/auth-client';

export default function JoinRequestForm({ pitchId }) {
    const [isApplying, setIsApplying] = useState(false);
    const [applicantRole, setApplicantRole] = useState('');
    const [applicationMessage, setApplicationMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    const { data: session } = authClient.useSession();
    const user =  session?.user;

    const handleJoinSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please log in to submit a join request.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await submitJoinRequest(pitchId, {
                userId: user.id || user._id,
                applicantName: user.name || "",
                applicantEmail: user.email || "",
                role: applicantRole,
                message: applicationMessage
            });

            if (res?.success) {
                setSubmittedSuccess(true);
            } else {
                alert(res?.error || "Failed to submit request");
            }
        } catch (err) {
            console.error("Join submit error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Interested in joining?</h3>
            <p className="text-xs text-slate-400 mb-4">Submit a request to the team lead specifying your intended role.</p>

            {submittedSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-emerald-300">Request Sent!</h4>
                </div>
            ) : !isApplying ? (
                <button
                    onClick={() => setIsApplying(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                    <Send className="w-4 h-4" /> Apply for Team
                </button>
            ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-3">
                    <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Your Role / Specialty</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Full Stack Developer, UI/UX Designer"
                            value={applicantRole}
                            onChange={(e) => setApplicantRole(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Message</label>
                        <textarea
                            rows={3}
                            placeholder="Why do you want to join this team?"
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        ></textarea>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsApplying(false)}
                            className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}