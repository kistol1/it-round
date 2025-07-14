import { usePlaces } from "@/context/placesContext/usePlaces";
import { cn } from "@/lib/utils";
import { useYMaps } from "@pbe/react-yandex-maps";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { type Place } from "@/types/place";
import { useLayer } from "@/context/layerContext/useLayer";
import FullInfoModal from "@/modules/FullInfoModal";
import plural from "plural-ru";

export const colorsFromCategory = {
  Культура: "#51a2ff",
  Спорт: "#008236",
  Наука: "#00d3f3",
  "Олимп. игры": "#ff6467",
  "С детьми": "#fda5d6",
  Развлечения: "#fdc700",
  Природа: "#05df72",
  "Красивые места": "#1447e6",
};

export const CustomMap = ({
  className,
  placeMark,
}: {
  placeMark?: ymaps.Placemark;
  className?: string;
}) => {
  const { places, handleSetTmpCoords, tmpCoords, isEditing } = usePlaces();
  const { openPage } = useLayer();
  const mapRef = useRef(null);
  const ymaps = useYMaps(["Map", "Placemark"]);
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const tmpPlacemarkRef = useRef<ymaps.Placemark | null>(null);
  const isEditingRef = useRef(isEditing);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const placemarksRef = useRef<ymaps.Placemark[]>([]);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (!ymaps || !mapRef.current || mapInstanceRef.current) return;

    const map = new ymaps.Map(mapRef.current, {
      center: [43.40531, 39.969939],
      zoom: 14,
    });

    mapInstanceRef.current = map;

    map.events.add("click", (e) => {
      if (!isEditingRef.current) return;
      const coords = e.get("coords");
      handleSetTmpCoords(coords);
    });

    map.events.add("boundschange", () => {
      setSelectedPlace(null);
    });
  }, [ymaps, handleSetTmpCoords, placeMark]);

  useEffect(() => {
    if (!mapInstanceRef.current || !ymaps) return;

    const map = mapInstanceRef.current;

    placemarksRef.current.forEach((pm) => map.geoObjects.remove(pm));
    placemarksRef.current = [];

    if (placeMark) {
      map.geoObjects.add(placeMark);
    }

    places?.forEach((el) => {
      const placemark = new ymaps.Placemark(
        [el.x, el.y],
        {
          balloonContentHeader: el.name,
          balloonContentBody: el.short_description,
        },
        {
          preset: "islands#icon",
          iconColor:
            colorsFromCategory[el.category as keyof typeof colorsFromCategory],
        }
      );
      placemark.events.add("click", () => {
        setSelectedPlace(el);
      });
      map.geoObjects.add(placemark);
      placemarksRef.current.push(placemark);
    });
  }, [places, ymaps, placeMark]);

  useEffect(() => {
    if (!ymaps || !mapInstanceRef.current || !isEditing) return;

    const map = mapInstanceRef.current;

    if (!tmpCoords.length) return;

    if (tmpPlacemarkRef.current) {
      map.geoObjects.remove(tmpPlacemarkRef.current);
    }

    const placemark = new ymaps.Placemark(
      tmpCoords,
      {},
      {
        preset: "islands#icon",
        iconColor: "#d90000",
      }
    );

    tmpPlacemarkRef.current = placemark;
    map.geoObjects.add(placemark);
  }, [tmpCoords, ymaps, isEditing]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!isEditing && tmpPlacemarkRef.current) {
      mapInstanceRef.current.geoObjects.remove(tmpPlacemarkRef.current);
      tmpPlacemarkRef.current = null;
    }
  }, [isEditing]);

  return (
    <>
      <div
        ref={mapRef}
        className={cn("fixed inset-0 z-0 w-screen h-screen", className)}
      >
        {selectedPlace && (
          <Card
            className="absolute z-50 py-3 px-6 gap-2 transition-all duration-200 max-w-[350px]"
            style={{
              right: 10,
              bottom: 10,
            }}
          >
            <div className="flex gap-5">
              <div>
                <h2 className="font-bold">{selectedPlace.name}</h2>
                <div className="flex gap-2 items-center">
                  <div
                    className="size-2 rounded-full"
                    style={{
                      background:
                        colorsFromCategory[
                          selectedPlace.category as keyof typeof colorsFromCategory
                        ],
                    }}
                  />
                  <h2 className="text-sm">{selectedPlace.category}</h2>
                </div>
                <div className="flex gap-2 items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_3190_16977)">
                      <path
                        d="M11.9999 18.26L4.94691 22.208L6.52191 14.28L0.586914 8.792L8.61391 7.84L11.9999 0.5L15.3859 7.84L23.4129 8.792L17.4779 14.28L19.0529 22.208L11.9999 18.26Z"
                        fill="gold"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3190_16977">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h2 className="text-sm">{selectedPlace.rating.toFixed(2)}</h2>
                  <p>
                    ({selectedPlace.reviews_amount}{" "}
                    {plural(
                      selectedPlace.reviews_amount,
                      "отзыв",
                      "отзыва",
                      "отзывов"
                    )}
                    ))
                  </p>
                </div>
              </div>
              {!!selectedPlace?.photos?.length &&
                !!selectedPlace?.photos[0]?.file_name && (
                  <img
                    className="w-30 aspect-video object-cover rounded-lg"
                    src={`${import.meta.env.VITE_PUBLIC_SERVER_URL}${
                      selectedPlace.photos[0].file_name
                    }`}
                  />
                )}
            </div>
            {selectedPlace.yandex_link && (
              <a
                href={selectedPlace.yandex_link}
                className="text-gray-400 font-light"
              >
                <span className="text-blue-500 font-bold flex gap-1 underline">
                  Локация на Я.Картах
                </span>
              </a>
            )}
            <p className="text-sm">{selectedPlace.short_description}</p>
            <div className="gap-4 flex">
              <button
                onClick={() => {
                  setSelectedPlace(null);
                }}
                className="mt-2 text-blue-500 underline"
              >
                Закрыть
              </button>
              <button
                onClick={() => {
                  openPage(<FullInfoModal place={selectedPlace} />);
                }}
                className="mt-2 text-blue-500 underline"
              >
                Подробнее
              </button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
