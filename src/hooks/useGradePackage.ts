import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGradePackage = () => {
  const getGradePackage = async () => {
    return await httpClient.get('/grade_package');
  };
  return useQuery(
    "GradePackage",
    () => getGradePackage(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

