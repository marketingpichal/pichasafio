import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

import { exerciseAnimations } from '../../lib/exerciseAnimations';
import type { ExerciseAnimationDefinition } from '../../types/exerciseAnimation';

interface Point {
  x: number;
  y: number;
}

function getFrame(definition: ExerciseAnimationDefinition, progress: number) {
  const wave = Math.sin(progress * Math.PI * 2);
  const softWave = (wave + 1) / 2;

  switch (definition.slug) {
    case 'kegel-hold': {
      const contract = softWave > 0.55 ? 1 : softWave * 1.4;
      return {
        pelvis: { x: 150, y: 215 - contract * 5 },
        chest: { x: 150, y: 128 - contract * 2 },
        head: { x: 150, y: 82 },
        elbow: { x: 192, y: 150 + contract * 1.5 },
        hand: { x: 214, y: 198 + contract * 2 },
        knee: { x: 158, y: 282 },
        foot: { x: 150, y: 344 }
      };
    }
    case 'pelvic-tilt': {
      const tilt = softWave;
      return {
        pelvis: { x: 150 + tilt * 8, y: 236 - tilt * 10 },
        chest: { x: 126, y: 186 - tilt * 2 },
        head: { x: 92, y: 176 },
        elbow: { x: 104, y: 228 },
        hand: { x: 84, y: 266 },
        knee: { x: 238, y: 248 - tilt * 4 },
        foot: { x: 286, y: 278 }
      };
    }
    case 'bridge-pulse': {
      const lift = 0.55 + softWave * 0.45;
      return {
        pelvis: { x: 166, y: 230 - lift * 48 },
        chest: { x: 126, y: 192 - lift * 18 },
        head: { x: 90, y: 184 },
        elbow: { x: 104, y: 232 },
        hand: { x: 88, y: 272 },
        knee: { x: 236, y: 238 - lift * 8 },
        foot: { x: 286, y: 286 }
      };
    }
    default:
      return {
        pelvis: { x: 150, y: 215 },
        chest: { x: 150, y: 128 },
        head: { x: 150, y: 82 },
        elbow: { x: 192, y: 150 },
        hand: { x: 214, y: 198 },
        knee: { x: 158, y: 282 },
        foot: { x: 150, y: 344 }
      };
  }
}

function Segment({ from, to, color, width = 12 }: { from: Point; to: Point; color: string; width?: number }) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

