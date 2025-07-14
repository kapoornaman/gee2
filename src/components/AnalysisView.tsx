import { useState } from 'react';
import { Box, Tabs, Button, Text, Paper, Title } from '@mantine/core';
import { IconChartLine, IconFileText, IconBulb, IconArrowLeft } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisViewProps {
  data: any;
  onBack: () => void;
}

export function AnalysisView({ data, onBack }: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState<string | null>('chart');

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Back Button */}
        <Button
          leftSection={<IconArrowLeft size={20} />}
          variant="subtle"
          onClick={onBack}
          mb="xl"
        >
          Back to Query
        </Button>

        {/* Main Content */}
        <Paper shadow="sm" radius="md" p="xl">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow mb="xl">
              <Tabs.Tab value="chart" leftSection={<IconChartLine size={20} />}>
                Chart
              </Tabs.Tab>
              <Tabs.Tab value="summary" leftSection={<IconFileText size={20} />}>
                Summary
              </Tabs.Tab>
              <Tabs.Tab value="suggestions" leftSection={<IconBulb size={20} />}>
                Suggestions
              </Tabs.Tab>
            </Tabs.List>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Tabs.Panel value="chart">
                  <Title order={3} mb="md">Environmental Data Trends</Title>
                  <Box style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.charts.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Tabs.Panel>

                <Tabs.Panel value="summary">
                  <Title order={3} mb="md">Analysis Summary</Title>
                  <Text size="lg" mb="md">
                    {data.summary}
                  </Text>
                  <Text color="dimmed">
                    Location: {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
                  </Text>
                  <Text color="dimmed">
                    Query: "{data.query}"
                  </Text>
                </Tabs.Panel>

                <Tabs.Panel value="suggestions">
                  <Title order={3} mb="md">Recommendations</Title>
                  {data.suggestions.map((suggestion: string, index: number) => (
                    <Paper
                      key={index}
                      shadow="sm"
                      p="md"
                      mb="md"
                      style={{
                        borderLeft: '4px solid #8884d8',
                      }}
                    >
                      <Text size="lg">{suggestion}</Text>
                    </Paper>
                  ))}
                </Tabs.Panel>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </Paper>
      </Box>
    </motion.div>
  );
} 