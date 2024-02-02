import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useCustomer = () => {
  const getCustomer = async () => {
    return await httpClient.get('/customer');
  };
  return useQuery(
    "Customer",
    () => getCustomer(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateCustomer = () => {

  const queryClient = useQueryClient();

  const createCustomer = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });


    return await httpClient.post("/create_customer", data);
  };

  return useMutation<any, any, any>(
    "CreateCustomer",
    (params) => createCustomer(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Customer');

    },
      onError: (error) => {

        console.log(error);


      },
    }
  );
};

export const useUpdateCustomer = () => {

  const queryClient = useQueryClient();

  const updateCustomer = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_customer", data);
  };

  return useMutation<any, any, any>(
    "UpdateCustomer",
    (params) => updateCustomer(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Customer');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteCustomer = () => {

  const queryClient = useQueryClient();

  const deleteCustomer = async (Customer_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('Customer_Index', Customer_Index || "");

    return await httpClient.post("/delete_customer", data);
  };

  return useMutation<any, any, any>(
    "DeleteCustomer",
    (Customer_Index) => deleteCustomer(Customer_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Customer');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
