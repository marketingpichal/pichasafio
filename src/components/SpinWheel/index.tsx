import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../../context/AuthProvider';

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
  const [error, setError] = useState('');

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
      const { data: leaderboard } = await supabase
        .from('leaderboard')
        .select('last_spin')
        .eq('user_id', user.id)
        .single();

      if (leaderboard?.last_spin) {
        const lastSpin = new Date(leaderboard.last_spin);
        const now = new Date();
        const timeDiff = now.getTime() - lastSpin.getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (timeDiff < twentyFourHours) {
          setCanSpin(false);
          const remaining = twentyFourHours - timeDiff;
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          setTimeRemaining(`${hours}h ${minutes}m`);
        }
      }
    } catch (err) {
      console.error('Error checking spin availability:', err);
      // Don't allow spin on error - prevents exploit
      setCanSpin(false);
    }
  };

  const spinWheel = async () => {
    if (!canSpin || isSpinning || hasSpun || !user) return;

    setIsSpinning(true);
    setError('');

    // Generar rotación aleatoria (mínimo 3 vueltas completas + posición aleatoria)
    const randomRotation = 1080 + Math.random() * 360;
    setRotation(prev => prev + randomRotation);

    // Calcular premio basado en la posición final
    const finalPosition = randomRotation % 360;
    const sectionAngle = 360 / prizes.length;
    const prizeIndex = Math.floor((360 - finalPosition) / sectionAngle) % prizes.length;
    const selectedPrize = prizes[prizeIndex];

    // Esperar a que termine la animación, then validate server-side
    setTimeout(async () => {
      try {
        // Get username for leaderboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        // Atomic RPC call - validates cooldown and updates XP in one transaction
        const { data, error: rpcError } = await supabase.rpc('claim_daily_spin', {
          p_user_id: user.id,
          p_xp: selectedPrize.xp,
          p_username: profile?.username || 'Usuario'
        });

        if (rpcError) throw rpcError;

        if (data && !data.success) {
          // Cooldown was active (race condition caught server-side)
          setIsSpinning(false);
          setCanSpin(false);
          if (data.next_spin) {
            const nextSpin = new Date(data.next_spin);
            const now = new Date();
            const remaining = nextSpin.getTime() - now.getTime();
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            setTimeRemaining(`${hours}h ${minutes}m`);
          }
          setError('Ya usaste tu ruleta diaria. Intenta más tarde.');
          return;
        }

        // Success
        setIsSpinning(false);
        setHasSpun(true);
        setRewardXP(selectedPrize.xp);
        onRewardClaimed(selectedPrize.xp);
      } catch (err) {
        console.error('Error updating user XP:', err);
        setIsSpinning(false);
        setError('Error al guardar tu premio. Intenta de nuevo más tarde.');
      }
    }, 3000);
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

            {error && !isSpinning && (
              <div className="mb-6">
                <div className="text-lg font-bold text-red-600 mb-2">
                  ❌ Error
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}

            {hasSpun && !isSpinning && !error && (
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

            {!hasSpun && !isSpinning && !error && (
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
