import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Crosshair, Map, Keyboard } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MapModal from "./map-modal";
import type { Location } from "@shared/schema";

interface LocationSelectorProps {
  onLocationSelected: (location: Location) => void;
}

export default function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const { toast } = useToast();

  const createLocationMutation = useMutation({
    mutationFn: async (locationData: { name: string; latitude?: string; longitude?: string; type: string }) => {
      const response = await apiRequest("POST", "/api/locations", locationData);
      return response.json();
    },
    onSuccess: (location: Location) => {
      onLocationSelected(location);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save location. Please try again.",
        variant: "destructive",
      });
    },
  });

  const geocodeMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await apiRequest("POST", "/api/geocode", { address });
      return response.json();
    },
    onSuccess: (result: { name: string; lat: string; lng: string }) => {
      createLocationMutation.mutate({
        name: result.name,
        latitude: result.lat,
        longitude: result.lng,
        type: "manual"
      });
    },
  });

  const handleAutoDetect = () => {
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
          toast({
            title: "Location Error",
            description: "Unable to detect your location. Please try another method.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      geocodeMutation.mutate(manualInput.trim());
      setShowManualDialog(false);
      setManualInput("");
    }
  };

  const handleMapSelection = (lat: number, lng: number, name: string) => {
    createLocationMutation.mutate({
      name,
      latitude: lat.toString(),
      longitude: lng.toString(),
      type: "map"
    });
    setShowMapDialog(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Location</h2>
            <p className="text-gray-600">Choose how you'd like to specify your location for analysis</p>
          </div>
          
          <div className="space-y-3">
            <Card 
              className="cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all group"
              onClick={handleAutoDetect}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Crosshair className="text-green-600 text-xl mr-4" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600">Auto-detect my location</div>
                    <div className="text-sm text-gray-600">Use GPS to find your current position</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all group"
              onClick={() => setShowMapDialog(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Map className="text-green-600 text-xl mr-4" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600">Choose on map</div>
                    <div className="text-sm text-gray-600">Click on an interactive map</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all group"
              onClick={() => setShowManualDialog(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Keyboard className="text-green-600 text-xl mr-4" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600">Enter manually</div>
                    <div className="text-sm text-gray-600">Type city name or coordinates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">City or Address</label>
              <Input
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g., San Francisco, CA or 37.7749, -122.4194"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowManualDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleManualSubmit}
                disabled={!manualInput.trim() || geocodeMutation.isPending}
              >
                {geocodeMutation.isPending ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MapModal
        open={showMapDialog}
        onClose={() => setShowMapDialog(false)}
        onLocationSelect={handleMapSelection}
      />
    </>
  );
}
