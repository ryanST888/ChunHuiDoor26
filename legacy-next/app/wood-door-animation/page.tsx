import type { Metadata } from "next";
import { WoodDoorAnimationDemo } from "@/components/WoodDoorAnimationDemo";

export const metadata: Metadata = {
  title: "木门动画实验页",
  description: "使用 GSAP、ScrollTrigger 与 Canvas 制作的春晖木门开合动画独立演示页。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WoodDoorAnimationPage() {
  return <WoodDoorAnimationDemo />;
}
