'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Archetype } from '@/lib/archetypes';
import { Scores, SCORE_METRICS } from '@/lib/gameData';

interface ShareCertificateProps {
  playerName: string;
  archetype: Archetype;
  scores: Scores;
  isWinner: boolean;
  avatarUrl?: string;
  onClose: () => void;
}

export default function ShareCertificate({
  playerName,
  archetype,
  scores,
  isWinner,
  avatarUrl,
  onClose,
}: ShareCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0A0A0F',
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `EXL-AI-Strategy-${playerName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    }
  }, [playerName]);

  const handleShare = useCallback(async () => {
    const shareText = `I just completed the EXL AI Org Board Challenge! 🎯\n\nMy Leadership Archetype: ${archetype.name}\n${isWinner ? '✅ Successfully achieved the 12-month transformation!' : '📊 Learned valuable AI strategy insights!'}\n\n#AIStrategy #Leadership #EXL`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EXL AI Org Board Challenge Results',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  }, [archetype, isWinner]);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full"
      >
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-[#0A0A0F] via-[#111118] to-[#0A0A0F] rounded-2xl border-2 border-exl-orange/30 p-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-exl-orange/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-exl-orange/5 rounded-full blur-3xl" />
          
          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-exl-orange/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-exl-orange/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-exl-orange/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-exl-orange/40" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-exl-orange font-bold text-2xl tracking-tight">EXL</span>
                <span className="text-white/30">|</span>
                <span className="text-white/60 text-sm">AI Strategy Simulation</span>
              </div>
              <h2 className="text-xs font-mono text-white/40 uppercase tracking-[0.3em]">
                Certificate of Completion
              </h2>
            </div>

            {/* Main Content */}
            <div className="flex items-center gap-6 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {avatarUrl ? (
                  <div className="w-24 h-24 rounded-full border-4 border-exl-orange/50 overflow-hidden shadow-[0_0_30px_rgba(242,101,34,0.3)]">
                    <img src={avatarUrl} alt={playerName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-exl-orange/20 flex items-center justify-center border-4 border-exl-orange/50">
                    <span className="text-4xl font-bold text-exl-orange">
                      {playerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">This certifies that</p>
                <h3 className="text-2xl font-bold text-white mb-2">{playerName}</h3>
                <p className="text-white/60 text-sm">
                  has successfully completed the AI Org Board Challenge
                  <br />
                  on {formatDate()}
                </p>
              </div>
            </div>

            {/* Archetype */}
            <div className="bg-surface/50 rounded-xl p-4 mb-4 border border-border">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Leadership Archetype</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{archetype.icon}</span>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: archetype.color }}>
                    {archetype.name}
                  </h4>
                  <p className="text-white/50 text-sm">{archetype.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {SCORE_METRICS.map((metric) => (
                <div key={metric.key} className="bg-surface/30 rounded-lg p-2 text-center">
                  <p className="text-exl-orange font-mono text-xs font-bold">{metric.key}</p>
                  <p className="text-white font-bold">
                    {scores[metric.key] > 0 ? '+' : ''}{scores[metric.key]}
                  </p>
                </div>
              ))}
            </div>

            {/* Status Badge */}
            <div className="text-center">
              {isWinner ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-green-400 font-bold text-sm">
                    Transformation Target Achieved
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/60 text-sm">
                    Strategy Simulation Completed
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-exl-orange text-white font-medium text-sm hover:bg-exl-orange/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </motion.button>
          
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-xl text-white/50 font-medium text-sm hover:text-white/80 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
