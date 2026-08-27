import api from "./api";

export const getAdmins = async () => {
  const response = await api.get("/admins");

  return response.data;
};