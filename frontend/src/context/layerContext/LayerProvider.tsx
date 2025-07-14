import { useState, type ReactNode } from "react";
import { LayerContext } from "./LayerContext";
import { cn } from "@/lib/utils";

type Layer = {
  id: number;
  content: ReactNode;
  isOpen: boolean;
};

export function LayerProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([]);

  const openPage = (content: ReactNode) => {
    const id = Math.floor(Math.random() * 1_000_000_000);
    setLayers((prev) => [
      ...prev,
      {
        id,
        content,
        isOpen: true,
      },
    ]);
  };

  const closePage = () => {
    const lastLayer = layers[layers.length - 1];
    if (!lastLayer) return;

    setLayers((prev) =>
      prev.map((layer, idx) =>
        idx === prev.length - 1 ? { ...layer, isOpen: false } : layer
      )
    );

    setTimeout(() => {
      setLayers((prev) => prev.slice(0, prev.length - 1));
    }, 300);
  };

  return (
    <LayerContext.Provider value={{ openPage, closePage }}>
      {children}
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          style={{ zIndex: index + 3 }}
          className={cn(
            "bg-white w-screen h-screen p-10 fixed overflow-auto left-0 transition-transform duration-300 xl:w-125 xl:p-10",
            layer.isOpen ? "animate-slide-in-left" : "animate-slide-out-left"
          )}
        >
          {layer.content}
        </div>
      ))}
    </LayerContext.Provider>
  );
}
