import { useState } from 'react';

interface PoseStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  tips?: string[];
  warnings?: string[];
}

interface Pose {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  duration: string;
  popularity: number;
  steps: PoseStep[];
  benefits: string[];
  requirements: string[];
  safetyTips: string[];
}

interface PoseViewerProps {
  pose: Pose;
  onClose: () => void;
}

export default function PoseViewer({ pose, onClose }: PoseViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const [activeTab, setActiveTab] = useState<'info' | 'steps' | 'safety'>('info');

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
    if (currentStep < pose.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPopularityStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={pose.image}
            alt={pose.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Header Content */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(pose.difficulty)}`}>
                {pose.difficulty}
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                {pose.category}
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                {pose.duration}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{pose.name}</h1>
            <p className="text-gray-200 text-sm mb-3">{pose.description}</p>
            
            <div className="flex items-center gap-2">
              {getPopularityStars(pose.popularity)}
              <span className="text-white text-sm ml-1">({pose.popularity}/5)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Información', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'steps', label: 'Pasos', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'safety', label: 'Seguridad', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(95vh-20rem)] overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Beneficios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pose.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-600 bg-green-50 p-3 rounded-lg">
                      <span className="text-green-500 mt-1">•</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Requisitos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pose.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <span className="text-blue-500 mt-1">•</span>
                      {requirement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">¿Listo para comenzar?</h4>
                <p className="text-gray-600 mb-4">Sigue las instrucciones paso a paso para una experiencia segura y placentera</p>
                <button
                  onClick={() => setActiveTab('steps')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Ver Instrucciones
                </button>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-6">
              {/* Step Navigation */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Instrucciones paso a paso</h3>
                <div className="text-sm text-gray-500">
                  Paso {currentStep + 1} de {pose.steps.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / pose.steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Step */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {pose.steps[currentStep].title}
                </h4>
                
                {pose.steps[currentStep].image && (
                  <img
                    src={pose.steps[currentStep].image}
                    alt={pose.steps[currentStep].title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="prose max-w-none text-gray-600 mb-4">
                  {pose.steps[currentStep].description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
                
                {pose.steps[currentStep].tips && pose.steps[currentStep].tips!.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Consejos
                    </h5>
                    <ul className="space-y-1">
                      {pose.steps[currentStep].tips!.map((tip, index) => (
                        <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {pose.steps[currentStep].warnings && pose.steps[currentStep].warnings!.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Advertencias
                    </h5>
                    <ul className="space-y-1">
                      {pose.steps[currentStep].warnings!.map((warning, index) => (
                        <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {warning}
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
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={currentStep === pose.steps.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Consejos de Seguridad
                </h3>
                <p className="text-red-700 mb-4">
                  Tu seguridad y bienestar son nuestra prioridad. Lee cuidadosamente estos consejos antes de comenzar.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {pose.safetyTips.map((tip, index) => (
                    <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 rounded-full p-1 mt-1">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <p className="text-red-800 text-sm">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">
                    <strong>Recuerda:</strong> Si en cualquier momento sientes dolor, incomodidad o algo no se siente bien, detente inmediatamente. Tu bienestar es lo más importante.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}