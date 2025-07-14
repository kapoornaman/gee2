import { useState, useEffect } from 'react';
import { Box, TextInput, Button, Text, Paper, Modal, Group, Badge } from '@mantine/core';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { IconMapPin, IconSearch } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

interface QueryViewProps {
  onShowAnalysis: (data: any) => void;
}

const hints = [
  "Rainfall trend in past month",
  "NDVI analysis",
  "Air quality index",
  "Temperature variations",
  "Soil moisture levels"
];

const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export function QueryView({ onShowAnalysis }: QueryViewProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialResult, setInitialResult] = useState<any>(null);

  useEffect(() => {
    // Get user's location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate first API call
    setTimeout(() => {
      setInitialResult({
        summary: "Initial analysis of environmental data...",
        timestamp: new Date().toISOString(),
      });
      
      // Simulate second API call
      setTimeout(() => {
        onShowAnalysis({
          query,
          location,
          charts: {
            data: [
              { name: 'Jan', value: 400 },
              { name: 'Feb', value: 300 },
              { name: 'Mar', value: 600 },
              { name: 'Apr', value: 800 },
            ]
          },
          summary: "Detailed environmental analysis...",
          suggestions: ["Implement water conservation", "Monitor air quality", "Plant more trees"]
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Location Display */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between">
          <Group>
            <IconMapPin size={20} />
            <Text>
              {location
                ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : 'Fetching location...'}
            </Text>
          </Group>
          <Button variant="light" onClick={() => setIsMapOpen(true)}>
            Change Location
          </Button>
        </Group>
      </Paper>

      {/* Query Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TextInput
          size="lg"
          placeholder="Enter your environmental query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rightSection={
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              variant="filled"
            >
              <IconSearch size={20} />
            </Button>
          }
          mb="md"
        />
      </motion.div>

      {/* Hint Tags */}
      <Group gap="xs" mb="xl">
        {hints.map((hint) => (
          <Badge
            key={hint}
            variant="light"
            style={{ cursor: 'pointer' }}
            onClick={() => setQuery(hint)}
          >
            {hint}
          </Badge>
        ))}
      </Group>

      {/* Initial Result Card */}
      {initialResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Paper shadow="sm" p="lg" radius="md">
            <Text size="lg">{initialResult.summary}</Text>
          </Paper>
        </motion.div>
      )}

      {/* Location Map Modal */}
      <Modal
        opened={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        title="Select Location"
        size="lg"
      >
        <Box style={{ height: 400 }}>
          <MapContainer
            center={location || [0, 0]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {location && <Marker position={[location.lat, location.lng]} />}
            <LocationPicker
              onLocationSelect={(lat, lng) => {
                setLocation({ lat, lng });
                setIsMapOpen(false);
              }}
            />
          </MapContainer>
        </Box>
      </Modal>
    </Box>
  );
} 