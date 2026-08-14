"use client";

import { useState } from "react";
import { X, Lightbulb, Code2, Tags } from "lucide-react";

export default function CreatePitchModal({ isOpen, onClose, onPitchCreated, user }) {
    const [formData, setFormData] = useState({
        title: "",
        category: "Web Dev",
        description: "",
        requiredSkills: "",
        roleInTeam: "Lead Developer"
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
            createdBy: user?.id || user?._id,
            creatorRole: user?.role === "faculty" ? "FACULTY" : "STUDENT",
            roleInTeam: formData.roleInTeam
        };

        try {
            const res = await fetch("http://localhost:5000/api/pitches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                onPitchCreated();
                onClose();
                setFormData({ title: "", category: "Web Dev", description: "", requiredSkills: "", roleInTeam: "Lead Developer" });
            }
        } catch (err) {
            console.error("Failed to create pitch", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Create Project Pitch</h3>
                        <p className="text-xs text-slate-400">Match with peers and supervisors on UniHub[cite: 7].</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. UniHub - Academic Collaboration Platform"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="DSA">DSA</option>
                                <option value="Web Dev">Web Dev</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Embedded Systems">Embedded Systems</option>
                                <option value="Cyber Security">Cyber Security</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Role in Team</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Lead Developer / Researcher"
                                value={formData.roleInTeam}
                                onChange={(e) => setFormData({ ...formData, roleInTeam: e.target.value })}
                                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Centralized project matching and learning ecosystem for universities..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Required Skills (Comma Separated)</label>
                        <input
                            type="text"
                            placeholder="React.js, Node.js, MongoDB"
                            value={formData.requiredSkills}
                            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all mt-2"
                    >
                        {loading ? "Creating Pitch..." : "Publish Pitch"}
                    </button>
                </form>
            </div>
        </div>
    );
}