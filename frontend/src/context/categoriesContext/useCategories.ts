import { useContext } from "react";
import {
  CategoriesContext,
  type CategoriesContextType,
} from "./CategoriesContext";

const defaultData: CategoriesContextType = {
  categories: null,
  areCategoriesLoading: false,
  setCategories: function (): void {},
};

export const useCategories = () => {
  const data = useContext(CategoriesContext);
  if (!data) return defaultData;
  return data;
};
