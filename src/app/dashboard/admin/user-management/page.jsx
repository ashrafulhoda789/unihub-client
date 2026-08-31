import { getUserList } from "@/lib/api/users";
import { Users } from "lucide-react";
import UserTableClient from "./UserTableClient";

export default async function UserManagementPage() {
    const data = await getUserList();
    const users = data?.users || [];

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 sm:p-6 rounded-3xl backdrop-blur-xl">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" /> User Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage platform users, inspect profiles, and update access roles.
                    </p>
                </div>
                <div className="flex items-center self-start sm:self-auto">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                        Total Users: {users.length}
                    </span>
                </div>
            </div>

            {/* Users Table & Client Component */}
            <UserTableClient users={users} />
        </div>
    );
}