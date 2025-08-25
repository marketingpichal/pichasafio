import Header from "./components/header";
import { Testimonial } from "./components/testimmonials";
import TestimonialSlider from "./components/TestimonialSlider";
import PoseScroll from "./components/PoseScroll";
import { Publicity } from "./components/Publicity";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";
import Instructions from "./components/Instrucciones";
import Footer from "./components/Footer";
import InstruccionesPene from "./components/Warning";
import PoseList from "./components/Poses/poseList";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";

export default function Page() {
  const [showPoses, setShowPoses] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (showPoses) {
    return <PoseList onBack={() => setShowPoses(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative">
        <Header />
      </section>

      {/* Pose Scroll Section */}
      <section>
        <PoseScroll />
      </section>

      {/* Footer Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </section>
    </div>
  );
}
