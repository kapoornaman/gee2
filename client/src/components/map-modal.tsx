import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, MapPin } from "lucide-react";

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

export default function MapModal({ open, onClose, onLocationSelect }: MapModalProps) {
  const [selectedPosition, setSelectedPosition] = useState({ lat: 37.7749, lng: -122.4194 });

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to mock coordinates
    const lat = 37.7749 + (0.5 - y / rect.height) * 0.1;
    const lng = -122.4194 + (x / rect.width - 0.5) * 0.1;
    
    setSelectedPosition({ lat, lng });
  };

  const handleConfirm = () => {
    onLocationSelect(
      selectedPosition.lat,
      selectedPosition.lng,
      `Location (${selectedPosition.lat.toFixed(4)}, ${selectedPosition.lng.toFixed(4)})`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Select Location on Map</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="w-full h-96 bg-gray-100 rounded-xl relative overflow-hidden cursor-crosshair" onClick={handleMapClick}>
          {/* Mock map background - in real app would use Leaflet or Google Maps */}
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 80%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)
              `
            }}
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg pointer-events-none">
              <MapPin className="text-green-600 text-2xl mr-2 inline" />
              <span className="text-gray-900 font-medium">Click anywhere to select location</span>
            </div>
          </div>
          
          {/* Location pin */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{
              left: `${((selectedPosition.lng + 122.4194 + 0.05) / 0.1) * 100}%`,
              top: `${((0.5 - (selectedPosition.lat - 37.7749)) / 0.1) * 100}%`
            }}
          >
            <MapPin className="text-red-500 text-3xl drop-shadow-lg" />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600">
            Selected: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
