'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerProvider, usePlayerContext } from '@/lib/playerContext';
import RegistrationScreen from '@/components/RegistrationScreen';
import IntroScreen from '@/components/IntroScreen';
import GameScreen from '@/components/GameScreen';
import ResultScreen from '@/components/ResultScreen';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import MonthTimeline from '@/components/MonthTimeline';
import InfographicSidebar from '@/components/InfographicSidebar';
import ArchetypeReveal from '@/components/ArchetypeReveal';
import EXLLogo from '@/components/EXLLogo';
import { LEVELS, INITIAL_SCORES, Scores, calculateScores, generateVariantIndices } from '@/lib/gameData';
import { determineArchetype, Archetype } from '@/lib/archetypes';
import { Level } from '@/lib/types';

type Phase = 'registration' | 'intro' | 'game' | 'calculating' | 'result' | 'dashboard';

const contentTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

function GameContent() {
  const [phase, setPhase] = useState<Phase>('registration');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState<('A' | 'B')[]>([]);
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [variantIndices, setVariantIndices] = useState<{ A: number; B: number }[]>(() => generateVariantIndices());
  
  const { setCurrentPlayer, addPlayer, currentPlayer, clearCurrentPlayer, updateCurrentPlayerAvatar } = usePlayerContext();

  const handleRegister = useCallback((name: string, level: Level, photoUrl?: string, avatarUrl?: string, selfArchetypeId?: string) => {
    setCurrentPlayer(name, level, photoUrl, selfArchetypeId);
    if (avatarUrl) {
      updateCurrentPlayerAvatar(avatarUrl);
    }
    setPhase('intro');
  }, [setCurrentPlayer, updateCurrentPlayerAvatar]);

  const handleStart = useCallback(() => {
    setPhase('game');
  }, []);

  const handleChoice = useCallback((choice: 'A' | 'B') => {
    setCurrentSelectedChoice(choice);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSelectedChoice === null) return;
    
    // Add choice to array and calculate scores
    const newChoices = [...choices, currentSelectedChoice];
    setChoices(newChoices);
    setScores(calculateScores(newChoices));
    
    // Reset selected choice
    setCurrentSelectedChoice(null);
    
    // Move to next level or end game
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      const finalScores = calculateScores(newChoices);
      const archetype = determineArchetype(finalScores);
      setFinalArchetype(archetype);
      setPhase('calculating');
    }
  }, [currentLevel, choices, currentSelectedChoice]);

  const handleUndo = useCallback(() => {
    if (choices.length > 0) {
      const newChoices = choices.slice(0, -1);
      setChoices(newChoices);
      setScores(calculateScores(newChoices));
      setCurrentLevel(Math.max(0, currentLevel - 1));
      setCurrentSelectedChoice(null);
    }
  }, [choices, currentLevel]);

  const handleCalculationComplete = useCallback(() => {
    const finalScores = calculateScores(choices);
    const archetype = determineArchetype(finalScores);
    
    if (currentPlayer) {
      addPlayer({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: currentPlayer.name,
        level: currentPlayer.level,
        scores: finalScores,
        archetype: archetype.id,
        selfArchetypeId: currentPlayer.selfArchetypeId,
        choices: choices,
        completedAt: new Date(),
        photoUrl: currentPlayer.photoUrl,
        avatarUrl: currentPlayer.avatarUrl,
      });
    }
    
    setPhase('result');
  }, [choices, currentPlayer, addPlayer]);

  const handleViewDashboard = useCallback(() => {
    setPhase('dashboard');
  }, []);

  const handleBackToResults = useCallback(() => {
    setPhase('result');
  }, []);

  const handleReset = useCallback(() => {
    setPhase('registration');
    setCurrentLevel(0);
    setChoices([]);
    setScores(INITIAL_SCORES);
    setFinalArchetype(null);
    setCurrentSelectedChoice(null);
    setVariantIndices(generateVariantIndices()); // Generate new variants for new game
    clearCurrentPlayer();
  }, [clearCurrentPlayer]);

  const showHeader = phase === 'game' || phase === 'calculating' || phase === 'result';
  const showSidebar = phase === 'game';

  return (
    <main className="relative h-screen bg-background overflow-hidden flex flex-col">
      <BackgroundOrbs />
      
      {/* Persistent Header with Timeline */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between gap-2 md:gap-8">
                <EXLLogo size="sm" withGlow={false} />
                <div className="flex-1 max-w-2xl hidden sm:block">
                  <MonthTimeline 
                    currentLevel={currentLevel} 
                    completedLevels={choices.length}
                    isComplete={phase === 'result' || phase === 'calculating'}
                  />
                </div>
                {/* Mobile: Show simple progress indicator */}
                <div className="flex-1 sm:hidden text-center">
                  <span className="text-xs text-white/60 font-mono">
                    {phase === 'result' || phase === 'calculating' ? 'Complete' : `${currentLevel + 1}/5`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {currentPlayer && (
                    <>
                      {currentPlayer.avatarUrl || currentPlayer.photoUrl ? (
                        <img 
                          src={currentPlayer.avatarUrl || currentPlayer.photoUrl} 
                          alt={currentPlayer.name}
                          className="w-8 h-8 rounded-full border border-exl-orange/50"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-exl-orange/20 flex items-center justify-center text-exl-orange font-bold text-sm">
                          {currentPlayer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar - Infographics */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="hidden md:flex flex-shrink-0 w-80 border-r border-border/50 bg-background/50 backdrop-blur-sm overflow-y-auto flex-col"
            >
              <InfographicSidebar 
                currentLevelIndex={currentLevel}
                choices={choices}
                selectedChoice={currentSelectedChoice}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === 'registration' && (
              <motion.div key="registration" {...contentTransition} className="h-full">
                <RegistrationScreen onRegister={handleRegister} />
              </motion.div>
            )}

            {phase === 'intro' && (
              <motion.div key="intro" {...contentTransition} className="h-full">
                <IntroScreen onStart={handleStart} />
              </motion.div>
            )}

            {phase === 'game' && (
              <motion.div key={`game-${currentLevel}`} {...contentTransition} className="h-full">
                <GameScreen
                  level={LEVELS[currentLevel]}
                  currentLevelIndex={currentLevel}
                  scores={scores}
                  selectedChoice={currentSelectedChoice}
                  variantIndices={variantIndices[currentLevel]}
                  onChoice={handleChoice}
                  onNext={handleNext}
                  onUndo={handleUndo}
                  onReset={handleReset}
                  canUndo={choices.length > 0}
                />
              </motion.div>
            )}

            {phase === 'calculating' && finalArchetype && (
              <motion.div key="calculating" {...contentTransition} className="h-full">
                <ArchetypeReveal
                  archetype={finalArchetype}
                  userAvatarUrl={currentPlayer?.avatarUrl || currentPlayer?.photoUrl}
                  onComplete={handleCalculationComplete}
                />
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div key="result" {...contentTransition} className="h-full">
                <ResultScreen
                  scores={scores}
                  choices={choices}
                  userAvatarUrl={currentPlayer?.avatarUrl || currentPlayer?.photoUrl}
                  onReset={handleReset}
                  onViewDashboard={handleViewDashboard}
                />
              </motion.div>
            )}

            {phase === 'dashboard' && (
              <motion.div key="dashboard" {...contentTransition} className="h-full">
                <AnalyticsDashboard
                  onBack={handleBackToResults}
                  onPlayAgain={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <GameContent />
    </PlayerProvider>
  );
}
