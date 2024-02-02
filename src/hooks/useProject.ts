import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useProject = () => {
  const getProject = async () => {
    return await httpClient.get('/project');
  };
  return useQuery(
    "Project",
    () => getProject(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateProject = () => {

  const queryClient = useQueryClient();

  const createProject = async (params: any): Promise<any> => {
    console.log('PARA =',params);
    let data = new FormData();

    data.append('data',JSON.stringify(params) || "");
    // Object.keys(params).forEach((value) => {
    //   data.append(value, params[value] || "");
    // });

    // Object.keys(params).forEach((value) => {
    //   if (value === 'Picture') {
    //     data.append('data', params[value] && params[value] != undefined ? params[value]['fileList'][0]?.originFileObj || "" : "");
    //   } else {
    //     data.append('data',JSON.stringify(params[value]) || "");
    //   }
    // });

    return await httpClient.post("/create_project", data);
  };

  return useMutation<any, any, any>(
    "CreateProject",
    (params) => createProject(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Project');

    },
      onError: (error) => {

        console.log(error);


      },
    }
  );
};

export const useUpdateProject = () => {

  const queryClient = useQueryClient();

  const updateProject = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('data',JSON.stringify(params) || "");

    return await httpClient.post("/update_project", data);
  };

  return useMutation<any, any, any>(
    "UpdateProject",
    (params) => updateProject(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Project');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteProject = () => {

  const queryClient = useQueryClient();

  const deleteProject = async (Project_ID: any): Promise<any> => {

    let data = new FormData();

    data.append('Project_ID', Project_ID || "");

    return await httpClient.post("/delete_project", data);
  };

  return useMutation<any, any, any>(
    "DeleteProject",
    (Project_ID) => deleteProject(Project_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Project');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
