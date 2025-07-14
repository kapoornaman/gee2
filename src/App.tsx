import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import QueryScreen from './components/QueryScreen';
import InitialResponseScreen from './components/InitialResponseScreen';
import AnalysisScreen from './components/AnalysisScreen';

export type QueryData = {
  query: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type AnalysisData = {
  charts: {
    data: Array<{ name: string; value: number }>;
  };
  summary: string;
  suggestions: string[];
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<'query' | 'initial' | 'analysis'>('query');
  const [queryData, setQueryData] = useState<QueryData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleQuerySubmit = (data: QueryData) => {
    setQueryData(data);
    setCurrentScreen('initial');
    
    // Simulate second API call immediately
    setTimeout(() => {
      setAnalysisData({
        charts: {
          data: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
            { name: 'Apr', value: 800 },
          ]
        },
        summary: "Our analysis shows significant variations in environmental parameters over the past months. The data indicates a positive trend in sustainability metrics, with notable improvements in air quality and biodiversity indicators.",
        suggestions: [
          "Implement water conservation measures during peak usage hours",
          "Consider expanding green spaces to improve air quality",
          "Monitor and reduce carbon emissions through alternative energy sources"
        ]
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {currentScreen === 'query' && (
          <QueryScreen 
            key="query"
            onSubmit={handleQuerySubmit}
          />
        )}
        {currentScreen === 'initial' && queryData && (
          <InitialResponseScreen
            key="initial"
            queryData={queryData}
            onContinue={() => setCurrentScreen('analysis')}
          />
        )}
        {currentScreen === 'analysis' && queryData && analysisData && (
          <AnalysisScreen
            key="analysis"
            queryData={queryData}
            analysisData={analysisData}
            onBack={() => setCurrentScreen('initial')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
