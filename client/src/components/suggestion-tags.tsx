import { Button } from "@/components/ui/button";

interface SuggestionTagsProps {
  onTagClick: (text: string) => void;
}

const suggestions = [
  { tag: "rainfall", sentence: "Show me rainfall patterns from 2001 to 2020" },
  { tag: "temperature", sentence: "What are the temperature trends over the last decade?" },
  { tag: "population", sentence: "Analyze population density changes in this area" },
  { tag: "weather", sentence: "Compare monthly weather averages" },
  { tag: "climate", sentence: "How has climate changed in recent years?" },
  { tag: "seasonal", sentence: "Show seasonal weather variations" },
  { tag: "demographics", sentence: "What are the demographic trends?" },
  { tag: "economy", sentence: "Analyze economic indicators for this region" }
];

export default function SuggestionTags({ onTagClick }: SuggestionTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.tag}
          variant="secondary"
          size="sm"
          onClick={() => onTagClick(suggestion.sentence)}
          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-green-600 hover:text-white transition-colors"
        >
          {suggestion.tag}
        </Button>
      ))}
    </div>
  );
}
