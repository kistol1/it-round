import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayer } from "@/context/layerContext/useLayer";
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
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/context/categoriesContext/useCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePlaces } from "@/context/placesContext/usePlaces";
import { requestCreateLocation, requestUploadFile } from "@/lib/api/form";
import { toast } from "sonner";
import { useState } from "react";
import { CustomMap } from "@/components/CustomMap";
import CheckMark from "@/components/ui/CheckMark";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Название от 2 символов",
    })
    .max(50, {
      message: "Название до 50 символов",
    }),
  short_description: z
    .string()
    .min(5, {
      message: "Краткое описание от 5 символов",
    })
    .max(125, {
      message: "Краткое описание до 125 символов",
    }),
  yandex_link: z.string().includes("https://yandex.ru/maps", {
    message: "Ссылка должна быть на Я.Карты",
  }),
  full_description: z
    .string()
    .min(10, {
      message: "Полное описани от 10 символов",
    })
    .max(1000, {
      message: "Полное описание до 1000 символов",
    }),
  photos: z.custom<FileList | undefined>().superRefine((file, ctx) => {
    if (!file || !file.length) {
      return ctx.addIssue({
        path: ["file"],
        message: "Файл обязательный",
        code: "custom",
      });
    }
    if (file.length > 5) {
      return ctx.addIssue({
        path: ["file"],
        message: "Файлов слишком много",
        code: "custom",
      });
    }
  }),
  category: z.string().nonempty({ message: "Поле обязательное" }),
});

const FormModal = () => {
  const { closePage } = useLayer();
  const { tmpCoords, handleIsEditing } = usePlaces();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { categories } = useCategories();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      short_description: "",
      category: "",
      yandex_link: "",
      full_description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!data.photos)
      return toast("Не удалось загузить файл, попробуйте позже");
    if (tmpCoords.length < 2) return toast("Не выбрана точка на карте");
    setIsLoading(true);
    try {
      const res = await requestCreateLocation(data, tmpCoords[0], tmpCoords[1]);
      for (let i = 0; i < data.photos.length; i++) {
        const file = data.photos.item(i);
        if (!file) continue;
        await requestUploadFile(file, res.id);
      }
      setIsAdded(true);
    } catch (e) {
      console.log(e);
      toast("Не удалось создать локацию");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2 justify-between items-center mb-12">
        <h2 className="text-4xl font-bold">Добавление локации</h2>
        <Button
          size={"icon"}
          onClick={() => {
            closePage();
            handleIsEditing(false);
          }}
          variant={"ghost"}
        >
          <X className="size-6" />
        </Button>
      </div>
      {isAdded && (
        <div className="mx-auto text-center py-8 w-full flex items-center flex-col">
          <p className="text-light font-medium text-2xl mb-5">
            {"Успешно отправлено на модерацию!"}
          </p>
          <div className=" p-4 bg-primary/24 rounded-full aspect-square size-30">
            <CheckMark className="text-white" />
          </div>
        </div>
      )}
      {!isAdded && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0.5">
                    <span className="text-red-400">*</span>Название
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Интересное место" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0.5">
                    <span className="text-red-400">*</span>Категория
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((el) => (
                        <SelectItem key={el.id} value={el.name}>
                          {el.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0.5">
                    <span className="text-red-400">*</span>Краткое описание
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Опишите особенность за пару предложений"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0.5">
                    <span className="text-red-400">*</span>Полное описание
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Расскажите все самое прекрасное о локации"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yandex_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на Я.Карты</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Прокладывайте маршруты и делайте навигацию удобнее"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photos"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  {!!value}
                  <FormLabel className="gap-0.5">
                    <span className="text-red-400">*</span>Фотографии (до 5 шт.)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Фотография"
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/webp"
                      onChange={(event) => onChange(event.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!tmpCoords.length && (
              <p className="text-red-400">
                Необходимо выбрать на карте координаты локации
              </p>
            )}
            <CustomMap className="relative w-full h-60 xl:hidden" />
            <div className="flex justify-between items-start gap-3 flex-col-reverse ">
              <Button disabled={tmpCoords.length < 2} type="submit">
                {isLoading ? (
                  <Loader className="size-4 mx-auto animate-spin" />
                ) : (
                  "Отправить"
                )}
              </Button>
              <div className="flex gap-2">
                <Badge>
                  X: {tmpCoords[0] ? tmpCoords[0].toFixed(5) : "Не определено"}
                </Badge>
                <Badge>
                  Y: {tmpCoords[1] ? tmpCoords[1].toFixed(5) : "Не определено"}
                </Badge>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default FormModal;
