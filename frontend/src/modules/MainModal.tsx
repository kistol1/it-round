import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowDownAZ, Loader, Menu, Plus, User, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLayer } from "@/context/layerContext/useLayer";
import FormModal from "./FormModal";
import { usePlaces } from "@/context/placesContext/usePlaces";
import AdminModal from "./AdminModal";
import { useState } from "react";
import { colorsFromCategory } from "@/components/CustomMap";
import SearchBar from "@/components/SearchBar";
import Badges from "@/components/Badges";
import FullInfoModal from "./FullInfoModal";
import plural from "plural-ru";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";

// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
const MainModal = () => {
  const { openPage } = useLayer();
  const { places, arePlacesLoading, handleIsEditing } = usePlaces();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="z-1 absolute top-5 left-5 flex gap-4 xl:hidden">
        <Button
          className="z-1 size-16"
          onClick={() => {
            setOpenModal(true);
          }}
          size="icon"
          variant={"outline"}
        >
          <Menu className="size-9" />
        </Button>
        <Badges className="xl:hidden" />
      </div>

      <div
        style={{ opacity: Number(openModal), zIndex: 2 * Number(openModal) }}
        className="bg-[#fff] w-screen h-screen p-5 z-2 fixed overflow-auto left-0 transition-all xl:w-125 xl:!opacity-100 xl:!z-2 xl:p-10"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              className=" size-16 xl:hidden"
              onClick={() => {
                setOpenModal(false);
              }}
              size="icon"
              variant={"outline"}
            >
              <X className="size-9" />
            </Button>
            <h1 className="text-4xl font-bold">Сириус карты</h1>
          </div>
          <Button
            className="flex gap-2 items-center"
            onClick={() => {
              openPage(<FormModal />);
              handleIsEditing(true);
            }}
            variant={"outline"}
          >
            <p>Добавить</p>
            <Plus className="size-6" />
          </Button>
        </div>
        <SearchBar />
        <Card className="mt-12">
          <CardHeader className="items-center">
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <Badges />
        </Card>
        <div className="flex mt-8 justify-between items-center">
          <h2 className="text-2xl font-bold">Интересные места</h2>
        </div>

        {arePlacesLoading && <Loader className="mx-auto animate-spin" />}
        {!arePlacesLoading && (
          <div className="flex gap-4 mb-10">
            {!places?.length && (
              <div className="w-full flex justify-center flex-col items-center">
                <h3 className="font-black text-6xl mt-12 mb-4">404</h3>
                <p className="max-w-66 text-center">
                  Не удалось найти информацию, попробуйте позже!
                </p>
              </div>
            )}
            {!!places?.length && (
              <div className="flex gap-4 flex-wrap mt-5 w-full">
                {places.map((el) => (
                  <Card className="flex basis-[calc(1/2*100%-8px)] py-0 overflow-hidden w-full">
                    <Swiper
                      className="w-full"
                      spaceBetween={50}
                      slidesPerView={1}
                      pagination
                      navigation
                      modules={[Pagination, Navigation]}
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {el.photos.map((photo) => (
                        <SwiperSlide>
                          <img
                            className="h-50 w-full object-cover"
                            src={`${import.meta.env.VITE_PUBLIC_SERVER_URL}${
                              photo.file_name
                            }`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div
                      onClick={() => openPage(<FullInfoModal place={el} />)}
                      className="p-4 pt-0"
                    >
                      <h3 className="mb-2 font-bold">{el.name}</h3>

                      <div className="">
                        <div className="flex gap-2 items-center">
                          <div
                            className="size-2 rounded-full"
                            style={{
                              background:
                                colorsFromCategory[
                                  el.category as keyof typeof colorsFromCategory
                                ],
                            }}
                          />
                          <h2 className="text-sm">{el.category}</h2>
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
                          <h2 className="text-sm">{el.rating.toFixed(2)}</h2>
                          <p>
                            ({el.reviews_amount}{" "}
                            {plural(
                              el.reviews_amount,
                              "отзыв",
                              "отзыва",
                              "отзывов"
                            )}
                            ))
                          </p>
                        </div>
                      </div>
                      {el.yandex_link && (
                        <a
                          href={el.yandex_link}
                          className="text-gray-400 font-light my-3"
                        >
                          <span className="text-blue-500 font-bold flex gap-1 underline">
                            Локация на Я.Картах
                          </span>
                        </a>
                      )}
                      <p className="mb-2">{el.short_description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          onClick={() => openPage(<AdminModal />)}
          className="mt-5"
          variant={"link"}
        >
          <User />
          <p>Панель администратора</p>
        </Button>
      </div>
    </>
  );
};

export default MainModal;
