import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

import { exerciseAnimations } from '../../lib/exerciseAnimations';

function AnimatedExerciseStage({ slug, isPlaying, palette }: { slug: string; isPlaying: boolean; palette?: { primary: string; secondary: string; accent: string } }) {
  const duration = slug === 'kegel-hold' ? 5 : 3.4;
  const colors = {
    primary: palette?.primary || '#ef4444',
    secondary: palette?.secondary || '#fb7185',
    accent: palette?.accent || '#f59e0b'
  };

  if (slug === 'pelvic-tilt') {
    return (
      <svg viewBox="0 0 420 320" className="w-full max-w-[520px] h-auto">
        <defs>
          <linearGradient id="silhouettePelvic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="pelvicGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="210" cy="285" rx="140" ry="18" fill="#000" opacity="0.35" />
        <motion.ellipse
          cx="228"
          cy="215"
          rx="56"
          ry="38"
          fill="url(#pelvicGlow)"
          animate={isPlaying ? { scale: [0.92, 1.06, 0.92], opacity: [0.25, 0.5, 0.25] } : { scale: 1, opacity: 0.28 }}
          transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
          style={{ transformOrigin: '228px 215px' }}
        />

        <motion.g
          animate={isPlaying ? { y: [0, -3, 0, 2, 0], rotate: [0, -4, 0, 4, 0] } : { y: 0, rotate: 0 }}
          transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
          style={{ transformOrigin: '226px 218px' }}
        >
          <path d="M78 198 C92 170, 110 158, 126 160 C144 162, 150 178, 148 198 C145 216, 130 228, 112 226 C94 224, 82 214, 78 198 Z" fill="url(#silhouettePelvic)" />
          <path d="M118 173 C132 160, 150 150, 177 148 C214 145, 236 152, 252 170 C263 182, 266 195, 262 210 C258 226, 248 234, 234 236 C208 240, 182 238, 156 232 C136 228, 122 216, 117 198 C114 187, 114 179, 118 173 Z" fill="url(#silhouettePelvic)" />
          <path d="M252 170 C277 173, 304 176, 327 181 C342 184, 349 192, 346 203 C343 214, 333 220, 320 218 C297 214, 273 209, 250 204 Z" fill="url(#silhouettePelvic)" />
          <path d="M320 183 C336 187, 351 192, 364 201 C372 207, 375 214, 373 223 C370 234, 359 240, 348 237 C335 233, 325 225, 318 213 C314 205, 315 194, 320 183 Z" fill="url(#silhouettePelvic)" />
          <path d="M153 207 C170 214, 184 224, 196 239 C204 249, 205 259, 201 269 C196 280, 184 286, 172 282 C160 278, 151 267, 145 255 C139 243, 141 224, 153 207 Z" fill="url(#silhouettePelvic)" />
          <path d="M166 258 C174 268, 178 279, 178 291 C177 303, 168 311, 157 311 C146 311, 138 303, 139 291 C140 279, 148 268, 166 258 Z" fill="url(#silhouettePelvic)" />
          <circle cx="110" cy="192" r="29" fill="#8b5cf6" />
        </motion.g>
      </svg>
    );
  }

  if (slug === 'bridge-pulse') {
    return (
      <svg viewBox="0 0 420 320" className="w-full max-w-[520px] h-auto">
        <defs>
          <linearGradient id="silhouetteBridge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <radialGradient id="bridgeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="220" cy="288" rx="144" ry="18" fill="#000" opacity="0.35" />
        <motion.ellipse
          cx="208"
          cy="190"
          rx="70"
          ry="42"
          fill="url(#bridgeGlow)"
          animate={isPlaying ? { scale: [0.9, 1.08, 0.9], opacity: [0.18, 0.4, 0.18] } : { scale: 1, opacity: 0.22 }}
          transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
          style={{ transformOrigin: '208px 190px' }}
        />

        <motion.g
          animate={isPlaying ? { y: [0, -18, 0, -12, 0] } : { y: 0 }}
          transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
        >
          <path d="M82 196 C95 173, 115 164, 131 166 C146 168, 151 183, 148 198 C144 214, 129 225, 112 223 C95 221, 84 211, 82 196 Z" fill="url(#silhouetteBridge)" />
          <path d="M125 176 C139 162, 163 146, 192 139 C222 132, 251 139, 272 155 C285 165, 291 177, 290 191 C288 207, 278 220, 263 223 C241 227, 214 222, 193 213 C171 203, 150 192, 133 184 Z" fill="url(#silhouetteBridge)" />
          <path d="M262 163 C282 169, 299 177, 314 188 C323 195, 325 204, 321 214 C316 225, 304 231, 293 227 C281 223, 272 214, 266 202 C260 191, 260 177, 262 163 Z" fill="url(#silhouetteBridge)" />
          <path d="M289 218 C307 227, 326 237, 344 250 C354 258, 357 268, 353 278 C349 287, 339 293, 329 290 C317 287, 308 278, 301 267 C293 256, 288 241, 289 218 Z" fill="url(#silhouetteBridge)" />
          <path d="M173 208 C160 220, 151 233, 146 248 C143 260, 145 271, 154 278 C164 285, 176 284, 185 277 C193 270, 198 259, 197 247 C196 234, 188 220, 173 208 Z" fill="url(#silhouetteBridge)" />
          <path d="M152 273 C141 281, 134 291, 132 303 C132 312, 138 319, 147 320 C157 321, 165 315, 168 305 C170 294, 165 284, 152 273 Z" fill="url(#silhouetteBridge)" />
          <circle cx="111" cy="191" r="28" fill="#22d3ee" />
        </motion.g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 320" className="w-full max-w-[520px] h-auto">
      <defs>
        <linearGradient id="silhouetteKegel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.primary} />
        </linearGradient>
        <radialGradient id="kegelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.38" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="210" cy="285" rx="92" ry="16" fill="#000" opacity="0.35" />
      <motion.ellipse
        cx="214"
        cy="198"
        rx="52"
        ry="38"
        fill="url(#kegelGlow)"
        animate={isPlaying ? { scale: [0.92, 1.08, 0.92], opacity: [0.18, 0.42, 0.18] } : { scale: 1, opacity: 0.24 }}
        transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
        style={{ transformOrigin: '214px 198px' }}
      />

      <motion.g
        animate={isPlaying ? { y: [0, -5, 0, -2, 0] } : { y: 0 }}
        transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
      >
        <path d="M188 78 C203 67, 220 67, 233 77 C245 86, 249 102, 244 116 C239 129, 226 138, 212 138 C198 138, 185 129, 180 116 C175 103, 178 88, 188 78 Z" fill="url(#silhouetteKegel)" />
        <path d="M180 136 C188 121, 201 112, 216 112 C231 112, 244 121, 252 136 C262 154, 264 177, 260 202 C255 228, 245 245, 230 253 C220 258, 210 260, 199 257 C182 252, 170 239, 164 220 C158 200, 160 153, 180 136 Z" fill="url(#silhouetteKegel)" />
        <path d="M166 153 C156 167, 149 181, 146 198 C143 210, 148 221, 158 226 C167 230, 177 224, 181 214 C186 203, 184 191, 180 178 C176 168, 171 160, 166 153 Z" fill="url(#silhouetteKegel)" />
        <path d="M258 151 C268 165, 275 179, 278 196 C280 208, 276 219, 267 224 C258 229, 248 224, 242 214 C236 203, 236 191, 240 178 C244 168, 250 159, 258 151 Z" fill="url(#silhouetteKegel)" />
        <path d="M188 252 C183 266, 180 278, 180 291 C181 305, 190 314, 203 314 C216 314, 224 305, 225 291 C225 278, 222 266, 217 252 Z" fill="url(#silhouetteKegel)" />
      </motion.g>
    </svg>
  );
}

export default function ExerciseAnimationViewer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const selected = exerciseAnimations[selectedIndex];

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

            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-[radial-gradient(circle_at_top,#27272a_0%,#18181b_48%,#09090b_100%)] min-h-[420px] flex items-center justify-center">
              <div className="absolute inset-x-10 bottom-10 h-5 rounded-full bg-black/30 blur-md" />
              <AnimatedExerciseStage slug={selected.slug} isPlaying={isPlaying} palette={selected.palette} />
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
              <p className="text-stone-400 text-sm uppercase tracking-[0.25em] mb-2">V2 en validación</p>
              <h3 className="text-white text-2xl font-bold mb-3">{selected.title}</h3>
              <p className="text-stone-300 leading-relaxed mb-5">{selected.focus}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-stone-950 border border-stone-800 p-4">
                  <div className="text-stone-500 mb-1">Duración recomendada</div>
                  <div className="text-white font-semibold">{selected.durationLabel}</div>
                </div>
                <div className="rounded-2xl bg-stone-950 border border-stone-800 p-4">
                  <div className="text-stone-500 mb-1">Enfoque visual</div>
                  <div className="text-white font-semibold">Silueta motion</div>
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
              <h4 className="text-white font-semibold mb-2">Siguiente mejora</h4>
              <p className="text-stone-300 leading-relaxed text-sm">
                Si esta dirección visual ya representa mejor el ejercicio, el siguiente paso es normalizar anatomía, ritmo y planos para producir un primer lote coherente de ejercicios propios y luego conectarlos a las rutinas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
