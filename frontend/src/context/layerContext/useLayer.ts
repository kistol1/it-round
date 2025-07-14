import { useContext } from "react";
import { LayerContext, type LayerContextType } from "./LayerContext";

const defaultData: LayerContextType = {
  openPage: () => {},
  closePage: () => {},
};

export const useLayer = () => {
  const data = useContext(LayerContext);
  if (!data) return defaultData;
  return data;
};
