import DonationBanner from "./components/donations";
import { Publicity } from "./components/Publicity";
import { Testimonial } from "./components/testimmonials";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section with Video and Donation */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="w-full">
            <Testimonial />
          </div>
          <div className="w-full">
            <DonationBanner />
          </div>
        </div>
      </section>

      {/* Publicity Banners */}
      <section className="container mx-auto px-4 py-8">
        <Publicity />
      </section>

      {/* 30 Day Challenge */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <ThirtyDayChallenge />
      </section>
    </main>
  );
}
