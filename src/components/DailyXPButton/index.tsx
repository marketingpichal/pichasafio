import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';

interface DailyXPButtonProps {
  onClaimClick: () => void;
}

const DailyXPButton: React.FC<DailyXPButtonProps> = ({ onClaimClick }) => {
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkClaimAvailability = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        
        const { data: leaderboard } = await supabase
          .from('leaderboard')
          .select('last_activity')
          .eq('user_id', user.id)
          .single();

        if (leaderboard?.last_activity) {
          const lastActivity = new Date(leaderboard.last_activity);
          const now = new Date();
          const timeDiff = now.getTime() - lastActivity.getTime();
          const twentyFourHours = 24 * 60 * 60 * 1000;

          if (timeDiff >= twentyFourHours) {
            setCanClaim(true);
            setTimeUntilNext('');
          } else {
            setCanClaim(false);
            const timeLeft = twentyFourHours - timeDiff;
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            setTimeUntilNext(`${hoursLeft}h ${minutesLeft}m`);
          }
        } else {
          // Primera vez, puede reclamar
          setCanClaim(true);
          setTimeUntilNext('');
        }
      } catch (error) {
        console.error('Error checking claim availability:', error);
        setCanClaim(true); // En caso de error, permitir reclamar
      }
    };

    checkClaimAvailability();
    
    // Actualizar cada minuto
    const interval = setInterval(checkClaimAvailability, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
      <button
        onClick={canClaim ? onClaimClick : undefined}
        disabled={!canClaim}
        className={`
          px-3 py-4 rounded-l-2xl font-bold text-white shadow-xl transition-all duration-300 transform
          ${
            canClaim
              ? 'bg-gradient-to-b from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:scale-105 cursor-pointer animate-pulse'
              : 'bg-gray-600 cursor-not-allowed opacity-75'
          }
        `}
      >
        {canClaim ? (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl">🎁</span>
            <span className="text-sm font-bold">¡Reclama</span>
            <span className="text-sm font-bold">tu XP!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-xl">⏰</span>
            <span className="text-xs">{timeUntilNext}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default DailyXPButton;