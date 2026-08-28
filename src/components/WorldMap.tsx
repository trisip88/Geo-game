import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Place, GuessCoordinates } from '../types';
import {
  WORLD_LAND_PATHS,
  GRATICULE_PARALLELS,
  GRATICULE_MERIDIANS,
} from '../data/worldMapData';
import {
  geoToSvgCoords,
  svgCoordsToGeo,
  formatCoordinates,
  getGreatCircleSvgPath,
  MAP_SVG_WIDTH,
  MAP_SVG_HEIGHT,
} from '../utils/geo';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  MapPin,
  Target,
  Navigation,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface WorldMapProps {
  currentPlace: Place;
  userGuess: GuessCoordinates | null;
  onSelectGuess: (coords: GuessCoordinates) => void;
  isGuessed: boolean;
  onLockIn: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentPlace,
  userGuess,
  onSelectGuess,
  isGuessed,
  onLockIn,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle map click to drop pin
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isGuessed || !svgRef.current) return;

    // Ignore click if user was dragging/panning
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen click into SVG viewBox coordinates accounting for zoom and pan
    const svgX = (clickX / rect.width) * (MAP_SVG_WIDTH / zoom) + pan.x;
    const svgY = (clickY / rect.height) * (MAP_SVG_HEIGHT / zoom) + pan.y;

    const coords = svgCoordsToGeo(svgX, svgY);
    onSelectGuess(coords);
  };

  // Handle Mouse Hover for coordinate readout
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    if (isPanning) {
      const dx = (e.clientX - panStart.x) * (MAP_SVG_WIDTH / (svgRef.current.clientWidth * zoom));
      const dy = (e.clientY - panStart.y) * (MAP_SVG_HEIGHT / (svgRef.current.clientHeight * zoom));
      
      const maxPanX = Math.max(0, MAP_SVG_WIDTH - MAP_SVG_WIDTH / zoom);
      const maxPanY = Math.max(0, MAP_SVG_HEIGHT - MAP_SVG_HEIGHT / zoom);

      setPan((prev) => ({
        x: Math.max(0, Math.min(maxPanX, prev.x - dx)),
        y: Math.max(0, Math.min(maxPanY, prev.y - dy)),
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const svgX = (clickX / rect.width) * (MAP_SVG_WIDTH / zoom) + pan.x;
    const svgY = (clickY / rect.height) * (MAP_SVG_HEIGHT / zoom) + pan.y;

    setHoverCoords(svgCoordsToGeo(svgX, svgY));
  };

  // Keyboard navigation support (Arrow keys move pin, Enter locks in)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isGuessed) return;

      const step = e.shiftKey ? 5 : 1; // 1 degree step or 5 degrees with shift
      let currentLat = userGuess ? userGuess.lat : 0;
      let currentLon = userGuess ? userGuess.lon : 0;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSelectGuess({ lat: Math.min(85, currentLat + step), lon: currentLon });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSelectGuess({ lat: Math.max(-85, currentLat - step), lon: currentLon });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        let newLon = currentLon - step;
        if (newLon < -180) newLon += 360;
        onSelectGuess({ lat: currentLat, lon: newLon });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        let newLon = currentLon + step;
        if (newLon > 180) newLon -= 360;
        onSelectGuess({ lat: currentLat, lon: newLon });
      } else if (e.key === 'Enter' && userGuess) {
        e.preventDefault();
        onLockIn();
      }
    },
    [isGuessed, userGuess, onSelectGuess, onLockIn]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      let next = direction === 'in' ? prev * 1.4 : prev / 1.4;
      next = Math.max(1, Math.min(4, next));
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // ViewBox dynamic calculation
  const viewBoxWidth = MAP_SVG_WIDTH / zoom;
  const viewBoxHeight = MAP_SVG_HEIGHT / zoom;
  const viewBox = `${pan.x} ${pan.y} ${viewBoxWidth} ${viewBoxHeight}`;

  // SVG Coordinates for Guess and True Place
  const guessSvg = userGuess ? geoToSvgCoords(userGuess.lat, userGuess.lon) : null;
  const trueSvg = geoToSvgCoords(currentPlace.lat, currentPlace.lon);

  // Connecting Great-Circle Arc Path
  const arcPath =
    userGuess && isGuessed
      ? getGreatCircleSvgPath(
          userGuess.lat,
          userGuess.lon,
          currentPlace.lat,
          currentPlace.lon
        )
      : null;

  return (
    <div
      ref={containerRef}
      className="bg-sky-200 rounded-[32px] sm:rounded-[40px] relative overflow-hidden border-4 sm:border-8 border-white shadow-2xl flex flex-col"
    >
      {/* Top Map Toolbar / Coordinates HUD */}
      <div className="bg-white/90 backdrop-blur-md border-b-2 border-sky-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap text-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
            <Navigation className="w-4 h-4 text-pink-500 transform -rotate-45" />
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Cursor:</span>
            <span className="text-indigo-900 font-mono font-bold min-w-[130px]">
              {hoverCoords
                ? formatCoordinates(hoverCoords.lat, hoverCoords.lon)
                : 'Hover over map'}
            </span>
          </div>

          {userGuess && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              <span>PIN: {formatCoordinates(userGuess.lat, userGuess.lon)}</span>
            </div>
          )}
        </div>

        {/* Zoom and Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-slate-400 mr-2 uppercase tracking-tight">
            <span>[Arrows] navigate · [Enter] confirm</span>
          </div>

          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            disabled={zoom >= 4}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 flex items-center justify-center shadow-[0_3px_0_#cbd5e1] active:translate-y-0.5 active:shadow-none font-black disabled:opacity-40 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            disabled={zoom <= 1}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 flex items-center justify-center shadow-[0_3px_0_#cbd5e1] active:translate-y-0.5 active:shadow-none font-black disabled:opacity-40 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset Map View"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 flex items-center justify-center shadow-[0_3px_0_#cbd5e1] active:translate-y-0.5 active:shadow-none font-black transition-all"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map SVG Canvas */}
      <div className="relative w-full aspect-[2/1] bg-sky-200 cursor-crosshair select-none overflow-hidden">
        {/* Dot Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#7dd3fc_2px,transparent_2px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-full relative z-0"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => {
            if (e.button === 0 && (e.altKey || zoom > 1)) {
              setIsPanning(true);
              setPanStart({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => {
            setIsPanning(false);
            setHoverCoords(null);
          }}
        >
          {/* Ocean Background Gradient & Defs */}
          <defs>
            <radialGradient id="vibrantOceanGrad" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </radialGradient>

            <filter id="vibrantShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Ocean Plane */}
          <rect width={MAP_SVG_WIDTH} height={MAP_SVG_HEIGHT} fill="url(#vibrantOceanGrad)" />

          {/* Graticule Grid Lines (Latitude Parallels) */}
          {GRATICULE_PARALLELS.map((p) => (
            <g key={p.lat}>
              <line
                x1={0}
                y1={p.y}
                x2={MAP_SVG_WIDTH}
                y2={p.y}
                stroke={p.isEquator ? '#f59e0b' : '#38bdf8'}
                strokeWidth={p.isEquator ? 1.5 : 0.75}
                strokeDasharray={p.isEquator ? 'none' : '4,4'}
                opacity={p.isEquator ? 0.9 : 0.5}
              />
              {/* Latitude Label */}
              <text
                x={12}
                y={p.y - 4}
                fill={p.isEquator ? '#b45309' : '#0284c7'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="sans-serif"
                opacity="0.9"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Graticule Grid Lines (Longitude Meridians) */}
          {GRATICULE_MERIDIANS.map((m) => (
            <g key={m.lon}>
              <line
                x1={m.x}
                y1={0}
                x2={m.x}
                y2={MAP_SVG_HEIGHT}
                stroke={m.isPrimeMeridian ? '#ec4899' : '#38bdf8'}
                strokeWidth={m.isPrimeMeridian ? 1.2 : 0.75}
                strokeDasharray={m.isPrimeMeridian ? 'none' : '4,4'}
                opacity={m.isPrimeMeridian ? 0.8 : 0.5}
              />
              {/* Longitude Label */}
              <text
                x={m.x + 3}
                y={MAP_SVG_HEIGHT - 8}
                fill={m.isPrimeMeridian ? '#be185d' : '#0284c7'}
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
                opacity="0.9"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* World Continents Land Polygons */}
          {WORLD_LAND_PATHS.map((land) => (
            <path
              key={land.id}
              d={land.path}
              fill={land.fill}
              stroke="#ffffff"
              strokeWidth="1.2"
              filter="url(#vibrantShadow)"
              className="transition-all hover:opacity-90"
            />
          ))}

          {/* Dashed Connecting Great-Circle Arc on Guess Reveal */}
          {arcPath && (
            <g>
              <path
                d={arcPath}
                fill="none"
                stroke="#ec4899"
                strokeWidth="3.5"
                strokeDasharray="8,6"
                className="animate-pulse"
              />
            </g>
          )}

          {/* User's Dropped Pin Marker with Speech Bubble */}
          {guessSvg && (
            <g transform={`translate(${guessSvg.x}, ${guessSvg.y})`}>
              {/* Pulsing ring */}
              <circle
                r="18"
                fill="#ec4899"
                fillOpacity="0.3"
                className="animate-ping"
              />
              {/* Pin Head */}
              <circle r="9" fill="#ec4899" stroke="#ffffff" strokeWidth="3" />
              <circle r="3" fill="#ffffff" />

              {/* Playful "IS IT HERE?" speech bubble */}
              <g transform="translate(0, -22)">
                <rect
                  x="-35"
                  y="-12"
                  width="70"
                  height="18"
                  rx="9"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  fill="#312e81"
                  fontSize="9"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  IS IT HERE?
                </text>
              </g>
            </g>
          )}

          {/* True Location Revealed Target Marker */}
          {isGuessed && (
            <g transform={`translate(${trueSvg.x}, ${trueSvg.y})`}>
              {/* Animated emerald pulse */}
              <circle
                r="24"
                fill="#10b981"
                fillOpacity="0.3"
                stroke="#10b981"
                strokeWidth="3"
                className="animate-ping"
              />
              <circle r="10" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
              <circle r="4" fill="#ffffff" />
              
              {/* Target Location Name Card */}
              <g transform="translate(0, 26)">
                <rect
                  x="-75"
                  y="-10"
                  width="150"
                  height="24"
                  rx="12"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  🎯 {currentPlace.name}, {currentPlace.country}
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Lock-In Button Floating Bar */}
        {!isGuessed && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
            <button
              onClick={onLockIn}
              disabled={!userGuess}
              className={`px-8 sm:px-12 py-3.5 sm:py-4 rounded-3xl font-black text-base sm:text-lg tracking-tight transition-all duration-200 flex items-center gap-2.5 ${
                userGuess
                  ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_#9D174D] active:translate-y-1 active:shadow-none cursor-pointer'
                  : 'bg-white/80 backdrop-blur-md text-indigo-900/60 border-2 border-indigo-200 cursor-not-allowed shadow-md'
              }`}
            >
              <Target className={`w-5 h-5 ${userGuess ? 'text-white' : ''}`} />
              <span>{userGuess ? 'CONFIRM GUESS' : 'CLICK MAP TO DROP PIN'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Hint Strip */}
      <div className="bg-white/90 backdrop-blur-md border-t-2 border-sky-200 px-5 py-2.5 text-[11px] font-bold text-indigo-950 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Equirectangular WGS84 Projection</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-amber-600">── Equator</span>
          <span className="text-pink-600">── Prime Meridian</span>
        </div>
      </div>
    </div>
  );
};
