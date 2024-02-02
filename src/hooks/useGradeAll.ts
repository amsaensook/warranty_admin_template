import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGradeAll = () => {
  const getGradeAll = async () => {
    return await httpClient.get('/grade_all');
  };
  return useQuery(
    "GradeAll",
    () => getGradeAll(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

