// src/app/workspace/[id]/page.jsx
import { getPitchById } from "@/lib/api/myPitch";
import WorkspaceView from "./WorkspaceView";
import { getWorkspaceTasks } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WorkspacePage({ params }) {
    const { id } = await params;
    const reqHeaders = await headers();

    const session = await auth.api.getSession({
        headers: reqHeaders,
    });

    const currentUserId = session?.user?.id || session?.data?.user?.id;
    // console.log("Current User ID:", currentUserId);
    // console.log('session', session);

    let pitch = null;
    let initialTasks = [];

    try {

        const pitchRes = await getPitchById(id);

        // console.log("Pitch API Raw Response:", pitchRes);

        pitch = pitchRes?.data || pitchRes?.pitch || pitchRes;

        if (pitch && (pitch._id || pitch.id)) {
            const tasksRes = await getWorkspaceTasks(id, { headers: reqHeaders });

            initialTasks = tasksRes?.data || tasksRes?.tasks || tasksRes || [];
        }
    } catch (error) {
        console.error("Error fetching pitch details:", error);
    }

    if (!pitch || (!pitch._id && !pitch.id)) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="p-4 bg-red-950/50 border border-red-800/50 text-red-400 rounded-xl font-medium text-sm">
                    Workspace or Pitch data not found!
                </div>
            </div>
        );
    }

    return (
        <WorkspaceView
            workspace={pitch}
            initialTasks={initialTasks}
            currentUserId={currentUserId}
        />
    );
}