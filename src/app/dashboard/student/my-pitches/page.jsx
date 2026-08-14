
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MyPitchesClient from "@/components/dashboard/pitches/MyPitchesClient";
import { getPitchForSpecificUser } from "@/lib/api/myPitch";

export default async function MyPitchesPage() {
    let user = null;
    try {
        const reqHeaders = await headers();
        const session = await auth?.api?.getSession({
            headers: reqHeaders,
        });
        user = session?.user || null;
    } catch (error) {
        console.error("SSR Auth Error:", error?.message || error);
    }

    const userId = user?.id || user?._id;

    let initialPitches = [];
    if (userId) {
        try {
            const res = await getPitchForSpecificUser(userId);
            initialPitches = res?.data || (Array.isArray(res) ? res : []);
        } catch (error) {
            console.error("SSR Fetch Pitches Error:", error?.message || error);
            initialPitches = [];
        }
    }

    return <MyPitchesClient initialPitches={initialPitches} user={user} />;
}