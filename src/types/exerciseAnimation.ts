export type ExerciseAnimationSide = 'left' | 'right';

export interface ExerciseJoint {
  x: number;
  y: number;
}

export interface ExerciseFrame {
  pelvis: ExerciseJoint;
  chest: ExerciseJoint;
  head: ExerciseJoint;
  elbow: ExerciseJoint;
  hand: ExerciseJoint;
  knee: ExerciseJoint;
  foot: ExerciseJoint;
}

export interface ExerciseAnimationDefinition {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  focus: string;
  instructions: string[];
  cues: string[];
  frameCount: number;
  side?: ExerciseAnimationSide;
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
