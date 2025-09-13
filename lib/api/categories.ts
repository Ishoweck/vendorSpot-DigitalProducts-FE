import { api } from "./base";

export const categoriesAPI = {
  getAll: () => api.get<{ success: boolean; data: any[] }>("/categories"),
};
