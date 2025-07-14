import { useEffect, useState, type ReactNode } from "react";
import { CategoriesContext } from "./CategoriesContext";
import type { Category } from "@/types/category";
import { requestCategories } from "@/lib/api/main";

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setAreCategoriesLoading(true);
        const res = await requestCategories();
        setCategories(res);
      } catch (e) {
        console.log(e);
        setCategories([]);
      } finally {
        setAreCategoriesLoading(false);
      }
    })();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        areCategoriesLoading,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}
