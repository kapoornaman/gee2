import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LocationSelector from "@/components/location-selector";
import ChatInterface from "@/components/chat-interface";
import type { Location } from "@shared/schema";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(true);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const { toast } = useToast();

  const createLocationMutation = useMutation({
    mutationFn: async (locationData: { name: string; latitude?: string; longitude?: string; type: string }) => {
      const response = await apiRequest("POST", "/api/locations", locationData);
      return response.json();
    },
    onSuccess: (location: Location) => {
      setSelectedLocation(location);
      setIsAutoDetecting(false);
    },
    onError: () => {
      setIsAutoDetecting(false);
      setShowLocationSelector(true);
      toast({
        title: "Location Detection Failed",
        description: "We couldn't detect your location. Please select one manually.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Auto-detect location on page load
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          createLocationMutation.mutate({
            name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            type: "auto"
          });
        },
        (error) => {
          setIsAutoDetecting(false);
          setShowLocationSelector(true);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    } else {
      setIsAutoDetecting(false);
      setShowLocationSelector(true);
    }
  }, []);

  const handleChangeLocation = () => {
    setShowLocationSelector(true);
  };

  const handleLocationSelected = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationSelector(false);
  };

  if (isAutoDetecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Detecting your location...</h2>
          <p className="text-gray-600 mb-4">This helps us provide relevant geographic data</p>
          <button 
            onClick={() => {
              setIsAutoDetecting(false);
              setShowLocationSelector(true);
            }}
            className="text-green-600 hover:text-green-700 underline text-sm"
          >
            Skip and choose manually
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showLocationSelector && (
        <LocationSelector onLocationSelected={handleLocationSelected} />
      )}
      {selectedLocation && !showLocationSelector && (
        <ChatInterface 
          location={selectedLocation} 
          sessionId={sessionId}
          onChangeLocation={handleChangeLocation}
        />
      )}
    </div>
  );
}
