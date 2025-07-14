import { request } from ".";

export const requestLogin = async (login: string, password: string) => {
  return await request.post("login", { login, password });
};

export const requestMyAccount = async () => {
  return await request.get("user");
};
