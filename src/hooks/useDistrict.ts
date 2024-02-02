import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useDistrict = () => {
  const getDistrict = async (params: any) => {
    return await httpClient.get('/district?id='+params);
  };

  return useMutation<any, any, any>(
    "getDistrict",
    (params) => getDistrict(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('BomID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};
