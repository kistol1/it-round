import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { requestLogin, requestMyAccount } from "@/lib/api/auth";
import { useLayer } from "@/context/layerContext/useLayer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  requestApprovePlace,
  requestDeletePlace,
  requestPlaces,
  requestUnapprovedPlaces,
} from "@/lib/api/main";
import { Card } from "@/components/ui/card";
import type { Place } from "@/types/place";
import { toast } from "sonner";
import { CustomMap } from "@/components/CustomMap";
import { useYMaps } from "@pbe/react-yandex-maps";
import { usePlaces } from "@/context/placesContext/usePlaces";

const FormSchema = z.object({
  login: z.string(),
  password: z.string().min(5, {
    message: "Мниимум 5 символов",
  }),
});

const AdminModal = () => {
  const { closePage } = useLayer();
  const { setPlaces: setPlacesContext } = usePlaces();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [arePlacesLoading, setArePlacesLoading] = useState(false);
  const [places, setPlaces] = useState<
    Record<"approved" | "unapproved", Place[]>
  >({ approved: [], unapproved: [] });
  const ymaps = useYMaps(["Placemark"]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsAuthLoading(true);
    try {
      await requestLogin(data.login, data.password);
      setIsAuthed(true);
      setArePlacesLoading(true);
      const unapproved = await requestUnapprovedPlaces();
      const approved = await requestPlaces([]);
      setPlaces({ approved, unapproved });
    } catch (e) {
      if (e) console.log(e);
      const errorStr =
        typeof e === "string"
          ? e
          : e && typeof e === "object" && "message" in e
          ? e.message
          : "Не удалось войти";
      form.setError("login", { message: errorStr as string });
    } finally {
      setIsAuthLoading(false);
      setArePlacesLoading(false);
    }
  };

  const handleSubmitPlace = async (id: string) => {
    try {
      await requestApprovePlace(id);
      const findElem = places.unapproved.find((el) => el.id === id);
      setPlaces((p) => ({
        ...p,
        unapproved: p.unapproved.filter((el) => el.id !== id),
      }));
      if (findElem) setPlacesContext((p) => [...p, findElem]);
    } catch (e) {
      console.log(e);
      const errorStr =
        typeof e === "string"
          ? e
          : e && typeof e === "object" && "message" in e
          ? e.message
          : "Не одобрить";
      setIsAuthed(false);
      toast(errorStr as string);
    }
  };

  const handleDeletePlace = async (id: string, approved?: boolean) => {
    try {
      await requestDeletePlace(id);
      setPlaces((p) => ({
        ...p,
        [approved ? "approved" : "unapproved"]: p[
          approved ? "approved" : "unapproved"
        ].filter((el) => el.id !== id),
      }));
    } catch (e) {
      console.log(e);
      const errorStr =
        typeof e === "string"
          ? e
          : e && typeof e === "object" && "message" in e
          ? e.message
          : "Не удалось войти";
      setIsAuthed(false);
      toast(errorStr as string);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await requestMyAccount();
        setIsAuthed(true);
        setArePlacesLoading(true);
        const unapproved = await requestUnapprovedPlaces();
        const approved = await requestPlaces([]);
        setPlaces({ approved, unapproved });
      } catch (e) {
        setIsAuthed(false);
        console.log(e);
      } finally {
        setArePlacesLoading(false);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <Loader className="size-8 mx-auto animate-spin" />;

  if (!isAuthed)
    return (
      <div className="relative">
        <div className="flex gap-2 justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Вход в аккаунт</h2>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input placeholder="Admininstrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isAuthLoading} type="submit">
              {isAuthLoading ? (
                <Loader className="animate-spin mx-auto " />
              ) : (
                "Отправить"
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-4xl font-bold">Панель администратора</h2>
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
      <div className="mt-4">
        {arePlacesLoading && <Loader className="animate-spin mx-auto " />}
        {!arePlacesLoading && (
          <Tabs defaultValue="unapproved" className="w-full">
            <TabsList>
              <TabsTrigger value="unapproved">Неодобренные локации</TabsTrigger>
              <TabsTrigger value="approved">Одобренные локации</TabsTrigger>
            </TabsList>
            <TabsContent value="unapproved" className="">
              {!places.unapproved.length && (
                <p className="text-gray-600 mx-auto w-full text-center mt-5">
                  Все локации одобрены!
                </p>
              )}
              {places.unapproved.map((place) => (
                <Card className="px-3 mb-5">
                  <div className="flex flex-row gap-4">
                    {place.photos && !!place.photos.length && (
                      <img
                        className="size-50 aspect-square  object-cover"
                        src={`${import.meta.env.VITE_PUBLIC_SERVER_URL}${
                          place.photos[0].file_name
                        }`}
                      />
                    )}
                    <div>
                      <h4 className="font-bold">{place.name}</h4>
                      <p className="">{place.category}</p>
                      <p className="">{place.short_description}</p>
                    </div>
                  </div>
                  {ymaps && (
                    <CustomMap
                      placeMark={
                        new ymaps.Placemark(
                          [place.x, place.y],
                          {},
                          {
                            preset: "islands#icon",
                            iconColor: "#ff0000",
                          }
                        )
                      }
                      className="relative w-full h-30"
                    />
                  )}
                  <p className="">{place.full_description}</p>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={() => handleSubmitPlace(place.id)}>
                      Одобрить
                    </Button>
                    <Button
                      onClick={() => handleDeletePlace(place.id)}
                      variant={"destructive"}
                    >
                      Отклонить
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="approved">
              {!arePlacesLoading && !places.unapproved.length && (
                <p className="text-gray-600 mx-auto w-full text-center mt-5">
                  Все локации одобрены!
                </p>
              )}
              {places.approved.map((place) => (
                <Card className="px-3 mb-5">
                  <div className="flex flex-row gap-4">
                    {place.photos && !!place.photos.length && (
                      <img
                        className="size-50 aspect-square  object-cover"
                        src={`${import.meta.env.VITE_PUBLIC_SERVER_URL}${
                          place.photos[0].file_name
                        }`}
                      />
                    )}
                    <div>
                      <h4 className="font-bold">{place.name}</h4>
                      <p className="">{place.category}</p>
                      <p className="">{place.short_description}</p>
                    </div>
                  </div>

                  <p className="">{place.full_description}</p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleDeletePlace(place.id, true)}
                      variant={"destructive"}
                    >
                      Удалить
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default AdminModal;
