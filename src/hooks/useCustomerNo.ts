import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useCustomerNo = () => {
  const getCustomerNo = async (params: any) => {
    return await httpClient.get('/customer_no');
  };

  return useMutation<any, any, any>(
    "getCustomerNo",
    (params) => getCustomerNo(params),
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
