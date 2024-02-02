import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useSubdistrict = () => {
  const getSubdistrict = async (params: any) => {
    return await httpClient.get('/subdistrict?id='+params);
  };

  return useMutation<any, any, any>(
    "getSubdistrict",
    (params) => getSubdistrict(params),
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
