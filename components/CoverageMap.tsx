import React, { useState, useEffect, useRef } from 'react';
import { COUNTRIES, Country } from '../data/countries';
import { WifiIcon } from './icons';
import L from 'leaflet';

// --- Helper Functions ---

// Function to generate a random point within a radius of a center coordinate
const generateRandomPoint = (center: { lat: number, lng: number }, radius: number) => {
  const x0 = center.lng;
  const y0 = center.lat;
  const rd = radius / 111300; // about 111300 meters in one degree
  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return { lat: y + y0, lng: x + x0 };
};

// --- Component ---

export const CoverageMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [polygons, setPolygons] = useState<Record<string, L.Polygon[]>>({});
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [visibleProviders, setVisibleProviders] = useState<string[]>([]);
  
  // Set the default icon path for Leaflet markers
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = L.map(mapRef.current).setView([selectedCountry.lat, selectedCountry.lng], selectedCountry.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);
      setMap(newMap);
    }
  }, [mapRef, map, selectedCountry]);

  // Update map center when country changes
  useEffect(() => {
    if (map) {
      map.setView([selectedCountry.lat, selectedCountry.lng], selectedCountry.zoom);
      setVisibleProviders([]); // Reset visible providers
    }
  }, [map, selectedCountry]);
  
  // Generate polygons when map and country are ready
  useEffect(() => {
    if (!map) return;
    
    // Clear old polygons
    // FIX: Replaced .flat() with a nested loop for better compatibility. This resolves a TypeScript error where the polygon type was inferred as 'unknown'.
    // FIX: Add explicit type to `providerPolygons` to fix type inference issue.
    Object.values(polygons).forEach((providerPolygons: L.Polygon[]) => {
      providerPolygons.forEach(p => p.removeFrom(map));
    });

    const newPolygons: Record<string, L.Polygon[]> = {};
    const center = { lat: selectedCountry.lat, lng: selectedCountry.lng };
    const colors = ['#00FF00', '#FFFF00', '#FF0000']; // Strong, Medium, Weak

    selectedCountry.providers.forEach(provider => {
        newPolygons[provider] = [];
        // Simulate a few coverage zones
        for (let i = 0; i < 5; i++) {
             const zoneCenter = generateRandomPoint(center, 500000 / selectedCountry.zoom);
             const radius = (Math.random() * 80000 + 20000) / selectedCountry.zoom; // random radius
             const numSides = 6;
             const paths: L.LatLngExpression[] = [];
             for(let j=0; j < numSides; j++) {
                const angle = (j / numSides) * 2 * Math.PI;
                const lat = zoneCenter.lat + (radius / 111111) * Math.cos(angle);
                const lng = zoneCenter.lng + (radius / (111111 * Math.cos(zoneCenter.lat * Math.PI / 180))) * Math.sin(angle);
                paths.push([lat, lng]);
             }
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const polygon = L.polygon(paths, {
                color: color,
                stroke: true,
                weight: 1,
                opacity: 0.5,
                fillColor: color,
                fillOpacity: 0.25,
            });
            newPolygons[provider].push(polygon);
        }
    });

    setPolygons(newPolygons);

  }, [map, selectedCountry]);

  // Toggle polygon visibility
  useEffect(() => {
    if(!map) return;
    Object.entries(polygons).forEach(([provider, providerPolygons]) => {
      const isVisible = visibleProviders.includes(provider);
      // FIX: Cast providerPolygons to L.Polygon[] to resolve a type inference issue with Object.entries.
      (providerPolygons as L.Polygon[]).forEach(p => {
          if(isVisible) {
              p.addTo(map);
          } else {
              p.removeFrom(map);
          }
      });
    });
  }, [visibleProviders, polygons, map]);

  const handleProviderToggle = (provider: string) => {
    setVisibleProviders(prev => 
        prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  return (
    <div className="animate-slide-in">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
                <label htmlFor="country-select" className="font-semibold text-neutral-700 mb-1 block">Select Region</label>
                <select
                    id="country-select"
                    value={selectedCountry.code}
                    onChange={(e) => setSelectedCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])}
                    className="w-full p-2 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-primary"
                >
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex-shrink-0">
                <h3 className="font-semibold text-neutral-700 mb-1">Toggle Providers</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedCountry.providers.map(provider => (
                        <button 
                            key={provider}
                            onClick={() => handleProviderToggle(provider)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${visibleProviders.includes(provider) ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'}`}
                        >
                            {provider}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      
      <div className="bg-neutral-200 rounded-lg h-96 md:h-[600px] w-full" ref={mapRef}>
        {!map && (
            <div className="flex items-center justify-center h-full text-neutral-500">
                <WifiIcon className="w-8 h-8 mr-2 animate-pulse-fast"/>
                Loading Map...
            </div>
        )}
      </div>
    </div>
  );
};
