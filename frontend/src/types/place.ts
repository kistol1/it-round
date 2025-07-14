export type Place = {
  id: string;
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  x: number;
  y: number;
  rating: number;
  reviews_amount: number;
  yandex_link?: string;
  photos: { id: string; file_name: string }[];
};
export type PlaceDto = {
  name: string;
  short_description: string;
  full_description: string;
  photo: unknown;
  category: string;
  x: number;
  y: number;
  id: string;
  is_approved: boolean;
};
