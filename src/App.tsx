import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Place, GuessCoordinates, RoundResult, MatchRecord, LiveFeedData } from './types';
import { PLACES_BANK } from './data/places';
import { calculateDistanceKm, calculatePoints } from './utils/geo';
import { sound } from './utils/sound';
import {
  probeLiveEndpoints,
  loadPlaceLiveFeed,
} from './services/apiService';

import { Header } from './components/Header';
import { ClueDossier } from './components/ClueDossier';
import { WorldMap } from './components/WorldMap';
import { RoundFeedback } from './components/RoundFeedback';
import { JsonRecordViewer } from './components/JsonRecordViewer';
import { MatchSummaryModal } from './components/MatchSummaryModal';
import { PlaceAuthoringModal } from './components/PlaceAuthoringModal';
import { HelpModal } from './components/HelpModal';

const TOTAL_ROUNDS = 5;

// Shuffles an array randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  // Game session states
  const [placeQueue, setPlaceQueue] = useState<Place[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [revealedCluesCount, setRevealedCluesCount] = useState<number>(1);
  const [userGuess, setUserGuess] = useState<GuessCoordinates | null>(null);
  const [isGuessed, setIsGuessed] = useState<boolean>(false);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [completedRounds, setCompletedRounds] = useState<RoundResult[]>([]);

  // Live feed & network probe states
  const [liveFeedStatus, setLiveFeedStatus] = useState<'online' | 'bundled' | 'probing' | 'error'>('probing');
  const [currentLiveFeed, setCurrentLiveFeed] = useState<LiveFeedData>({ loading: true });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showAuthoringModal, setShowAuthoringModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);

  // Initialize new match
  const startNewMatch = useCallback(() => {
    const shuffled = shuffleArray(PLACES_BANK);
    setPlaceQueue(shuffled);
    setCurrentRoundIndex(0);
    setRevealedCluesCount(1);
    setUserGuess(null);
    setIsGuessed(false);
    setCompletedRounds([]);
    setShowSummaryModal(false);
    setRoundStartTime(Date.now());
  }, []);

  // Probe live APIs on mount
  useEffect(() => {
    let isMounted = true;
    startNewMatch();

    probeLiveEndpoints().then((res) => {
      if (isMounted) {
        setLiveFeedStatus(res.overallStatus);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [startNewMatch]);

  const currentPlace: Place = placeQueue[currentRoundIndex] || PLACES_BANK[0];

  // Load place live data (Wikipedia summary + Openverse photo + OpenLibrary books)
  useEffect(() => {
    if (!currentPlace) return;
    let isMounted = true;
    setCurrentLiveFeed({ loading: true });

    loadPlaceLiveFeed(currentPlace).then((data) => {
      if (isMounted) {
        setCurrentLiveFeed(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentPlace]);

  // Handle probe button in header
  const handleProbe = () => {
    setLiveFeedStatus('probing');
    probeLiveEndpoints().then((res) => {
      setLiveFeedStatus(res.overallStatus);
    });
  };

  // Sound toggle
  const handleToggleSound = () => {
    const newState = sound.toggleMute();
    setSoundEnabled(newState);
  };

  // Select guess pin on map
  const handleSelectGuess = (coords: GuessCoordinates) => {
    if (isGuessed) return;
    setUserGuess(coords);
    sound.playPinDrop();
  };

  // Reveal next progressive clue
  const handleRevealNextClue = () => {
    if (revealedCluesCount < 3) {
      setRevealedCluesCount((prev) => prev + 1);
    }
  };

  // Lock in guess
  const handleLockIn = () => {
    if (!userGuess || isGuessed) return;

    sound.playLockIn();
    const distanceKm = calculateDistanceKm(
      userGuess.lat,
      userGuess.lon,
      currentPlace.lat,
      currentPlace.lon
    );
    const points = calculatePoints(distanceKm);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - roundStartTime) / 1000));

    sound.playRevealScore(points);

    const result: RoundResult = {
      round: currentRoundIndex + 1,
      place: {
        name: currentPlace.name,
        country: currentPlace.country,
        lat: currentPlace.lat,
        lon: currentPlace.lon,
        wikipediaTitle: currentPlace.wikipediaTitle,
      },
      guess: {
        lat: userGuess.lat,
        lon: userGuess.lon,
      },
      distance_km: distanceKm,
      points,
      seconds: elapsedSeconds,
      cluesRevealedCount: revealedCluesCount,
      usedLiveFeed: liveFeedStatus === 'online',
    };

    setCompletedRounds((prev) => [...prev, result]);
    setIsGuessed(true);
  };

  // Next round or show match summary
  const handleNextRound = () => {
    if (currentRoundIndex + 1 >= TOTAL_ROUNDS) {
      setShowSummaryModal(true);
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
      setRevealedCluesCount(1);
      setUserGuess(null);
      setIsGuessed(false);
      setRoundStartTime(Date.now());
    }
  };

  // Live Match Record JSON Payload
  const matchRecord: MatchRecord = useMemo(() => {
    const totalScore = completedRounds.reduce((acc, r) => acc + r.points, 0);
    const maxPossible = TOTAL_ROUNDS * 5000;
    const avgDistance =
      completedRounds.length > 0
        ? Math.round(
            (completedRounds.reduce((acc, r) => acc + r.distance_km, 0) /
              completedRounds.length) *
              10
          ) / 10
        : 0;

    const accuracyPct =
      completedRounds.length > 0
        ? Math.round((totalScore / (completedRounds.length * 5000)) * 1000) / 10
        : 0;

    const isMatchComplete = completedRounds.length === TOTAL_ROUNDS;

    return {
      game: 'RGOGC',
      version: '1.0',
      generated_at: new Date().toISOString(),
      data_sources: [
        'en.wikipedia.org/api/rest_v1/page/summary',
        'api.openverse.org/v1/images',
        'openlibrary.org/search.json',
        'nominatim.openstreetmap.org',
        'photon.komoot.io',
        'bundled-place-bank',
      ],
      live_feed: liveFeedStatus,
      scoring: {
        formula: '5000 * exp(-distance_km / 1500)',
        bullseye_radius_km: 25,
        max_per_round: 5000,
      },
      rounds_played: completedRounds.length,
      total_rounds: TOTAL_ROUNDS,
      rounds: completedRounds,
      totals: {
        score: totalScore,
        max_possible: maxPossible,
        accuracy_pct: accuracyPct,
        avg_error_km: avgDistance,
      },
      status: isMatchComplete ? 'complete' : 'in_progress',
    };
  }, [completedRounds, liveFeedStatus]);

  const totalScore = matchRecord.totals.score;

  return (
    <div className="min-h-screen bg-indigo-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Header with stats, audio toggle, and live feed probe */}
      <Header
        round={currentRoundIndex + 1}
        totalRounds={TOTAL_ROUNDS}
        totalScore={totalScore}
        maxScore={TOTAL_ROUNDS * 5000}
        liveFeedStatus={liveFeedStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onProbeLiveFeed={handleProbe}
        onOpenSchema={() => {
          // Scroll to JSON viewer
          const el = document.getElementById('json-telemetry-panel');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuthoring={() => setShowAuthoringModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onResetMatch={startNewMatch}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Target Dossier & Clues (4.5 cols on desktop) */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4">
            <ClueDossier
              place={currentPlace}
              liveFeedData={currentLiveFeed}
              revealedCluesCount={revealedCluesCount}
              onRevealNextClue={handleRevealNextClue}
              isGuessed={isGuessed}
            />
          </div>

          {/* Right Column: World Map & Round Feedback (8 cols on desktop) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            <WorldMap
              currentPlace={currentPlace}
              userGuess={userGuess}
              onSelectGuess={handleSelectGuess}
              isGuessed={isGuessed}
              onLockIn={handleLockIn}
            />

            {/* Post-Guess Score & Distance Feedback Card */}
            {isGuessed && userGuess && (
              <RoundFeedback
                round={currentRoundIndex + 1}
                totalRounds={TOTAL_ROUNDS}
                place={currentPlace}
                userGuess={userGuess}
                onNextRound={handleNextRound}
                isLastRound={currentRoundIndex + 1 >= TOTAL_ROUNDS}
              />
            )}
          </div>
        </div>

        {/* Live Match Record & JSON Schema Panel */}
        <div id="json-telemetry-panel" className="pt-2">
          <JsonRecordViewer matchRecord={matchRecord} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-900/60 bg-indigo-950 py-5 px-4 text-center text-xs text-indigo-300 font-bold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>RGOGC — Random Geography Open-data Guessing Challenge</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-400">
            <span>Wikipedia REST CC BY-SA</span>
            <span>·</span>
            <span>Openverse CC</span>
            <span>·</span>
            <span>OpenLibrary</span>
            <span>·</span>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showSummaryModal && (
        <MatchSummaryModal
          matchRecord={matchRecord}
          onPlayAgain={startNewMatch}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {showAuthoringModal && (
        <PlaceAuthoringModal
          onClose={() => setShowAuthoringModal(false)}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
