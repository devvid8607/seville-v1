//this component checks if a model exists in the current store, if not gets it from the api
import { useEffect, useState } from "react";
import useModelStore, {
  Model,
} from "../store/modelStore/ModelDetailsFromBackendStore"; // Adjust the import path accordingly
import { createModelData } from "../helpers/createModelData";
import { useTabStore } from "../../../nonRouted/store/TabStateManagmentStore";

// Assume this is your fetch function
export const fetchModelFromAPI = async (
  modelId: string,
  url: string
): Promise<Model | undefined> => {
  try {
    const response = await fetch(`${url}?modelId=${modelId}`);

    if (!response.ok) {
      console.error("Network response was not ok");
      return undefined; // Explicitly return undefined on failure
    }
    const model: Model = await response.json();
    return model; // Assumes response.json() correctly formats the model
  } catch (error) {
    console.error("Failed to fetch model:", error);
    return undefined; // Explicitly return undefined on error
  }
};

// Custom hook that encapsulates the logic
export const useGetModel = (dataSourceId: string, url: string): void => {
  const setModel = useTabStore((state) => state.setModel);
  const setLoading = useTabStore((state) => state.setLoading);

  const getModelById = useModelStore((state) => state.getModelById);
  const addModelToStore = useModelStore((state) => state.addModelToStore);

  useEffect(() => {
    const getModel = async () => {
      setLoading(true);
      let foundModel = getModelById(dataSourceId);

      if (!foundModel || foundModel === undefined) {
        foundModel = await fetchModelFromAPI(dataSourceId, url);
        if (foundModel) {
          addModelToStore(foundModel);
        } else {
          foundModel = createModelData();
          addModelToStore(foundModel);
        }
      }

      setModel(foundModel);
      setLoading(false);
    };

    getModel();
  }, [dataSourceId, url]);
};
