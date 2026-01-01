import api from "./baseApiClient";

export const getBanners = async () => {
  const res = await api.get("banner/getall/paginated?skip=0&top=10");
  return res.data.successData;
};
