'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EXLLogo from './EXLLogo';
import PhotoCapture from './PhotoCapture';
import { LEVELS, Level } from '@/lib/types';
import { ARCHETYPES } from '@/lib/archetypes';

interface RegistrationScreenProps {
  onRegister: (name: string, level: Level, photoUrl?: string, avatarUrl?: string, selfArchetypeId?: string) => void;
}

type Step = 'details' | 'photo';

export default function RegistrationScreen({ onRegister }: RegistrationScreenProps) {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<Level | ''>('');
  const [selfArchetypeId, setSelfArchetypeId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDetailsSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!level) {
      setError('Please select your level');
      return;
    }
    setStep('photo');
  };

  const handlePhotoCapture = (photoDataUrl: string, avatarDataUrl?: string) => {
    console.log('RegistrationScreen handlePhotoCapture called', { 
      name: name.trim(), 
      level, 
      hasPhoto: !!photoDataUrl, 
      hasAvatar: !!avatarDataUrl 
    });
    
    onRegister(
      name.trim(),
      level as Level,
      photoDataUrl,
      avatarDataUrl,
      selfArchetypeId || undefined
    );
  };

  const handleSkipPhoto = () => {
    onRegister(name.trim(), level as Level, undefined, undefined, selfArchetypeId || undefined);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12"
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <EXLLogo size="lg" />
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <p className="text-exl-orange font-mono text-xs tracking-[0.3em] uppercase mb-2">
            AI Strategy Simulation
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome, Strategist
          </h1>
          <p className="text-white/50">
            {step === 'details' && 'Enter your details to begin the challenge'}
            {step === 'photo' && 'Capture your photo for AI avatar generation'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Name and Level */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface border border-border rounded-2xl p-6 space-y-6"
            >
              {/* Name Input */}
              <div>
                <label className="block text-white/50 font-mono text-xs uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white placeholder-white/30 focus:border-exl-orange focus:outline-none transition-colors"
                />
              </div>

              {/* Level Selection */}
              <div>
                <label className="block text-white/50 font-mono text-xs uppercase tracking-wider mb-2">
                  Your Level
                </label>
                <select
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value as Level);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:border-exl-orange focus:outline-none transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F26522'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                  }}
                >
                  <option value="" className="bg-background">Select your level</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l} className="bg-background">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Self-Identified Archetype */}
              <div>
                <label className="block text-white/50 font-mono text-xs uppercase tracking-wider mb-2">
                  Your Archetype (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ARCHETYPES.map((a) => {
                    const isSelected = selfArchetypeId === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelfArchetypeId(isSelected ? null : a.id)}
                        className={`
                          p-3 rounded-xl border text-left transition-all duration-200
                          ${isSelected
                            ? 'bg-exl-orange/10 border-exl-orange text-white shadow-[0_0_20px_rgba(242,101,34,0.2)]'
                            : 'bg-background border-border text-white/60 hover:border-exl-orange/40'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{a.icon}</span>
                          <span className="text-sm font-semibold">
                            {a.name.replace('The ', '')}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40">{a.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-white/30 text-xs mt-2">
                  Choose how you see yourself now. We&apos;ll compare it to your gameplay result.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                onClick={handleDetailsSubmit}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full text-lg"
              >
                Next: Capture Photo
                <span className="ml-2">→</span>
              </motion.button>

              {/* Skip photo option */}
              <button
                onClick={handleSkipPhoto}
                className="w-full text-center text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Skip photo and continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Photo Capture */}
          {step === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="text-center mb-4">
                <p className="text-white/50 text-sm">
                  Take a photo to personalize your experience
                </p>
              </div>
              
              <PhotoCapture
                onCapture={handlePhotoCapture}
                onSkip={handleSkipPhoto}
                generateAvatar={false}
              />

              {/* Back button */}
              <button
                onClick={() => setStep('details')}
                className="w-full mt-4 text-center text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                ← Back to details
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-white/30 text-sm mt-6"
        >
          Your results will be compared with other participants in your session
        </motion.p>
      </div>
    </motion.div>
  );
}
