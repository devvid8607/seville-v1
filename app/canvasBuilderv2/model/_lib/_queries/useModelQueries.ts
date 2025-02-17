// hooks/useCreateModel.ts
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/app/helpers/apiClient";
import { modelIndexData } from "@/app/canvas/dummyDataForIndex";
import { useState } from "react";
import { loadCanvas, loadCanvasDummy, useCanvasData } from "./useCanvasQueries";
import { Model } from "../_store/modelStore/ModelDetailsFromBackendStore";
import { queryClient } from "@/app/providers/QueryClientProvider";

interface NewModelData {
  name: string;
  description: string;
  template: string;
}

interface ModelResponse {
  id: string;
}

export interface CanvasIndexItem {
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  createdBy: string;
  modifiedBy: string;
  dateCreated: string;
  dateModified: string;
}

const userId = "dummyuser";

//#region create new model section
const createNewModel = async (data: NewModelData): Promise<ModelResponse> => {
  return apiPost<ModelResponse>("/models", data);
};

const createNewModelDummy = async (
  data: NewModelData
): Promise<ModelResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "dummy-model-id" });
    }, 1000); // Simulate a network delay
  });
};

export const useCreateModel = () => {
  const queryClient = useQueryClient();

  const [modelId, setModelId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createNewModel,
    onSuccess: (data: ModelResponse) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      console.log("Model created with ID:", data.id);
      setModelId(data.id);
    },
    onError: (error: Error) => {
      console.error("Error creating model:", error);
    },
  });

  return { mutation, modelId };
};
//#endregion

//#region fetch models section
const fetchModels = async (): Promise<CanvasIndexItem[]> => {
  return apiGet<CanvasIndexItem[]>("/allmodels");
};

const fetchModelsDummy = async (): Promise<CanvasIndexItem[]> => {
  // Simulate an API call with dummy data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modelIndexData);
    }, 1000); // Simulate network delay
  });
};

export const useFetchModels = () => {
  return useQuery<CanvasIndexItem[], Error>({
    queryKey: ["allmodels"],
    queryFn: fetchModels,
  });
};
//#endregion

//#region create model and fetch canvas based on model id
export const useCreateModelAndFetchCanvas = () => {
  const queryClient = useQueryClient();
  const [modelId, setModelId] = useState<string | null>(null);

  const createModelMutation = useMutation({
    mutationFn: createNewModelDummy,
    onSuccess: (data: ModelResponse) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      console.log("Model created with ID:", data.id);
      setModelId(data.id);
    },
    onError: (error: Error) => {
      console.error("Error creating model:", error);
    },
  });

  const {
    data: canvasData,
    error: canvasDataError,
    isLoading: isCanvasDataLoading,
    isError: isCanvasDataError,
  } = useCanvasData(userId, modelId);

  return {
    createModel: createModelMutation.mutate,
    createModelStatus: createModelMutation.status,
    modelError: createModelMutation.error,
    canvasData,
    canvasDataError,
    isCanvasDataLoading,
    isCanvasDataError,
  };
};
//#endregion

//#region fetch a model based on id
export const fetchModelById = async (modelId: string) => {
  return apiGet<Model>(`/models/${modelId}`);
};

export const useFetchModelById = (modelId: string) => {
  return useQuery<Model, Error>({
    queryKey: ["models", modelId],
    queryFn: () => fetchModelById(modelId),
    enabled: !!modelId,
  });
};

//#endregion

export const handleModelSelection = async (
  selectedModelId: string
): Promise<Model | undefined> => {
  if (!selectedModelId) {
    return undefined;
  }

  try {
    const fetchedModel = await queryClient.fetchQuery({
      queryKey: ["models", selectedModelId],
      queryFn: () => fetchModelById(selectedModelId),
    });

    if (fetchedModel) {
      return fetchedModel;
    }
  } catch (error) {
    console.error("Error fetching model:", error);
  }

  return undefined;
};

//save models

interface SaveModelResponse {
  message: string;
}

const saveModels = async (data: Model[]): Promise<SaveModelResponse> => {
  return apiPost("/savemodels", data);
};

export const useSaveModels = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SaveModelResponse, Error, Model[]>({
    mutationFn: saveModels,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      console.log("Models saved successfully:", data.message);
    },
    onError: (error) => {
      console.error("Error saving models:", error);
    },
  });

  return mutation;
};
