import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useRegisterProduct = () => {
  const getRegisterProduct = async () => {
    return await httpClient.get('/registerproduct');
  };
  return useQuery(
    "RegisterProduct",
    () => getRegisterProduct(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateRegisterProduct = () => {

  const queryClient = useQueryClient();

  const createRegisterProduct = async (params: any): Promise<any> => {
  let data = new FormData();

      data.append('data',JSON.stringify(params) || "");

  console.log("LOVE =",data);

    return await httpClient.post("/create_registerproduct", data);
  };

  return useMutation<any, any, any>(
    "CreateRegisterProduct",
    (params) => createRegisterProduct(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('RegisterProduct');

    },
      onError: (error) => {

        console.log(error);


      },
    }
  );
};

export const useUpdateRegisterProduct = () => {

  const queryClient = useQueryClient();

  const updateRegisterProduct = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('data',JSON.stringify(params) || "");

    return await httpClient.post("/update_registerproduct", data);
  };

  return useMutation<any, any, any>(
    "UpdateRegisterProduct",
    (params) => updateRegisterProduct(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('RegisterProduct');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteRegisterProduct = () => {

  const queryClient = useQueryClient();

  const deleteRegisterProduct = async (Warranty_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('Warranty_Index', Warranty_Index || "");

    return await httpClient.post("/delete_registerproduct", data);
  };

  return useMutation<any, any, any>(
    "DeleteRegisterProduct",
    (Warranty_Index) => deleteRegisterProduct(Warranty_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('RegisterProduct');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
