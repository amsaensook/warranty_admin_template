import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useClaim = () => {
  const getClaim = async (params: any) => {
    return await httpClient.get('/claim?warrantyid='+params);
  };
  return useMutation<any, any, any>(
    "getClaim",
    (params) => getClaim(params),
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

export const useCreateClaim = () => {

  const queryClient = useQueryClient();

  const createClaim = async (params: any): Promise<any> => {
  let data = new FormData();

      data.append('data',JSON.stringify(params) || "");

  console.log("LOVE =",data);

    return await httpClient.post("/create_claim", data);
  };

  return useMutation<any, any, any>(
    "CreateClaim",
    (params) => createClaim(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Claim');

    },
      onError: (error) => {

        console.log(error);


      },
    }
  );
};

export const useUpdateClaim = () => {

  const queryClient = useQueryClient();

  const updateClaim = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('data',JSON.stringify(params) || "");

    return await httpClient.post("/update_claim", data);
  };

  return useMutation<any, any, any>(
    "UpdateClaim",
    (params) => updateClaim(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Claim');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteClaim = () => {

  const queryClient = useQueryClient();

  const deleteClaim = async (Claim_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('Claim_Index', Claim_Index || "");

    return await httpClient.post("/delete_claim", data);
  };

  return useMutation<any, any, any>(
    "DeleteClaim",
    (Claim_Index) => deleteClaim(Claim_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Claim');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
