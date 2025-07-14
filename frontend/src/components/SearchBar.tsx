import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/lib/useDebounce";
import { type Place } from "@/types/place";
import { request } from "@/lib/api";
import { useLayer } from "@/context/layerContext/useLayer";
import FullInfoModal from "@/modules/FullInfoModal";

export default function SearchBar() {
  const { openPage } = useLayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      try {
        const res = await request.get(`places/search?query=${debouncedQuery}`);
        setResults(res);
      } catch (e) {
        console.error("Search failed", e);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative flex items-center space-x-2">
      <Popover>
        <PopoverTrigger className="w-full mt-5">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-6 w-full"
            placeholder="Поиск..."
          />
        </PopoverTrigger>
        {results.length > 0 && (
          <PopoverContent className="w-80 p-0 z-2">
            {results.map((place) => (
              <button
                key={place.id}
                onClick={() => {
                  console.log(place);
                  openPage(<FullInfoModal place={place} />);
                  setQuery(place.name);
                  setResults([]);
                }}
                className="w-full px-4 py-2 z-2 text-left hover:bg-muted transition-colors"
              >
                <div className="font-medium">{place.name}</div>
                <p className="text-sm text-muted-foreground">
                  {place.short_description}
                </p>
              </button>
            ))}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
