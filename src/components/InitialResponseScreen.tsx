import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import type { QueryData } from '../App';

interface InitialResponseScreenProps {
  queryData: QueryData;
  onContinue: () => void;
}

export default function InitialResponseScreen({ queryData, onContinue }: InitialResponseScreenProps) {
  const [initialResult, setInitialResult] = useState<string | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Simulate first API call after 2 seconds
    const timer = setTimeout(() => {
      setInitialResult(
        "Initial analysis indicates significant environmental patterns in your selected region. " +
        "We've detected notable variations in key ecological indicators over the specified timeframe. " +
        "Our comprehensive analysis is processing additional parameters to provide you with detailed insights."
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialResult) {
      // Show continue button after result is displayed
      const timer = setTimeout(() => {
        setShowContinue(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [initialResult]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      {/* Query Display */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 mb-8 text-center"
      >
        <h2 className="font-serif text-2xl text-nature-800 mb-2">
          {queryData.query}
        </h2>
        <p className="text-nature-600 text-sm">
          Location: {queryData.location.lat.toFixed(4)}, {queryData.location.lng.toFixed(4)}
        </p>
      </motion.div>

      {/* Loading or Result */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        {!initialResult ? (
          <div className="glass-card p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 border-4 border-nature-200 rounded-full"
                  style={{ borderTopColor: 'var(--nature-500)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-nature-600">Analyzing environmental data...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <p className="text-nature-800 leading-relaxed">{initialResult}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Continue Button */}
      {showContinue && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onContinue}
          className="btn-primary mt-8 flex items-center gap-2"
        >
          View Detailed Analysis
          <IconArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  );
} 