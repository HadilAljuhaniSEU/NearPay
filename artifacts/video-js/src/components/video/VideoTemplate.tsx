import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';

import { Scene0Problem } from './video_scenes/Scene0_Problem';
import { Scene1Hero } from './video_scenes/Scene1_Hero';
import { Scene2Merchant } from './video_scenes/Scene2_Merchant';
import { Scene3CustomerMap } from './video_scenes/Scene3_CustomerMap';
import { Scene4Payment } from './video_scenes/Scene4_Payment';
import { Scene5Outro } from './video_scenes/Scene5_Outro';

export const SCENE_DURATIONS: Record<string, number> = {
  problem: 4000,
  hero: 4500,
  merchant: 6000,
  customermap: 5500,
  payment: 6000,
  outro: 4500,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  problem: Scene0Problem,
  hero: Scene1Hero,
  merchant: Scene2Merchant,
  customermap: Scene3CustomerMap,
  payment: Scene4Payment,
  outro: Scene5Outro,
};

// Persistent orb positions per scene index
const ORB_POS = [
  { x: '45vw', y: '40vh', scale: 2.5, opacity: 0.15 },
  { x: '8vw',  y: '15vh', scale: 1,   opacity: 0.12 },
  { x: '75vw', y: '50vh', scale: 1.4, opacity: 0.1  },
  { x: '20vw', y: '70vh', scale: 0.8, opacity: 0.12 },
  { x: '60vw', y: '25vh', scale: 1.8, opacity: 0.1  },
  { x: '50vw', y: '50vh', scale: 3,   opacity: 0.2  },
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const orbPos = ORB_POS[sceneIndex] ?? ORB_POS[0];

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* Persistent animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: sceneIndex >= 1 && sceneIndex <= 4
            ? 'linear-gradient(135deg, #0F172A 0%, #020617 100%)'
            : sceneIndex === 5
              ? 'linear-gradient(135deg, #14B8A6 0%, #0F172A 60%)'
              : 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Drifting ambient blobs */}
      <motion.div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ width: '50vw', height: '50vw', background: 'var(--color-primary)' }}
        animate={{ x: orbPos.x, y: orbPos.y, scale: orbPos.scale, opacity: orbPos.opacity }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute rounded-full blur-[80px] pointer-events-none"
        style={{ width: '30vw', height: '30vw', background: 'var(--color-accent)', right: 0, bottom: 0 }}
        animate={{
          x: ['-5%', '-40%', '-15%'],
          y: ['-5%', '-40%', '-20%'],
          opacity: sceneIndex === 5 ? 0.05 : 0.08,
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
