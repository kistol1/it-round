import type { Place } from "@/types/place";
import { createContext } from "react";

export type SortType = { name: "name" | "raiting"; type: "asc" | "desc" };

export type PlacesContextType = {
  places: Place[] | null;
  arePlacesLoading: boolean;
  isEditing: boolean;
  handleIsEditing: (p: boolean) => void;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  activeFilters: string[];
  sortType: SortType;
  handleActiveFilter: (p: string) => void;
  handleSortType: (p: SortType) => void;
  tmpCoords: number[];
  handleSetTmpCoords: (p: number[]) => void;
};

export const PlacesContext = createContext<PlacesContextType | null>(null);
