import { useContext } from "react";
import { PlacesContext, type PlacesContextType } from "./PlacesContext";

const defaultData: PlacesContextType = {
  places: [],
  arePlacesLoading: false,
  isEditing: false,
  handleIsEditing: () => {},
  setPlaces: () => {},
  activeFilter: null,
  sortType: {
    name: "name",
    type: "asc",
  },
  handleActiveFilter: () => {},
  handleSortType: () => {},
  tmpCoords: [],
  handleSetTmpCoords: function (): void {},
};

export const usePlaces = () => {
  const data = useContext(PlacesContext);
  if (!data) return defaultData;
  return data;
};
