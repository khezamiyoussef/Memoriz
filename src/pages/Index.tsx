import { useState } from "react";
import Preloader from "@/components/birthday/Preloader";
import FloatingHearts from "@/components/birthday/FloatingHearts";
import HeartCounter from "@/components/birthday/HeartCounter";
import HeroSection from "@/components/birthday/HeroSection";
import TimelineSection from "@/components/birthday/TimelineSection";
import PhotoGallery from "@/components/birthday/PhotoGallery";
import FlipCards from "@/components/birthday/FlipCards";
import LoveLetter from "@/components/birthday/LoveLetter";
import Surprises from "@/components/birthday/Surprises";
import MakeAWish from "@/components/birthday/MakeAWish";
import OurFuture from "@/components/birthday/OurFuture";
import MemoriesCarousel from "@/components/birthday/MemoriesCarousel";
import MaryemNameSection from "@/components/birthday/MaryemNameSection";
import FinalMessage from "@/components/birthday/FinalMessage";

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div className="relative">
          <FloatingHearts />
          <HeartCounter />
          
          <HeroSection />
          <TimelineSection />
          <PhotoGallery />
          <FlipCards />
          <LoveLetter />
          <Surprises />
          <MakeAWish />
          <OurFuture />
          <MemoriesCarousel />
          <MaryemNameSection />
          <FinalMessage />
        </div>
      )}
    </>
  );
};

export default Index;
