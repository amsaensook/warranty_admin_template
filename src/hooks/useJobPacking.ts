import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useJobPacking = () => {
  const getJobPacking = async () => {
    return await httpClient.get('/jobpacking');
  };
  return useQuery(
    "JobPacking",
    () => getJobPacking(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateJobPacking = () => {

  const queryClient = useQueryClient();

  const createJobPacking = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

      return await httpClient.post("/create_jobpacking", data);
  };

  return useMutation<any, any, any>(
    "CreateJobPacking",
    (params) => createJobPacking(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobPacking');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateJobPacking = () => {

  const queryClient = useQueryClient();

  const updateJobPacking = async (params: any): Promise<any> => {
    
    // console.log('PARA =',params);
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_jobpacking", data);
  };

  return useMutation<any, any, any>(
    "UpdateJobPacking",
    (params) => updateJobPacking(params),
    {
      onSuccess: (response) => {
        // console.log('UpdateJobPacking =',response);
        queryClient.invalidateQueries('JobPacking');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteJobPacking = () => {

  const queryClient = useQueryClient();

  const deleteJobPacking = async (JobPacking_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('Job_No', JobPacking_ID || "");

    

    return await httpClient.post("/delete_jobpacking", data);
  };

  return useMutation<any, any, any>(
    "DeleteJobPacking",
    (JobPacking_ID) => deleteJobPacking(JobPacking_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobPacking');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useJobPackingItem = () => {
  const getJobPackingItem = async (params: any) => {
    return await httpClient.get('/jobpacking_item?JobPacking_ID='+params);
  };

  return useMutation<any, any, any>(
    "getJobPackingItem",
    (params) => getJobPackingItem(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('JobPackingID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};

export const useCreateQrCode = () => {

  const queryClient = useQueryClient();

  const createQrCode = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data1) || "");
      data.append('data2',JSON.stringify(params.data2) || "");
      data.append('data3',JSON.stringify(params.data3) || "");
      data.append('data4',JSON.stringify(params.data4) || "");
      data.append('data5',JSON.stringify(params.data5) || "");
      data.append('data6',JSON.stringify(params.data6) || "");

      return await httpClient.post("/create_qrcode", data);
  };

  return useMutation<any, any, any>(
    "CreateQrCode",
    (params) => createQrCode(params),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('QrCode');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
  
};

export const useClearQrCode = () => {

  const queryClient = useQueryClient();

  const clearQrCode = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data1) || "");

      return await httpClient.post("/clear_qrcode", data);
  };

  return useMutation<any, any, any>(
    "ClearQrCode",
    (params) => clearQrCode(params),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('QrCode');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
  
};
