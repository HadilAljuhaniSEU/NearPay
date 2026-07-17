import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';

import { Scene0Hook } from './video_scenes/Scene0Hook';
import { Scene1MerchantRegister } from './video_scenes/Scene1MerchantRegister';
import { Scene2MerchantProfile } from './video_scenes/Scene2MerchantProfile';
import { Scene3AddDebt } from './video_scenes/Scene3AddDebt';
import { Scene4MerchantDashboard } from './video_scenes/Scene4MerchantDashboard';
import { Scene5Transition } from './video_scenes/Scene5Transition';
import { Scene6CustomerRegister } from './video_scenes/Scene6CustomerRegister';
import { Scene7NearbyStores } from './video_scenes/Scene7NearbyStores';
import { Scene8ContactOptions } from './video_scenes/Scene8ContactOptions';
import { Scene9AcceptDebt } from './video_scenes/Scene9AcceptDebt';
import { Scene10Payment } from './video_scenes/Scene10Payment';
import { Scene11Success } from './video_scenes/Scene11Success';
import { Scene12Outro } from './video_scenes/Scene12Outro';

export const SCENE_DURATIONS: Record<string, number> = {
  hook:              5000,
  merchantRegister:  6000,
  merchantProfile:   7000,
  addDebt:           8000,
  merchantDashboard: 6000,
  transition:        3000,
  customerRegister:  5000,
  nearbyStores:      8000,
  contactOptions:    6000,
  acceptDebt:        7000,
  payment:           7000,
  success:           4000,
  outro:             4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook:              Scene0Hook,
  merchantRegister:  Scene1MerchantRegister,
  merchantProfile:   Scene2MerchantProfile,
  addDebt:           Scene3AddDebt,
  merchantDashboard: Scene4MerchantDashboard,
  transition:        Scene5Transition,
  customerRegister:  Scene6CustomerRegister,
  nearbyStores:      Scene7NearbyStores,
  contactOptions:    Scene8ContactOptions,
  acceptDebt:        Scene9AcceptDebt,
  payment:           Scene10Payment,
  success:           Scene11Success,
  outro:             Scene12Outro,
};

const ORB_STATES: Record<string, { x: string; y: string; bg: string }> = {
  hook:              { x: '20vw', y: '20vh', bg: '#14B8A6' },
  merchantRegister:  { x: '80vw', y: '10vh', bg: '#38BDF8' },
  merchantProfile:   { x: '10vw', y: '80vh', bg: '#14B8A6' },
  addDebt:           { x: '70vw', y: '70vh', bg: '#10B981' },
  merchantDashboard: { x: '50vw', y: '50vh', bg: '#38BDF8' },
  transition:        { x: '50vw', y: '50vh', bg: '#14B8A6' },
  customerRegister:  { x: '20vw', y: '20vh', bg: '#38BDF8' },
  nearbyStores:      { x: '80vw', y: '80vh', bg: '#14B8A6' },
  contactOptions:    { x: '10vw', y: '10vh', bg: '#10B981' },
  acceptDebt:        { x: '90vw', y: '50vh', bg: '#38BDF8' },
  payment:           { x: '50vw', y: '90vh', bg: '#14B8A6' },
  success:           { x: '50vw', y: '50vh', bg: '#ffffff' },
  outro:             { x: '50vw', y: '50vh', bg: '#14B8A6' },
};

type VideoTemplateProps = {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = true,
  onSceneChange,
}: VideoTemplateProps = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Strip _r1/_r2 suffix for component + orb lookup
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Keep audio in sync with muted prop
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    if (!muted) el.play().catch(() => {});
  }, [muted]);

  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const orbState = ORB_STATES[baseSceneKey] ?? ORB_STATES.hook;
  const progressPercent = sceneIndex >= 0
    ? ((sceneIndex + 1) / Object.keys(SCENE_DURATIONS).length) * 100
    : 0;

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/composite_audio.mp3`}
        loop={loop}
        muted={muted}
        autoPlay
      />

      {/* Persistent ambient orb — lives OUTSIDE AnimatePresence */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ width: '80vw', height: '80vw', transform: 'translate(-50%, -50%)', zIndex: 0 }}
        animate={{
          left: orbState.x,
          top: orbState.y,
          backgroundColor: orbState.bg,
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      {/* Scene foreground — key must be currentSceneKey (with suffix) for lock-loop cycling */}
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* Persistent progress line — lives OUTSIDE AnimatePresence */}
      <motion.div
        className="absolute bottom-[12%] left-1/2 h-[2px] bg-[#14B8A6] z-[60]"
        style={{ transform: 'translateX(-50%)' }}
        animate={{ width: `${20 + progressPercent * 0.6}%` }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </div>
  );
}
