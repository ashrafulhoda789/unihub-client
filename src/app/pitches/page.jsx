'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { getAllPitches } from '@/lib/api/myPitch';
import Link from 'next/link';


const CATEGORIES = ["All", "DSA", "Web Dev", "Machine Learning", "Embedded Systems", "Cyber Security"];

const PitchesPage = () => {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchPitches();
    }, [selectedCategory]);

    const fetchPitches = async () => {
        setLoading(true);
        try {
           
            const res = await getAllPitches({ category: selectedCategory, search });
            if (res?.success) {
                setPitches(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch pitches:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPitches();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Innovation Hub
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Explore Student <span className="text-indigo-500">Pitches</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg">
                        Discover academic projects, collaborate with peers, or find teams looking for your skills.
                    </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-4 mb-10 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by title, skill or topic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </form>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                            : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pitches Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse p-6"></div>
                        ))}
                    </div>
                ) : pitches.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
                        <Filter className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-300">No pitches found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your filter or search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pitches.map((pitch) => (
                            <div key={pitch._id} className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {pitch.category}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {pitch.status}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                                        {pitch.title}
                                    </h2>
                                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4">
                                        {pitch.description}
                                    </p>
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-1.5">
                                            {pitch.requiredSkills?.slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5 text-slate-500" /> {pitch.members?.length || 1} Member(s)
                                    </span>
                                    <Link href={`/pitches/${pitch._id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PitchesPage;