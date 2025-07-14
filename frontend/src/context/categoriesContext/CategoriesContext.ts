import type { Category } from "@/types/category";
import { createContext } from "react";

export type CategoriesContextType = {
  categories: Category[] | null;
  areCategoriesLoading: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoriesContext = createContext<CategoriesContextType | null>(
  null
);
