import type { ExerciseAnimationDefinition } from '../types/exerciseAnimation';

export const exerciseAnimations: ExerciseAnimationDefinition[] = [
  {
    id: 'kegel-hold',
    slug: 'kegel-hold',
    title: 'Kegel Hold',
    subtitle: 'Contracción sostenida del suelo pélvico',
    durationLabel: '5 a 10 segundos',
    focus: 'Activación interna, respiración estable y relajación controlada',
    instructions: [
      'Inhala profundo antes de iniciar.',
      'Contrae el suelo pélvico como si quisieras cortar el flujo de orina.',
      'Mantén cuello, glúteos y abdomen relajados.',
      'Suelta lento y deja una pausa completa antes de repetir.'
    ],
    cues: [
      'No aprietes glúteos',
      'No pujes hacia abajo',
      'Respira durante todo el movimiento'
    ],
    frameCount: 120,
    palette: {
      primary: '#ef4444',
      secondary: '#fb7185',
      accent: '#f59e0b'
    }
  },
  {
    id: 'pelvic-tilt',
    slug: 'pelvic-tilt',
    title: 'Pelvic Tilt',
    subtitle: 'Basculación de pelvis acostado',
    durationLabel: '8 a 12 repeticiones',
    focus: 'Movilidad pélvica y control de zona baja',
    instructions: [
      'Acuéstate con rodillas flexionadas y pies apoyados.',
      'Lleva la pelvis en retroversión, pegando la zona lumbar al suelo.',
      'Mantén 1 segundo arriba sin contener la respiración.',
      'Regresa lento a posición neutra.'
    ],
    cues: [
      'Movimiento corto y controlado',
      'No eleves costillas',
      'Evita hacerlo con impulso'
    ],
    frameCount: 120,
    palette: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#22c55e'
    }
  },
  {
    id: 'bridge-pulse',
    slug: 'bridge-pulse',
    title: 'Bridge Pulse',
    subtitle: 'Puente corto con pulsos suaves',
    durationLabel: '10 a 15 pulsos',
    focus: 'Cadena posterior, estabilidad pélvica y resistencia',
    instructions: [
      'Desde el suelo, eleva cadera hasta formar una línea rodillas-cadera-pecho.',
      'Haz pulsos cortos arriba sin perder alineación.',
      'Mantén el peso repartido entre pies y hombros.',
      'Baja vértebra por vértebra al finalizar.'
    ],
    cues: [
      'No hiperextiendas la espalda',
      'Rodillas apuntando al frente',
      'Aprieta desde cadera, no desde cuello'
    ],
    frameCount: 120,
    palette: {
      primary: '#06b6d4',
      secondary: '#67e8f9',
      accent: '#f43f5e'
    }
  }
];

export const exerciseAnimationMap = Object.fromEntries(
  exerciseAnimations.map((animation) => [animation.slug, animation])
);
