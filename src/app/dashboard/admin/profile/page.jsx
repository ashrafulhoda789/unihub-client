import ProfileFormSection from "@/components/dashboard/profile/ProfileFormSection";
import PasswordFormSection from "@/components/dashboard/profile/PasswordFormSection";
import { allUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.session?.userId || session?.user?.id;
    const users = await allUsers();

    const userData = Array.isArray(users)
        ? users.find((u) => u._id === currentUserId || u.id === currentUserId)
        : null;

    const currentUser = userData || session?.user;

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            <div className="border-b border-slate-800/80 pb-4">
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your account information and security settings.
                </p>
            </div>

            <ProfileFormSection initialUser={currentUser} />
            <PasswordFormSection />
        </div>
    );
}