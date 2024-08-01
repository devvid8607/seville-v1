import { apiGet, apiPost } from "@/app/helpers/apiClient";
import { CanvasIndexItem } from "./useModelQueries";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";

//#region fetch layout section
const fetchLayouts = async (userId: string): Promise<CanvasIndexItem[]> => {
  return apiGet<CanvasIndexItem[]>(`/layouts/${userId}`);
};

export const useFetchLayouts = (userId: string) => {
  return useQuery<CanvasIndexItem[], Error>({
    queryKey: ["layouts", userId],
    queryFn: () => fetchLayouts(userId),
  });
};
//#endregion

//#region create new layout section

interface NewLayoutData {
  name: string;
  description: string;
  template: string;
  userId?: string;
}

interface ModelResponse {
  layoutId: string;
}

const createNewLayout = async (data: NewLayoutData): Promise<ModelResponse> => {
  return apiPost<ModelResponse>(`/layouts/${data.userId}`, data);
};

export const useCreateLayout = () => {
  const queryClient = useQueryClient();

  const [layoutId, setLayoutId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createNewLayout,
    onSuccess: (data: ModelResponse) => {
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
      console.log("Layout created with ID:", data.layoutId);
      setLayoutId(data.layoutId);
    },
    onError: (error: Error) => {
      console.error("Error creating layout:", error);
    },
  });

  return { mutation, layoutId };
};
//#endregion
