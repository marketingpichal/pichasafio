import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../../context/AuthProvider';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SpinWheelProps {
  onClose: () => void;
  onRewardClaimed: (xp: number) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onClose, onRewardClaimed }) => {
  const { user } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rewardXP, setRewardXP] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Premios de la ruleta (8 secciones)
  const prizes = [
    { xp: 10, color: '#FF6B6B', label: '10 XP' },
    { xp: 15, color: '#4ECDC4', label: '15 XP' },
    { xp: 20, color: '#45B7D1', label: '20 XP' },
    { xp: 25, color: '#96CEB4', label: '25 XP' },
    { xp: 30, color: '#FFEAA7', label: '30 XP' },
    { xp: 35, color: '#DDA0DD', label: '35 XP' },
    { xp: 40, color: '#98D8C8', label: '40 XP' },
    { xp: 50, color: '#F7DC6F', label: '50 XP' }
  ];

  useEffect(() => {
    checkSpinAvailability();
  }, [user]);

  const checkSpinAvailability = async () => {
    if (!user) return;

    try {
      // Usar la tabla leaderboard para tracking del cooldown
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

        if (timeDiff < twentyFourHours) {
          setCanSpin(false);
          const remaining = twentyFourHours - timeDiff;
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          setTimeRemaining(`${hours}h ${minutes}m`);
        }
      }
    } catch (error) {
      console.error('Error checking spin availability:', error);
    }
  };

  const spinWheel = async () => {
    if (!canSpin || isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Generar rotación aleatoria (mínimo 3 vueltas completas + posición aleatoria)
    const randomRotation = 1080 + Math.random() * 360; // 3 vueltas + random
    setRotation(prev => prev + randomRotation);

    // Calcular premio basado en la posición final
    const finalPosition = randomRotation % 360;
    const sectionAngle = 360 / prizes.length;
    const prizeIndex = Math.floor((360 - finalPosition) / sectionAngle) % prizes.length;
    const selectedPrize = prizes[prizeIndex];

    // Esperar a que termine la animación
    setTimeout(async () => {
      setIsSpinning(false);
      setHasSpun(true);
      setRewardXP(selectedPrize.xp);
      
      // Actualizar base de datos
      await updateUserXP(selectedPrize.xp);
      onRewardClaimed(selectedPrize.xp);
    }, 3000);
  };

  const updateUserXP = async (xp: number) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      
      // No necesitamos actualizar profiles, se actualiza en leaderboard

      // Obtener datos actuales del leaderboard (usar la entrada más reciente)
      const { data: leaderboardData } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (leaderboardData) {
        // Actualizar leaderboard existente
        const newPoints = leaderboardData.total_points + xp;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        await supabase
          .from('leaderboard')
          .update({
            total_points: newPoints,
            level: newLevel,
            last_activity: now,
            updated_at: now
          })
          .eq('user_id', user.id);
      } else {
        // Crear nueva entrada en leaderboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        await supabase
          .from('leaderboard')
          .insert({
            user_id: user.id,
            username: profile?.username || 'Usuario',
            total_points: xp,
            level: 1,
            rank: 'Novato',
            last_activity: now,
            created_at: now,
            updated_at: now
          });
      }
    } catch (error) {
      console.error('Error updating user XP:', error);
    }
  };

  useEffect(() => {
    // Auto-spin después de 1 segundo si puede girar
    if (canSpin && !hasSpun && !isSpinning) {
      const timer = setTimeout(() => {
        spinWheel();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [canSpin, hasSpun, isSpinning]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🎰 Ruleta de Premios Diaria
        </h2>
        
        {!canSpin ? (
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-gray-600 mb-4">
              Ya has usado tu ruleta diaria
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Próxima ruleta disponible en: {timeRemaining}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="text-center">
            {/* Ruleta */}
            <div className="relative mx-auto mb-6" style={{ width: '250px', height: '250px' }}>
              {/* Indicador */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
              
              {/* Círculo de la ruleta */}
              <div 
                className={`w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden transition-transform duration-3000 ease-out`}
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(${prizes.map((prize, index) => {
                    const startAngle = (index * 360) / prizes.length;
                    const endAngle = ((index + 1) * 360) / prizes.length;
                    return `${prize.color} ${startAngle}deg ${endAngle}deg`;
                  }).join(', ')})`
                }}
              >
                {/* Etiquetas de premios */}
                {prizes.map((prize, index) => {
                  const angle = (index * 360) / prizes.length + (360 / prizes.length) / 2;
                  const radian = (angle * Math.PI) / 180;
                  const x = Math.cos(radian) * 80;
                  const y = Math.sin(radian) * 80;
                  
                  return (
                    <div
                      key={index}
                      className="absolute text-white font-bold text-sm"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {prize.label}
                    </div>
                  );
                })}
              </div>
              
              {/* Centro de la ruleta */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            
            {isSpinning && (
              <div className="mb-4">
                <div className="text-lg font-semibold text-blue-600 mb-2">
                  🎲 Girando...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
            
            {hasSpun && !isSpinning && (
              <div className="mb-6">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  🎉 ¡Felicidades!
                </div>
                <div className="text-lg mb-4">
                  Has ganado <span className="font-bold text-blue-600">{rewardXP} XP</span>
                </div>
                <button
                  onClick={onClose}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  ¡Genial!
                </button>
              </div>
            )}
            
            {!hasSpun && !isSpinning && (
              <div className="text-gray-600">
                <p className="mb-4">¡La ruleta girará automáticamente!</p>
                <div className="animate-pulse text-blue-600">
                  Preparando...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;