import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useProvince = () => {
  const getProvince = async () => {
    return await httpClient.get('/province');
  };
  return useQuery(
    "Province",
    () => getProvince(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

