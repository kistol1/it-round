import qs from "qs";
import { request } from ".";

export const requestPlaces = async (filters: string[]) => {
  return await request.get("places", {
    params: {
      category: filters,
      approved: true,
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
};

export const requestCategories = async () => {
  return await request.get("category");
};

export const requestUnapprovedPlaces = async () => {
  return await request.get("places", { params: { approved: false } });
};

export const requestApprovePlace = async (id: string) => {
  return await request.post(`places/${id}/approve`);
};

export const requestDeletePlace = async (id: string) => {
  return await request.delete(`places/${id}`);
};
