
import { getPitchById } from "@/lib/api/myPitch";
import { notFound } from "next/navigation";
import PitchDetailClient from "./PitchDetailClient";

export default async function PitchDetailPage({ params }) {
    const { id } = await params;

    let pitch = null;
    try {
        pitch = await getPitchById(id);
    } catch (error) {
        console.error("Error fetching pitch details:", error);
    }

    if (!pitch || pitch.error) {
        notFound();
    }

    return <PitchDetailClient initialPitch={pitch} />;
}