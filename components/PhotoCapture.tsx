'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoCaptureProps {
  onCapture: (photoDataUrl: string, avatarDataUrl?: string) => void;
  onSkip?: () => void;
  generateAvatar?: boolean;
}

export default function PhotoCapture({ onCapture, onSkip, generateAvatar = true }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions or skip this step.');
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [capturePhoto]);

  const retake = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const generateAvatarFromPhoto = useCallback(async (photoDataUrl: string): Promise<string | undefined> => {
    try {
      setIsGeneratingAvatar(true);
      setAvatarProgress('Preparing your photo...');
      
      // Convert data URL to blob
      const response = await fetch(photoDataUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');
      
      setAvatarProgress('AI is creating your avatar...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      try {
        const apiResponse = await fetch('/api/generate-avatar', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!apiResponse.ok) {
          console.warn('Avatar API returned error status:', apiResponse.status);
          setAvatarProgress('Using original photo...');
          return undefined;
        }
        
        const result = await apiResponse.json();
        
        if (result.success && result.avatarUrl) {
          setAvatarProgress('Avatar ready!');
          return result.avatarUrl;
        } else {
          console.warn('Avatar generation failed:', result.error);
          setAvatarProgress('Using original photo...');
          return undefined;
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
          console.warn('Avatar generation timed out');
          setAvatarProgress('Timed out, using original photo...');
        } else {
          throw fetchErr;
        }
        return undefined;
      }
    } catch (err) {
      console.error('Avatar generation error:', err);
      setAvatarProgress('Using original photo...');
      return undefined;
    } finally {
      setIsGeneratingAvatar(false);
    }
  }, []);

  const confirmPhoto = useCallback(async () => {
    if (!capturedPhoto) return;
    
    try {
      let avatarUrl: string | undefined;
      
      if (generateAvatar) {
        avatarUrl = await generateAvatarFromPhoto(capturedPhoto);
      }
      
      // Small delay to ensure UI updates complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Calling onCapture with photo and avatar:', { 
        hasPhoto: !!capturedPhoto, 
        hasAvatar: !!avatarUrl 
      });
      
      onCapture(capturedPhoto, avatarUrl);
    } catch (err) {
      console.error('Error in confirmPhoto:', err);
      // Still proceed with just the photo if avatar generation fails
      onCapture(capturedPhoto, undefined);
    }
  }, [capturedPhoto, generateAvatar, generateAvatarFromPhoto, onCapture]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-border bg-surface">
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Loading state */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-exl-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-white/50 text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-white/50 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Video preview */}
        {!capturedPhoto && !error && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}

        {/* Captured photo */}
        {capturedPhoto && (
          <img
            src={capturedPhoto}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-6xl font-bold text-white"
              >
                {countdown}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar generation overlay */}
        <AnimatePresence>
          {isGeneratingAvatar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="text-center p-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1, repeat: Infinity },
                  }}
                  className="w-12 h-12 mx-auto mb-3"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-exl-orange/30" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-exl-orange" />
                  </svg>
                </motion.div>
                <motion.p
                  key={avatarProgress}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/80 text-sm font-medium"
                >
                  {avatarProgress}
                </motion.p>
                <p className="text-white/40 text-xs mt-1">Powered by Gemini AI</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Capture frame guide */}
        {!capturedPhoto && !isLoading && !error && (
          <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!capturedPhoto ? (
          <>
            <motion.button
              onClick={startCountdown}
              disabled={isLoading || !!error || countdown !== null}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-2.5 rounded-xl font-medium text-sm
                bg-exl-orange text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              `}
            >
              {countdown !== null ? 'Get Ready...' : '📸 Take Photo'}
            </motion.button>
            {onSkip && (
              <motion.button
                onClick={onSkip}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl font-medium text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Skip
              </motion.button>
            )}
          </>
        ) : (
          <>
            <motion.button
              onClick={retake}
              disabled={isGeneratingAvatar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-xl font-medium text-sm text-white/70 border border-border hover:border-white/30 transition-colors disabled:opacity-50"
            >
              Retake
            </motion.button>
            <motion.button
              onClick={confirmPhoto}
              disabled={isGeneratingAvatar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-xl font-medium text-sm bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              {isGeneratingAvatar ? 'Generating...' : '✓ Use This Photo'}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