export default function ExerciseAnimationViewer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const selected = exerciseAnimations[selectedIndex];
  const duration = selected.slug === 'kegel-hold' ? 5.2 : 3.2;

  const frame = useMemo(() => getFrame(selected, 0), [selected]);

  const next = () => setSelectedIndex((current) => (current + 1) % exerciseAnimations.length);
  const previous = () => setSelectedIndex((current) => (current - 1 + exerciseAnimations.length) % exerciseAnimations.length);

  return (
    <section className="py-16 sm:py-20 bg-stone-950 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-semibold mb-2">Ejercicios guiados</p>
                <h2 className="text-white text-2xl sm:text-3xl font-bold">Animaciones propias del método</h2>
              </div>
              <button
                onClick={() => setIsPlaying((value) => !value)}
                className="w-11 h-11 rounded-full border border-stone-700 bg-stone-900 text-white flex items-center justify-center hover:border-red-500 transition-colors"
                aria-label={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-[radial-gradient(circle_at_top,#3f3f46_0%,#18181b_50%,#09090b_100%)] min-h-[420px] flex items-center justify-center">
              <div className="absolute inset-x-10 bottom-10 h-5 rounded-full bg-black/30 blur-md" />
              <svg viewBox="0 0 300 380" className="w-full max-w-md h-auto">
                <defs>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={selected.palette?.secondary || '#fb7185'} />
                    <stop offset="100%" stopColor={selected.palette?.primary || '#ef4444'} />
                  </linearGradient>
                </defs>

                <motion.g
                  animate={isPlaying ? { opacity: [0.35, 0.9, 0.35] } : { opacity: 0.65 }}
                  transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
                >
                  <ellipse cx={frame.pelvis.x} cy={frame.pelvis.y + 8} rx="36" ry="24" fill={selected.palette?.accent || '#f59e0b'} opacity="0.18" />
                </motion.g>

                <motion.g
                  animate={isPlaying ? { y: [0, -8, 0, 4, 0], rotate: selected.slug === 'pelvic-tilt' ? [0, -4, 0, 4, 0] : 0 } : { y: 0, rotate: 0 }}
                  transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${frame.pelvis.x}px ${frame.pelvis.y}px` }}
                >
                  <Segment from={frame.head} to={frame.chest} color="url(#bodyGradient)" width={14} />
                  <Segment from={frame.chest} to={frame.pelvis} color="url(#bodyGradient)" width={16} />
                  <Segment from={frame.chest} to={frame.elbow} color="url(#bodyGradient)" width={12} />
                  <Segment from={frame.elbow} to={frame.hand} color="url(#bodyGradient)" width={10} />
                  <Segment from={frame.pelvis} to={frame.knee} color="url(#bodyGradient)" width={14} />
                  <Segment from={frame.knee} to={frame.foot} color="url(#bodyGradient)" width={12} />

                  <circle cx={frame.head.x} cy={frame.head.y} r="24" fill="url(#bodyGradient)" />
                  <circle cx={frame.chest.x} cy={frame.chest.y} r="18" fill={selected.palette?.secondary || '#fb7185'} />
                  <circle cx={frame.pelvis.x} cy={frame.pelvis.y} r="22" fill={selected.palette?.primary || '#ef4444'} />
                  <circle cx={frame.elbow.x} cy={frame.elbow.y} r="10" fill={selected.palette?.secondary || '#fb7185'} />
                  <circle cx={frame.hand.x} cy={frame.hand.y} r="9" fill={selected.palette?.secondary || '#fb7185'} />
                  <circle cx={frame.knee.x} cy={frame.knee.y} r="10" fill={selected.palette?.secondary || '#fb7185'} />
                  <circle cx={frame.foot.x} cy={frame.foot.y} r="11" fill={selected.palette?.secondary || '#fb7185'} />
                </motion.g>

                <motion.g
                  animate={isPlaying ? { opacity: [0.2, 0.8, 0.2], scale: [0.92, 1.08, 0.92] } : { opacity: 0.4, scale: 1 }}
                  transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${frame.pelvis.x}px ${frame.pelvis.y}px` }}
                >
                  <circle cx={frame.pelvis.x} cy={frame.pelvis.y} r="42" fill={selected.palette?.primary || '#ef4444'} opacity="0.08" />
                  <circle cx={frame.pelvis.x} cy={frame.pelvis.y} r="58" fill={selected.palette?.secondary || '#fb7185'} opacity="0.05" />
                </motion.g>
              </svg>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6">
              <button onClick={previous} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-700 text-stone-200 hover:border-red-500 hover:text-white transition-colors">
                <ChevronLeft size={18} /> Anterior
              </button>
              <div className="text-center">
                <div className="text-white font-semibold">{selected.title}</div>
                <div className="text-stone-400 text-sm">{selected.subtitle}</div>
              </div>
              <button onClick={next} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-700 text-stone-200 hover:border-red-500 hover:text-white transition-colors">
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6">
              <p className="text-stone-400 text-sm uppercase tracking-[0.25em] mb-2">En producción</p>
              <h3 className="text-white text-2xl font-bold mb-3">{selected.title}</h3>
              <p className="text-stone-300 leading-relaxed mb-5">{selected.focus}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-stone-950 border border-stone-800 p-4">
                  <div className="text-stone-500 mb-1">Duración recomendada</div>
                  <div className="text-white font-semibold">{selected.durationLabel}</div>
                </div>
                <div className="rounded-2xl bg-stone-950 border border-stone-800 p-4">
                  <div className="text-stone-500 mb-1">Formato</div>
                  <div className="text-white font-semibold">SVG + Motion</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6">
              <h4 className="text-white font-semibold mb-4">Instrucciones</h4>
              <ol className="space-y-3">
                {selected.instructions.map((step, index) => (
                  <li key={step} className="flex gap-3 text-stone-300">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6">
              <h4 className="text-white font-semibold mb-4">Cues técnicos</h4>
              <div className="flex flex-wrap gap-2">
                {selected.cues.map((cue) => (
                  <span key={cue} className="px-3 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-300 text-sm">
                    {cue}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-950/40 to-stone-900 border border-red-900/40 rounded-3xl p-6">
              <h4 className="text-white font-semibold mb-2">Mi recomendación técnica</h4>
              <p className="text-stone-300 leading-relaxed text-sm">
                Para sacar esto rápido y dejar de depender de terceros, conviene construir una librería propia de ejercicios con animaciones vectoriales controladas por código. Luego, si un ejercicio necesita más realismo, lo migramos a Rive o 3D solo en ese caso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
