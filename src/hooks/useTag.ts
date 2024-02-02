import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveStatus = () => {
  const queryClient = useQueryClient();

  const ReceiveStatus = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    
    return await httpClient.post("/select_receivestatus", data);
  };

  return useMutation<any, any, any>(
    "ReceiveStatus",
    (params) => ReceiveStatus(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useSelectTag = () => {
  const queryClient = useQueryClient();

  const SelectTag = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    

    return await httpClient.post("/select_tag", data);
  };

  return useMutation<any, any, any>(
    "SelectTag",
    (params) => SelectTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};




