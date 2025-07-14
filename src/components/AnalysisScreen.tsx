import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowLeft, IconChartLine, IconFileText, IconBulb } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { QueryData, AnalysisData } from '../App';

interface AnalysisScreenProps {
  queryData: QueryData;
  analysisData: AnalysisData;
  onBack: () => void;
}

type Tab = 'charts' | 'summary' | 'suggestions';

export default function AnalysisScreen({ queryData, analysisData, onBack }: AnalysisScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('charts');

  const tabs = [
    { id: 'charts' as Tab, label: 'Charts', icon: IconChartLine },
    { id: 'summary' as Tab, label: 'Summary', icon: IconFileText },
    { id: 'suggestions' as Tab, label: 'Suggestions', icon: IconBulb },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-nature-800 mb-1">
              {queryData.query}
            </h2>
            <p className="text-nature-600 text-sm">
              Location: {queryData.location.lat.toFixed(4)}, {queryData.location.lng.toFixed(4)}
            </p>
          </div>
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            <IconArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="glass-card p-1 flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
                ${activeTab === id ? 'text-white' : 'text-nature-700 hover:text-nature-900'}`}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-nature-600 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-card p-8 flex-1"
        >
          {activeTab === 'charts' && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData.charts.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis
                    dataKey="name"
                    stroke="#48894f"
                    tick={{ fill: '#48894f' }}
                  />
                  <YAxis
                    stroke="#48894f"
                    tick={{ fill: '#48894f' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#48894f"
                    strokeWidth={2}
                    dot={{ fill: '#48894f', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="prose prose-nature max-w-none">
              <p className="text-nature-800 leading-relaxed text-lg">
                {analysisData.summary}
              </p>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {analysisData.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-nature-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-nature-600 font-medium">{index + 1}</span>
                  </div>
                  <p className="text-nature-800">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 