import { createContext, type ReactNode } from "react";

export type LayerContextType = {
  openPage: (p: ReactNode) => void;
  closePage: VoidFunction;
};

export const LayerContext = createContext<LayerContextType | null>(null);
