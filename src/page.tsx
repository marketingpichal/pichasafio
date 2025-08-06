import Header from "./components/header";
import { Testimonial } from "./components/testimmonials";
import BannerElTiempo from "./assets/banner-el-tiempo.jpg";
import { Publicity } from "./components/Publicity";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";
import Instructions from "./components/Instrucciones";
import Footer from "./components/Footer";
import InstruccionesPene from "./components/Warning";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative">
        <Header />


      </section>

      {/* Warning Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstruccionesPene />
        </div>
      </section>

      {/* Publicity Section */}
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Publicity />
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-8 sm:py-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Instructions />
        </div>
      </section>

      {/* Hero Content Section - Testimonial & Donation Banner */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8">
            <Testimonial />
          </div>
        </div>
      </section>

      {/* Thirty Day Challenge Section */}
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThirtyDayChallenge />
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src={BannerElTiempo}
              alt="Banner El Tiempo"
              className="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ maxHeight: "1000px", objectFit: "cover" }}
            />
          </div>
        </div>
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
