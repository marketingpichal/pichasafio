import { ReactNode } from 'react';

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function ResponsiveCard({ children, className = "", title, subtitle }: ResponsiveCardProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-300 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
} 