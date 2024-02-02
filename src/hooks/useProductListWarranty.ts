import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useProductListWarranty = () => {
  const getProductListWarranty = async (params: any) => {
    return await httpClient.get('/productlist_warranty?id='+params);
  };

  return useMutation<any, any, any>(
    "getProductListWarranty",
    (params) => getProductListWarranty(params),
    {
      onSuccess: (response) => {

        //  console.log(response);

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};
