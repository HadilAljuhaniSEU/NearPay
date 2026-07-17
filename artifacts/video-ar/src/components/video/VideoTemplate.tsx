import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';

import { Scene0Hook } from './video_scenes/Scene0Hook';
import { Scene1Register } from './video_scenes/Scene1Register';
import { Scene2AddDebt } from './video_scenes/Scene2AddDebt';
import { Scene3Dashboard } from './video_scenes/Scene3Dashboard';
import { Scene4Transition } from './video_scenes/Scene4Transition';
import { Scene5Notification } from './video_scenes/Scene5Notification';
import { Scene6OpenApp } from './video_scenes/Scene6OpenApp';
import { Scene7Payment } from './video_scenes/Scene7Payment';
import { Scene8Success } from './video_scenes/Scene8Success';
import { Scene9Outro } from './video_scenes/Scene9Outro';

export const SCENE_DURATIONS: Record<string, number> = {
  hook: 4000,
  register: 5000,
  addDebt: 7000,
  dashboard: 6000,
  transition: 3000,
  notification: 6000,
  openApp: 6000,
  payment: 7000,
  success: 5000,
  outro: 3000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook: Scene0Hook,
  register: Scene1Register,
  addDebt: Scene2AddDebt,
  dashboard: Scene3Dashboard,
  transition: Scene4Transition,
  notification: Scene5Notification,
  openApp: Scene6OpenApp,
  payment: Scene7Payment,
  success: Scene8Success,
  outro: Scene9Outro,
};

// Pre-compute cumulative scene start times for audio sync
const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

const getBackgroundColor = (sceneIndex: number) => {
  if (sceneIndex === 8) return 'var(--color-primary)';
  if (sceneIndex === 9 || sceneIndex === 0) return 'var(--color-secondary)';
  if (sceneIndex >= 5 && sceneIndex <= 7) return '#F0F9FF';
  return '#F8FAFC';
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <>
      <div
        className="w-full h-screen overflow-hidden relative"
        style={{ direction: 'rtl', fontFamily: 'var(--font-body)' }}
      >
        {/* Persistent animated background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ backgroundColor: getBackgroundColor(sceneIndex) }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Ambient orb — shifts position per scene */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-3xl opacity-20 pointer-events-none z-0"
          animate={{
            x: sceneIndex < 4 ? '-20vw' : '40vw',
            y: sceneIndex === 8 ? '10vh' : '-20vh',
            backgroundColor: sceneIndex >= 5 ? 'var(--color-accent)' : 'var(--color-primary)',
            scale: sceneIndex === 8 ? 2 : 1,
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        <AnimatePresence mode="popLayout">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </>
  );
}
