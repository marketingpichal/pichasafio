import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  timeUsing: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos M.",
    age: 28,
    location: "Madrid, España",
    rating: 5,
    text: "Increíble transformación en solo 3 meses. Los ejercicios son efectivos y fáciles de seguir. Mi confianza ha aumentado enormemente.",
    avatar: "👨🏻",
    timeUsing: "6 meses usando la app"
  },
  {
    id: 2,
    name: "Miguel R.",
    age: 35,
    location: "Barcelona, España",
    rating: 5,
    text: "Los resultados hablan por sí solos. Las rutinas son progresivas y muy bien explicadas. Totalmente recomendado.",
    avatar: "👨🏽",
    timeUsing: "1 año usando la app"
  },
  {
    id: 3,
    name: "Alejandro P.",
    age: 31,
    location: "Valencia, España",
    rating: 5,
    text: "Nunca pensé que sería posible ver cambios tan notables. La constancia y estos ejercicios realmente funcionan.",
    avatar: "👨🏼",
    timeUsing: "8 meses usando la app"
  },
  {
    id: 4,
    name: "David L.",
    age: 26,
    location: "Sevilla, España",
    rating: 5,
    text: "Excelente aplicación con contenido de calidad. Los videos diarios me mantienen motivado y enfocado en mis objetivos.",
    avatar: "👨🏻‍🦱",
    timeUsing: "4 meses usando la app"
  },
  {
    id: 5,
    name: "Roberto S.",
    age: 33,
    location: "Bilbao, España",
    rating: 5,
    text: "La mejor inversión que he hecho. Los resultados son visibles y mi pareja también ha notado la diferencia.",
    avatar: "👨🏻‍🦲",
    timeUsing: "10 meses usando la app"
  }
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-poppins"
          >
            Testimonios Reales
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto font-poppins-light"
          >
            Miles de hombres han transformado sus vidas con nuestros ejercicios especializados
          </motion.p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 sm:p-12"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Quote Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Quote className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <p className="text-lg sm:text-xl text-white mb-6 leading-relaxed font-poppins-light italic">
                      "{testimonials[currentIndex].text}"
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      {/* Avatar and Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          {testimonials[currentIndex].avatar}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold font-poppins-semibold">
                            {testimonials[currentIndex].name}, {testimonials[currentIndex].age}
                          </h4>
                          <p className="text-blue-200 text-sm font-poppins-light">
                            {testimonials[currentIndex].location}
                          </p>
                        </div>
                      </div>

                      {/* Rating and Time */}
                      <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(testimonials[currentIndex].rating)}
                        </div>
                        <p className="text-blue-200 text-xs font-poppins-light">
                          {testimonials[currentIndex].timeUsing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins-bold">
              +10,000
            </div>
            <div className="text-blue-200 font-poppins-light">
              Usuarios Satisfechos
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins-bold">
              4.9★
            </div>
            <div className="text-blue-200 font-poppins-light">
              Calificación Promedio
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-poppins-bold">
              95%
            </div>
            <div className="text-blue-200 font-poppins-light">
              Ven Resultados en 30 Días
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;