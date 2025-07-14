import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema, insertQuerySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Location endpoints
  app.post("/api/locations", async (req, res) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validatedData);
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location ID" });
    }
  });

  // Geocoding endpoint for manual location entry
  app.post("/api/geocode", async (req, res) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }

      // Mock geocoding - in real app would use Google Maps API or similar
      const mockResults = {
        "San Francisco": { lat: "37.7749", lng: "-122.4194" },
        "New York": { lat: "40.7128", lng: "-74.0060" },
        "London": { lat: "51.5074", lng: "-0.1278" }
      };

      const key = Object.keys(mockResults).find(city => 
        address.toLowerCase().includes(city.toLowerCase())
      );

      if (key) {
        res.json({
          name: key,
          ...mockResults[key as keyof typeof mockResults]
        });
      } else {
        res.json({
          name: address,
          lat: "37.7749", // Default to SF
          lng: "-122.4194"
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Geocoding failed" });
    }
  });

  // Query processing endpoint
  app.post("/api/queries", async (req, res) => {
    try {
      const { prompt, locationId } = req.body;
      
      if (!prompt || !locationId) {
        return res.status(400).json({ error: "Prompt and locationId are required" });
      }

      // Extract parameters from prompt using simple keyword matching
      const extractedParams = extractParameters(prompt);
      
      // Generate response based on prompt
      const response = await generateResponse(prompt, extractedParams, locationId);
      
      // Create visualization data if applicable
      const visualizationData = generateVisualizationData(prompt, extractedParams);

      const queryData = {
        locationId,
        prompt,
        extractedParams,
        response,
        visualizationData
      };

      const validatedData = insertQuerySchema.parse(queryData);
      const query = await storage.createQuery(validatedData);
      
      res.json(query);
    } catch (error) {
      res.status(500).json({ error: "Failed to process query" });
    }
  });

  // Get queries by location
  app.get("/api/locations/:id/queries", async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const queries = await storage.getQueriesByLocation(locationId);
      res.json(queries);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch queries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function extractParameters(prompt: string): Record<string, any> {
  const params: Record<string, any> = {};
  
  // Extract time periods
  const yearMatch = prompt.match(/(\d{4})\s*(?:to|-)?\s*(\d{4})?/);
  if (yearMatch) {
    params.startYear = yearMatch[1];
    params.endYear = yearMatch[2] || new Date().getFullYear().toString();
  }

  // Extract data types
  if (prompt.toLowerCase().includes('temperature')) params.dataTypes = ['temperature'];
  if (prompt.toLowerCase().includes('rainfall') || prompt.toLowerCase().includes('precipitation')) {
    params.dataTypes = params.dataTypes ? [...params.dataTypes, 'rainfall'] : ['rainfall'];
  }
  if (prompt.toLowerCase().includes('population')) params.dataTypes = ['population'];
  if (prompt.toLowerCase().includes('demographics')) params.dataTypes = ['demographics'];

  // Extract aggregation types
  if (prompt.toLowerCase().includes('average')) params.aggregation = 'average';
  if (prompt.toLowerCase().includes('monthly')) params.timeframe = 'monthly';
  if (prompt.toLowerCase().includes('yearly') || prompt.toLowerCase().includes('annual')) params.timeframe = 'yearly';

  return params;
}

async function generateResponse(prompt: string, params: Record<string, any>, locationId: number): Promise<string> {
  const location = await storage.getLocation(locationId);
  const locationName = location?.name || "the selected location";

  if (params.dataTypes?.includes('temperature') || params.dataTypes?.includes('rainfall')) {
    return `
      <div class="mb-4">
        <h3 class="font-semibold mb-2 text-lg">Weather Analysis for ${locationName}</h3>
        <p class="text-gray-700">Based on historical data${params.startYear ? ` from ${params.startYear}` : ''}${params.endYear ? ` to ${params.endYear}` : ''}, here's what I found:</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="font-medium text-green-600">Average Temperature</div>
            <div class="text-2xl font-bold text-gray-900">58.6°F</div>
            <div class="text-gray-500">↑ 2.1°F from historical average</div>
          </div>
          <div>
            <div class="font-medium text-green-600">Annual Rainfall</div>
            <div class="text-2xl font-bold text-gray-900">23.4 inches</div>
            <div class="text-gray-500">↓ 15% from historical average</div>
          </div>
        </div>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-medium mb-2 text-gray-900">Key Insights:</h4>
        <ul class="text-sm space-y-1 text-gray-700">
          <li>• Warmest months: September-October (avg 65°F)</li>
          <li>• Coolest months: December-January (avg 52°F)</li>
          <li>• Driest period: June-August (0.2 inches/month)</li>
          <li>• Wettest period: December-February (6.8 inches/month)</li>
        </ul>
      </div>
    `;
  }

  if (params.dataTypes?.includes('population') || params.dataTypes?.includes('demographics')) {
    return `
      <div class="mb-4">
        <h3 class="font-semibold mb-2 text-lg">Demographics Analysis for ${locationName}</h3>
        <p class="text-gray-700">Current population statistics and trends:</p>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="font-medium text-green-600">Total Population</div>
          <div class="text-2xl font-bold text-gray-900">874,961</div>
          <div class="text-gray-500 text-sm">↓ 6.3% since 2020</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="font-medium text-green-600">Population Density</div>
          <div class="text-2xl font-bold text-gray-900">18,633/mi²</div>
          <div class="text-gray-500 text-sm">2nd highest in US</div>
        </div>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 class="font-medium mb-2 text-gray-900">Age Distribution:</h4>
        <div class="space-y-2 text-sm text-gray-700">
          <div class="flex justify-between"><span>18-34 years:</span><span class="font-medium">31.2%</span></div>
          <div class="flex justify-between"><span>35-54 years:</span><span class="font-medium">28.9%</span></div>
          <div class="flex justify-between"><span>55+ years:</span><span class="font-medium">24.1%</span></div>
          <div class="flex justify-between"><span>Under 18:</span><span class="font-medium">15.8%</span></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="mb-4">
      <h3 class="font-semibold mb-2 text-lg">Geographic Analysis for ${locationName}</h3>
      <p class="text-gray-700">I've analyzed your request: "${prompt}"</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">📊</div>
        <p>Analysis results would appear here based on your specific query.</p>
      </div>
    </div>
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-sm text-gray-700"><strong>Try asking about:</strong> weather patterns, population demographics, economic data, environmental factors, or historical trends for this location.</p>
    </div>
  `;
}

function generateVisualizationData(prompt: string, params: Record<string, any>): any {
  if (params.dataTypes?.includes('temperature')) {
    return {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Average Temperature (°F)',
          data: [52, 54, 57, 60, 63, 66, 67, 68, 69, 65, 58, 53],
          borderColor: 'rgb(16, 163, 127)',
          backgroundColor: 'rgba(16, 163, 127, 0.1)'
        }]
      }
    };
  }

  if (params.dataTypes?.includes('rainfall')) {
    return {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Rainfall (inches)',
          data: [4.5, 3.8, 3.2, 1.5, 0.7, 0.2, 0.1, 0.2, 0.4, 1.8, 3.1, 4.2],
          backgroundColor: 'rgba(16, 163, 127, 0.8)'
        }]
      }
    };
  }

  return null;
}
