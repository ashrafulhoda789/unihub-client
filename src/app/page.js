export const dynamic = 'force-dynamic';

import HeroBanner from "@/components/Homepages/Banner";
import CallToActionSection from "@/components/Homepages/CallToActionSection";
import CoreFeaturesSection from "@/components/Homepages/CoreFeaturesSection";
import FeaturedPitchesSection from "@/components/Homepages/FeaturedPitchesSection";
import HowItWorksSection from "@/components/Homepages/HowItWorksSection";
import LiveSystemStatsSection from "@/components/Homepages/LiveSystemStatsSection";


export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <CoreFeaturesSection/>
      <HowItWorksSection/>
      <LiveSystemStatsSection/>
      <FeaturedPitchesSection/>
      <CallToActionSection/>
    </div>
  );
}
