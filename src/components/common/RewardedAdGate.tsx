import React, { useEffect, useMemo, useState } from "react";
import AdComponent from "./AdComponent";
import { X } from "lucide-react";
import { logAdEvent } from "@/lib/adTracking";
import { useAuth } from "../../context/AuthProvider";

interface RewardedAdGateProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: () => void;
  adZoneIdDesktop?: string; // 728x90 o similar
  adZoneIdMobile?: string; // 300x100 o 300x250
  requiredSeconds?: number; // segundos de visualización mínimos
  videoContext?: { day?: number; exerciseName?: string };
}

const RewardedAdGate: React.FC<RewardedAdGateProps> = ({
  isOpen,
  onClose,
  onReward,
  adZoneIdDesktop = "1098247",
  adZoneIdMobile = "1098249",
  requiredSeconds = 15,
  videoContext,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(requiredSeconds);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const { user } = useAuth();

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(requiredSeconds);
    setIsCounting(true);
    logAdEvent("gate_shown", {
      user_id: user?.id ?? null,
      provider: "juicyads",
      ad_zone: isMobile ? adZoneIdMobile : adZoneIdDesktop,
      required_seconds: requiredSeconds,
      context: videoContext,
    }).catch(() => void 0);
  }, [isOpen, requiredSeconds, adZoneIdDesktop, adZoneIdMobile, isMobile, user?.id, videoContext]);

  useEffect(() => {
    if (!isCounting || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isCounting, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && isOpen) {
      logAdEvent("gate_completed", {
        user_id: user?.id ?? null,
        provider: "juicyads",
        ad_zone: isMobile ? adZoneIdMobile : adZoneIdDesktop,
        watched_seconds: requiredSeconds,
        context: videoContext,
      }).catch(() => void 0);
    }
  }, [secondsLeft, isOpen, isMobile, adZoneIdDesktop, adZoneIdMobile, requiredSeconds, user?.id, videoContext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-gray-900 shadow-2xl border border-white/10">
        <button
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h3 className="text-xl font-semibold text-white mb-1">Desbloquea el video</h3>
          <p className="text-sm text-white/70 mb-4">
            Mira el anuncio para continuar. Tiempo restante: {secondsLeft}s
          </p>

          <div className="flex justify-center">
            <div className="w-full">
              {isMobile ? (
                <AdComponent adZoneId={adZoneIdMobile} width={300} height={100} className="mx-auto" />
              ) : (
                <AdComponent adZoneId={adZoneIdDesktop} width={728} height={90} className="mx-auto" />
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              disabled={secondsLeft > 0}
              onClick={() => {
                onReward();
                onClose();
              }}
              className={`rounded-xl px-4 py-2 font-semibold transition ${
                secondsLeft > 0
                  ? "bg-gray-700 text-white/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              Continuar
            </button>

            <button
              onClick={() => {
                logAdEvent("gate_closed", {
                  user_id: user?.id ?? null,
                  provider: "juicyads",
                  ad_zone: isMobile ? adZoneIdMobile : adZoneIdDesktop,
                  seconds_seen: requiredSeconds - secondsLeft,
                  context: videoContext,
                }).catch(() => void 0);
                onClose();
              }}
              className="rounded-xl px-4 py-2 font-semibold text-white/70 hover:text-white hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardedAdGate;


