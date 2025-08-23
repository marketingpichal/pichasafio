import { useState } from 'react';

interface GuideStep {
  id: number;
  title: string;
  content: string;
  image?: string;
  tips?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  steps: GuideStep[];
  benefits: string[];
  requirements: string[];
}

interface GuideViewerProps {
  guide: Guide;
  onClose: () => void;
}

export default function GuideViewer({ guide, onClose }: GuideViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Principiante':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avanzado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const nextStep = () => {
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(guide.difficulty)}`}>
                {guide.difficulty}
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                {guide.duration}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{guide.title}</h1>
            <p className="text-gray-200 text-sm">{guide.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
          {!showSteps ? (
            <div className="space-y-6">
              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Beneficios
                </h3>
                <ul className="space-y-2">
                  {guide.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 mt-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Requisitos
                </h3>
                <ul className="space-y-2">
                  {guide.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-500 mt-1">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Action */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Precio de la guía</p>
                  <p className="text-2xl font-bold text-green-600">{guide.price}</p>
                </div>
                <button
                  onClick={() => setShowSteps(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Comenzar Guía
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowSteps(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver a información
                </button>
                <div className="text-sm text-gray-500">
                  Paso {currentStep + 1} de {guide.steps.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / guide.steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Step */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {guide.steps[currentStep].title}
                </h3>
                
                {guide.steps[currentStep].image && (
                  <img
                    src={guide.steps[currentStep].image}
                    alt={guide.steps[currentStep].title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="prose max-w-none text-gray-600 mb-4">
                  {guide.steps[currentStep].content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
                
                {guide.steps[currentStep].tips && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Consejos
                    </h4>
                    <ul className="space-y-1">
                      {guide.steps[currentStep].tips!.map((tip, index) => (
                        <li key={index} className="text-yellow-700 text-sm flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={currentStep === guide.steps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}