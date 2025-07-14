import type { Place } from "@/types/place";
import { request } from ".";

type CreateReviewDto = {
  name: string;
  text: string;
  rating: number;
  placeId: string;
};

export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  created_at: Date;
  place: Place;
};

export const requestReviews = async (placeId: string) => {
  return await request.get(`reviews/${placeId}`);
};

export const requestCreateReview = async (
  data: CreateReviewDto
): Promise<Review> => {
  return await request.post(`reviews`, data);
};
