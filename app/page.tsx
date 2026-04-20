import {HomeHeroSection} from "@/components/HomeHeroSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className = "min-h-screen bg-background p-3 sm:p-4 tg:p-5">
      <HomeHeroSection/>
    </main>
  );
}
