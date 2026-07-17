import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence } from 'framer-motion';

import Scene0Hook from './video_scenes/Scene0Hook';
import Scene1MerchantRegister from './video_scenes/Scene1MerchantRegister';
import Scene2MerchantProfile from './video_scenes/Scene2MerchantProfile';
import Scene3AddDebt from './video_scenes/Scene3AddDebt';
import Scene4MerchantDashboard from './video_scenes/Scene4MerchantDashboard';
import Scene5Transition from './video_scenes/Scene5Transition';
import Scene6CustomerRegister from './video_scenes/Scene6CustomerRegister';
import Scene7NearbyStores from './video_scenes/Scene7NearbyStores';
import Scene8ContactOptions from './video_scenes/Scene8ContactOptions';
import Scene9AcceptDebt from './video_scenes/Scene9AcceptDebt';
import Scene10Payment from './video_scenes/Scene10Payment';
import Scene11Success from './video_scenes/Scene11Success';
import Scene12Outro from './video_scenes/Scene12Outro';

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

export const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook: Scene0Hook,
  merchantRegister: Scene1MerchantRegister,
  merchantProfile: Scene2MerchantProfile,
  addDebt: Scene3AddDebt,
  merchantDashboard: Scene4MerchantDashboard,
  transition: Scene5Transition,
  customerRegister: Scene6CustomerRegister,
  nearbyStores: Scene7NearbyStores,
  contactOptions: Scene8ContactOptions,
  acceptDebt: Scene9AcceptDebt,
  payment: Scene10Payment,
  success: Scene11Success,
  outro: Scene12Outro,
};

interface VideoTemplateProps {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneId: string) => void;
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = true,
  onSceneChange,
}: VideoTemplateProps) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Strip _r1/_r2 suffix for component lookup; keep full key for AnimatePresence
  const baseKey = currentSceneKey?.replace(/_r[12]$/, '') ?? '';
  const SceneComponent = SCENE_COMPONENTS[baseKey] ?? null;

  // Notify parent of scene changes
  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Sync muted prop imperatively (avoids autoplay policy issues)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    if (!muted) el.play().catch(() => {});
  }, [muted]);

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0D1929' }}
    >
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/composite_audio.mp3`}
        muted={muted}
        autoPlay
        loop
      />
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
