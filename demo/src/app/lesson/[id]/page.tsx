'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { computeEMF } from '../../../lib/simulations/emInductionEngine';
import { computePHMix, type Drops } from '../../../lib/simulations/phEngine';
import { getLessonById } from '../../../data/lessons';
import { LessonShell } from '../../../components/shell/LessonShell';
import { FieldControls } from '../../../components/simulations/physics/FieldControls';
import { BeakerSimulation } from '../../../components/simulations/chemistry/BeakerSimulation';
import { SubstancePanel } from '../../../components/simulations/chemistry/SubstancePanel';

// Dynamically import Three.js scene with ssr: false as per requirements
const EMInductionScene = dynamic(
  () => import('../../../components/simulations/physics/EMInductionScene'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] font-mono">Initializing Simulation Engine...</div>
  }
);

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = getLessonById(params.id);
  
  // Physics State (Lesson 1)
  const [magneticField, setMagneticField] = useState(0.5);
  const [velocity, setVelocity] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);

  // Chemistry State (Lesson 2)
  const [drops, setDrops] = useState<Drops>({});

  if (!lesson) {
    return <div className="p-8 text-[var(--accent)] font-mono">Mission parameter invalid. 404.</div>;
  }

  let simulationArea = undefined;
  let controlsArea = undefined;

  // Specific wiring for Physics EM Induction lesson
  if (lesson.id === '1') {
    simulationArea = (
      <EMInductionScene 
        magneticField={magneticField} 
        velocity={velocity} 
      />
    );
    controlsArea = (
      <FieldControls 
        magneticField={magneticField}
        onMagneticFieldChange={setMagneticField}
        velocity={velocity}
        onVelocityChange={setVelocity}
        onInteract={() => setInteractionCount((count) => count + 1)}
      />
    );
  }

  // Specific wiring for Chemistry Acid-Base lesson
  if (lesson.id === '2') {
    const chemState = computePHMix(drops);
    simulationArea = (
      <BeakerSimulation ph={chemState.ph} color={chemState.color} />
    );
    controlsArea = (
      <SubstancePanel
        onSubstanceDrop={(substanceId) => {
          setDrops((prev) => ({
            ...prev,
            [substanceId]: (prev[substanceId] ?? 0) + 1,
          }));
          setInteractionCount((count) => count + 1);
        }}
      />
    );
  }

  const simState =
    lesson.id === '1'
      ? computeEMF(velocity, magneticField)
      : lesson.id === '2'
        ? computePHMix(drops)
        : undefined;

  return (
    <LessonShell 
      lesson={lesson} 
      simulationArea={simulationArea}
      controlsArea={controlsArea}
      simulationState={simState}
      simulationInteractionCount={interactionCount}
    />
  );
}
