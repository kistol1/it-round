import { Button } from "@/components/ui/button";
import { useLayer } from "@/context/layerContext/useLayer";
import type { Place } from "@/types/place";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
import plural from "plural-ru";
import Reviews from "./Reviews";
import { Navigation, Pagination } from "swiper/modules";

const FullInfoModal = ({ place }: { place: Place }) => {
  const { closePage } = useLayer();
  return (
    <div className="pb-10">
      <div className="flex gap-2 justify-between items-start mb-12">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-3xl font-bold">{place.name}</h2>
          <p className="text-gray-400 font-light">
            <span className="text-yellow-500 font-bold flex gap-1">
              {place.rating.toFixed(2)}{" "}
              <svg
                width="24"
                height="24"
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
            </span>{" "}
            ({place.reviews_amount}{" "}
            {plural(place.reviews_amount, "отзыв", "отзыва", "отзывов")})
          </p>
          {place.yandex_link && (
            <a href={place.yandex_link} className="text-gray-400 font-light">
              <span className="text-blue-500 font-bold flex gap-1 underline">
                Локация на Я.Картах
              </span>
            </a>
          )}
        </div>
        <Button
          size={"icon"}
          onClick={() => {
            closePage();
          }}
          variant={"ghost"}
        >
          <X className="size-6" />
        </Button>
      </div>
      <div>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {place.photos.map((photo) => (
            <SwiperSlide>
              <img
                className="max-h-80 mx-auto"
                src={`${import.meta.env.VITE_PUBLIC_SERVER_URL}${
                  photo.file_name
                }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="mt-4 font-bold text-xl">Описание</p>
        <p className="mb-8 mt-2 whitespace-pre-line">
          {place.full_description}
        </p>
        <Reviews placeId={place.id} />
      </div>
    </div>
  );
};

export default FullInfoModal;
