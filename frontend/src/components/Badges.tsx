import { cn } from "@/lib/utils";
import {
  Landmark,
  Atom,
  Bike,
  Baby,
  PartyPopper,
  Leaf,
  Camera,
} from "lucide-react";
import OlympicIcon from "./icons/OlympicIcon";
import { Badge } from "./ui/badge";
import { usePlaces } from "@/context/placesContext/usePlaces";

const Badges = ({ className }: { className?: string }) => {
  const { handleActiveFilter, activeFilters } = usePlaces();
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <Badge
        onClick={() => handleActiveFilter("Культура")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-blue-500 cursor-pointer transition-colors",
          activeFilters.includes("Культура") && "bg-blue-500"
        )}
      >
        <div
          className={cn(
            activeFilters.includes("Культура") ? "white" : "text-blue-500"
          )}
        >
          <Landmark
            className={
              activeFilters.includes("Культура")
                ? "text-white"
                : "text-blue-500"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-center font-extrabold text-blue-500",
            activeFilters.includes("Культура") && " text-white"
          )}
        >
          Культура
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Наука")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 text-cyan-500 border-cyan-500 cursor-pointer transition-colors",
          activeFilters.includes("Наука") && "bg-cyan-500 text-white"
        )}
      >
        <div className={cn("rounded-full  transition-colors")}>
          <Atom
            className={
              activeFilters.includes("Наука") ? "white" : "text-cyan-500"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-blue-500 font-extrabold text-center",
            activeFilters.includes("Наука") && " text-white"
          )}
        >
          Наука
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Спорт")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-green-700 cursor-pointer transition-colors",
          activeFilters.includes("Спорт") && "bg-green-800"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("Спорт") && ""
          )}
        >
          <Bike
            className={
              activeFilters.includes("Спорт") ? "text-white" : "text-green-800"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-green-800 font-extrabold  text-center",
            activeFilters.includes("Спорт") && "font-extrabold text-white"
          )}
        >
          Спорт
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Олимп. игры")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-red-400 cursor-pointer transition-colors",
          activeFilters.includes("Олимп. игры") && "bg-red-500"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("Олимп. игры") && ""
          )}
        >
          <OlympicIcon
            className={
              activeFilters.includes("Олимп. игры")
                ? "text-white"
                : "text-red-500"
            }
            height={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-red-500 font-extrabold  text-center",
            activeFilters.includes("Олимп. игры") && "font-extrabold text-white"
          )}
        >
          Олимп. игры
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("С детьми")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-pink-300 cursor-pointer transition-colors",
          activeFilters.includes("С детьми") && "bg-pink-400"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("С детьми") && ""
          )}
        >
          <Baby
            className={
              activeFilters.includes("С детьми")
                ? "text-white"
                : "text-pink-400"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-pink-400 font-extrabold  text-center",
            activeFilters.includes("С детьми") && "font-extrabold text-white"
          )}
        >
          С детьми
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Развлечения")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-yellow-400 cursor-pointer transition-colors",
          activeFilters.includes("Развлечения") && "bg-yellow-500"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("Развлечения") && ""
          )}
        >
          <PartyPopper
            className={
              activeFilters.includes("Развлечения")
                ? "text-white"
                : "text-yellow-500"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-yellow-500 font-extrabold  text-center",
            activeFilters.includes("Развлечения") && "font-extrabold text-white"
          )}
        >
          Развлечения
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Природа")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-green-400 cursor-pointer transition-colors",
          activeFilters.includes("Природа") && "bg-green-500"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("Природа") && ""
          )}
        >
          <Leaf
            className={
              activeFilters.includes("Природа")
                ? "text-white"
                : "text-green-500"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-green-500 font-extrabold  text-center",
            activeFilters.includes("Природа") && "font-extrabold text-white"
          )}
        >
          Природа
        </p>
      </Badge>
      <Badge
        onClick={() => handleActiveFilter("Красивые места")}
        className={cn(
          "flex items-center gap-1 bg-white border-2 border-blue-700 cursor-pointer transition-colors",
          activeFilters.includes("Красивые места") && "bg-blue-800"
        )}
      >
        <div
          className={cn(
            "rounded-full  transition-colors",
            activeFilters.includes("Красивые места") && ""
          )}
        >
          <Camera
            className={
              activeFilters.includes("Красивые места")
                ? "text-white"
                : "text-blue-800"
            }
            size={24}
          />
        </div>
        <p
          className={cn(
            "text-sm text-blue-800 font-extrabold  text-center",
            activeFilters.includes("Красивые места") &&
              "font-extrabold text-white"
          )}
        >
          Красивые места
        </p>
      </Badge>
    </div>
  );
};

export default Badges;
