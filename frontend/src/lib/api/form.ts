import type { PlaceDto } from "@/types/place";
import { request } from ".";

export const requestCreateLocation = async (
  data: {
    name: string;
    short_description: string;
    full_description: string;
    category: string;
  },
  x: number,
  y: number
): Promise<PlaceDto> => {
  return await request.post("places", { ...data, x, y });
};

export const requestUploadFile = async (file: File, id: string) => {
  const formdata = new FormData();
  if (!file) throw new Error("no file");
  formdata.append("file", file!);
  return await request.post(`/places/${id}/upload`, formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
