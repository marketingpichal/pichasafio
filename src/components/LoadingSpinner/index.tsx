export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-20"></div>
        </div>
        
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  );
}
