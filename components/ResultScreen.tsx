'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreMeter from './ScoreMeter';
import ShareCertificate from './ShareCertificate';
import { Scores, SCORE_METRICS } from '@/lib/gameData';
import { determineArchetype, isWinningOutcome, ARCHETYPES } from '@/lib/archetypes';
import { usePlayerContext } from '@/lib/playerContext';
import { useConfetti } from '@/lib/useConfetti';
import Image from 'next/image';

interface ResultScreenProps {
  scores: Scores;
  choices: ('A' | 'B')[];
  userAvatarUrl?: string;
  onReset: () => void;
  onViewDashboard: () => void;
}

export default function ResultScreen({ scores, choices, userAvatarUrl, onReset, onViewDashboard }: ResultScreenProps) {
  const archetype = determineArchetype(scores);
  const isWinner = isWinningOutcome(scores);
  const { players, currentPlayer } = usePlayerContext();
  const selfArchetype = currentPlayer?.selfArchetypeId
    ? ARCHETYPES.find((a) => a.id === currentPlayer.selfArchetypeId)
    : null;

  const hasMultiplePlayers = players.length > 1;
  const [showCertificate, setShowCertificate] = useState(false);
  const { fireSuccess, fireStars } = useConfetti();

  useEffect(() => {
    if (isWinner) {
      const timer = setTimeout(() => {
        fireSuccess();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isWinner, fireSuccess]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-3 border-b border-border/30 flex-shrink-0"
      >
        <p className="font-mono text-[9px] text-exl-orange tracking-[0.2em] uppercase mb-0.5">
          Month 12 · Strategy Audit Complete
        </p>
        <h1 className="text-lg font-bold text-white">
          {isWinner ? '🎉 Transformation Complete' : 'Strategy Analysis Complete'}
        </h1>
      </motion.div>

      {/* Main Content - Two Column Layout (stacks on mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Results */}
        <div className="flex-1 p-3 md:p-4 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-4">
            {/* User Info & Choices Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {userAvatarUrl && (
                  <img 
                    src={userAvatarUrl} 
                    alt="You"
                    className="w-10 h-10 rounded-full border-2 border-exl-orange object-cover"
                  />
                )}
                <div>
                  <p className="text-white font-medium text-sm">{currentPlayer?.name || 'Strategist'}</p>
                  <p className="text-white/40 text-xs">{currentPlayer?.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {choices.map((choice, index) => (
                  <span
                    key={index}
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs
                      ${choice === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}
                    `}
                  >
                    {choice}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Scorecard - Compact Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-2">Your Scorecard</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {SCORE_METRICS.map((metric, index) => (
                  <ScoreMeter
                    key={metric.key}
                    label={metric.name}
                    scoreKey={metric.key}
                    value={scores[metric.key]}
                    delay={0.4 + index * 0.05}
                    compact={true}
                  />
                ))}
              </div>
            </motion.div>

            {/* Archetype Result - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface border border-border rounded-xl p-4"
              style={{ borderColor: `${archetype.color}40` }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${archetype.color}20` }}
                >
                  {archetype.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">You Are</p>
                  <h3 className="text-white font-bold text-lg leading-tight">{archetype.name}</h3>
                  <p className="text-white/50 text-xs">{archetype.subtitle}</p>
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mt-3 line-clamp-3">
                {archetype.diagnosis}
              </p>
            </motion.div>

            {/* Self vs Actual Comparison - Compact */}
            {selfArchetype && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-surface/50 border border-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selfArchetype.icon}</span>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase">You Said</p>
                      <p className="text-white text-xs font-medium">{selfArchetype.name.replace('The ', '')}</p>
                    </div>
                  </div>
                  <div className="text-white/30">→</div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase text-right">Reality</p>
                      <p className="text-white text-xs font-medium">{archetype.name.replace('The ', '')}</p>
                    </div>
                    <span className="text-lg">{archetype.icon}</span>
                  </div>
                  <div className="ml-2">
                    {selfArchetype.id === archetype.id ? (
                      <span className="text-green-400 text-lg">✓</span>
                    ) : (
                      <span className="text-amber-400 text-lg">!</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 pt-2"
            >
              <button onClick={onReset} className="btn-primary text-sm py-2 px-4">
                Play Again
              </button>
              <button
                onClick={() => {
                  fireStars();
                  setShowCertificate(true);
                }}
                className="btn-secondary text-sm py-2 px-4"
              >
                Certificate
              </button>
              {hasMultiplePlayers && (
                <button onClick={onViewDashboard} className="btn-secondary text-sm py-2 px-4">
                  Analytics
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Column - Infographic (hidden on mobile, shown at bottom on tablet, side on desktop) */}
        {archetype.infographicImage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden sm:flex w-full lg:w-[45%] flex-shrink-0 p-3 md:p-4 border-t lg:border-t-0 lg:border-l border-border/30 items-center justify-center"
          >
            <div 
              className="relative w-full h-64 sm:h-80 lg:h-full lg:max-h-[500px] rounded-xl overflow-hidden border-2"
              style={{ 
                borderColor: `${archetype.color}50`,
                boxShadow: `0 0 40px ${archetype.color}20`
              }}
            >
              <Image
                src={archetype.infographicImage}
                alt={`${archetype.name} Leadership Profile`}
                fill
                className="object-contain bg-black/20"
                priority
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Bottom label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xl p-1.5 rounded-lg"
                    style={{ backgroundColor: `${archetype.color}30` }}
                  >
                    {archetype.icon}
                  </span>
                  <div>
                    <p className="text-white font-semibold text-sm">{archetype.name}</p>
                    <p className="text-white/60 text-[10px]">{archetype.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <ShareCertificate
            playerName={currentPlayer?.name || 'Strategist'}
            archetype={archetype}
            scores={scores}
            isWinner={isWinner}
            avatarUrl={userAvatarUrl}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
