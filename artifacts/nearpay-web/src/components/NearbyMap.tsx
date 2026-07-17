import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, ExternalLink } from 'lucide-react';
import { DiscoverableMerchant } from '../types';
import { useT } from '../contexts/LanguageContext';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', stylers: [{ color: '#d0e8f5' }] },
  { featureType: 'landscape', stylers: [{ color: '#f5f7fa' }] },
];

const CONTAINER_STYLE = { width: '100%', height: '100%' };

interface NearbyMapProps {
  userCoords: { lat: number; lng: number } | null;
  merchants: DiscoverableMerchant[];
  onMerchantClick: (m: DiscoverableMerchant) => void;
}

function NoKeyPlaceholder() {
  const t = useT();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-secondary/30">
      <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
        <MapPin size={28} className="text-primary/50" />
      </div>
      <div className="text-center px-6">
        <p className="font-bold text-foreground text-sm">{t('map_not_available')}</p>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          {t('configure_maps_key')}
        </p>
      </div>
    </div>
  );
}

export const NearbyMap: React.FC<NearbyMapProps> = ({ userCoords, merchants, onMerchantClick }) => {
  const [selected, setSelected] = React.useState<DiscoverableMerchant | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_KEY ?? '',
    id: 'nearpay-google-map',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const center = userCoords ?? { lat: 24.7136, lng: 46.6753 }; // Default: Riyadh

  if (!MAPS_KEY) return <NoKeyPlaceholder />;
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/30">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      center={center}
      zoom={14}
      onLoad={onLoad}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: 'greedy',
      }}
    >
      {/* User location marker */}
      {userCoords && (
        <Marker
          position={userCoords}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#20D6C7',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
          title="You"
          zIndex={1000}
        />
      )}

      {/* Merchant markers */}
      {merchants.map((m) => {
        if (!m.latitude || !m.longitude) return null;
        return (
          <Marker
            key={m.id}
            position={{ lat: m.latitude, lng: m.longitude }}
            title={m.businessName || m.name}
            onClick={() => setSelected(m)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: '#0B2341',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        );
      })}

      {/* Info window on tap */}
      {selected && selected.latitude && selected.longitude && (
        <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="font-sans min-w-[140px]">
            <p className="font-bold text-gray-900 text-sm leading-tight">
              {selected.businessName || selected.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{selected.businessType}</p>
            <button
              onClick={() => { setSelected(null); onMerchantClick(selected); }}
              className="mt-2 flex items-center gap-1 text-xs font-bold text-teal hover:underline"
              style={{ color: '#20D6C7' }}
            >
              <ExternalLink size={11} /> View Profile
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
