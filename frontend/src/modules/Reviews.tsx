import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import {
  requestCreateReview,
  requestReviews,
  type Review,
} from "@/lib/api/reviews";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import dayjs from "dayjs";
import { usePlaces } from "@/context/placesContext/usePlaces";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "От 2 символов" })
    .max(50, { message: "До 50 символов" }),
  text: z
    .string()
    .min(5, { message: "От 5 символов" })
    .max(500, { message: "До 500 символов" }),
});

const Reviews = ({ placeId }: { placeId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setStars] = useState(0);
  const { places, setPlaces } = usePlaces();
  const [areReviewsLoading, setAreReviewsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      text: "",
    },
  });
  useEffect(() => {
    (async () => {
      try {
        setAreReviewsLoading(true);
        const reviews = await requestReviews(placeId);

        setReviews(reviews);
      } catch (e) {
        console.log(e);
        setReviews([]);
      } finally {
        setAreReviewsLoading(false);
      }
    })();
  }, [placeId]);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const res = await requestCreateReview({ ...data, placeId, rating });
      setReviews((prev) => [res, ...prev]);
      const pItem = places?.find((el) => el.id === placeId);
      if (pItem) {
        setPlaces((prev) => [
          ...prev.filter((el) => el.id !== placeId),
          {
            ...pItem,
            rating: pItem.rating + rating / (pItem.reviews_amount + 1),
            reviews_amount: pItem.reviews_amount + 1,
          },
        ]);
      }
      form.setValue("name", "");
      form.setValue("text", "");
    } catch (e) {
      if (e) console.log(e);
      const errorStr =
        typeof e === "string"
          ? e
          : e && typeof e === "object" && "message" in e
          ? e.message
          : "Не удалось опубликовать отзыв";
      form.setError("text", { message: errorStr as string });
    }
  };

  return (
    <div>
      <p className="mb-4 font-bold">Оставить отзыв</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mt-6 space-y-4 mb-6"
        >
          <Rating value={rating} onValueChange={(v) => setStars(v)}>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton type="button" key={index} />
            ))}
          </Rating>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Виталий" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отзыв</FormLabel>
                <FormControl>
                  <Textarea placeholder="Отличное место" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Отправить</Button>
        </form>
      </Form>
      <h3 className="mb-4 font-bold text-lg">Отзывы ({reviews.length})</h3>
      {areReviewsLoading && <Loader className="size-6 animate-spin mx-auto" />}
      {!areReviewsLoading &&
        reviews.map((el) => (
          <div
            key={el.id}
            className="py-2 border-[0.5px] border-x-0 border-[#ccc] flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-gray-200 rounded-full aspect-square size-10 flex justify-center items-center">
                  <User className="size-6" />
                </div>
                <div className="">
                  <p className="font-semibold">{el.name}</p>
                  <p className="text-gray-400 font-light text-xs">
                    {dayjs(el.created_at).format("DD.MM.YYYY г.")}
                  </p>
                </div>
              </div>
              <div>
                <Rating value={el.rating} onValueChange={() => {}}>
                  {Array.from({ length: 5 }).map((_, index) => (
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
                          fill={index < el.rating ? "gold" : "transparent"}
                          stroke="gold"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3190_16977">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  ))}
                </Rating>
              </div>
            </div>
            <p className="text-sm">{el.text}</p>
          </div>
        ))}
    </div>
  );
};

export default Reviews;
