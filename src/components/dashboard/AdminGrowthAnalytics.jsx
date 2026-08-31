"use client";

import { useState, useMemo } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function AdminGrowthAnalytics({ users = [], resources = [] }) {
    const [timeRange, setTimeRange] = useState("7days"); // 7days or 30days

    const chartData = useMemo(() => {
        const daysCount = timeRange === "7days" ? 7 : 30;
        const dataMap = {};
        const today = new Date();

        for (let i = daysCount - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // যেমন: "May 24"
            dataMap[dateStr] = { date: dateStr, users: 0, resources: 0 };
        }

        users.forEach(user => {
            const dateField = user.createdAt || user.created_at;
            if (dateField) {
                const userDate = new Date(dateField).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                if (dataMap[userDate]) {
                    dataMap[userDate].users += 1;
                }
            }
        });

        resources.forEach(res => {
            const dateField = res.createdAt || res.created_at;
            if (dateField) {
                const resDate = new Date(dateField).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                if (dataMap[resDate]) {
                    dataMap[resDate].resources += 1;
                }
            }
        });

        return Object.values(dataMap);
    }, [users, resources, timeRange]);

    return (
        <div className="bg-[#0e1626] border border-slate-800/80 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-sm sm:text-base font-semibold text-slate-200 flex items-center gap-2">
                        <TrendingUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-cyan-400" /> Platform Growth Analytics
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Overview of user registrations and resource uploads over time.
                    </p>
                </div>
                <div className="flex items-center bg-[#0b101c] border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
                    <button
                        onClick={() => setTimeRange("7days")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${timeRange === "7days" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange("30days")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${timeRange === "30days" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0b101c", borderColor: "#1e293b", borderRadius: "1rem", fontSize: "12px", color: "#f8fafc" }}
                        />
                        <Area type="monotone" dataKey="users" name="New Users" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="resources" name="Resources" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorResources)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span> New Users
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span> Uploaded Resources
                </span>
            </div>
        </div>
    );
}