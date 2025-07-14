import { useEffect, useState, type ReactNode } from "react";
import { PlacesContext, type SortType } from "./PlacesContext";
import type { Place } from "@/types/place";
import { requestPlaces } from "@/lib/api/main";

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [arePlacesLoading, setArePlacesLoading] = useState(false);
  const [tmpCoords, setTmpCoords] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>({
    name: "name",
    type: "asc",
  });

  useEffect(() => {
    (async () => {
      try {
        setArePlacesLoading(true);
        const res = await requestPlaces(activeFilters);
        setPlaces(res);
      } catch (e) {
        console.log(e);
        setPlaces([]);
      } finally {
        setArePlacesLoading(false);
      }
    })();
  }, [activeFilters, activeFilters.length]);

  const handleActiveFilter = (p: string) =>
    setActiveFilters((prev) =>
      prev.includes(p) ? prev.filter((el) => el !== p) : [...prev, p]
    );
  const handleSortType = (p: SortType) => setSortType(p);
  const handleIsEditing = (p: boolean) => setIsEditing(p);
  const handleSetTmpCoords = (tmp: number[]) => setTmpCoords(tmp);

  return (
    <PlacesContext.Provider
      value={{
        places,
        arePlacesLoading,
        activeFilters,
        isEditing,
        sortType,
        tmpCoords,
        setPlaces,
        handleIsEditing,
        handleActiveFilter,
        handleSortType,
        handleSetTmpCoords,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
}
