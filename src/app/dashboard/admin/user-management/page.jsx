import { getUserList } from "@/lib/api/users";
import { Users, Shield, UserCheck, Mail, Calendar, Loader2 } from "lucide-react";
import UserTableClient from "./UserTableClient";

export default async function UserManagementPage() {
    const data = await getUserList();
    const users = data?.users || [];

    console.log(users);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-indigo-400" /> User Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage platform users, inspect profiles, and update access roles.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                        Total Users: {users.length}
                    </span>
                </div>
            </div>

            {/* Users Table Component */}
            <UserTableClient users={users} />
        </div>
    );
}