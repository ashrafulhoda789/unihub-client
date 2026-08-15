'use server'
import { serverMutation } from "../core/server";

export const assignSupervisor = async (pitchId, supervisorData) => {
    return await serverMutation(
        `/api/pitches/${pitchId}/assign-supervisor`,
        supervisorData,
        "PATCH"
    );
};