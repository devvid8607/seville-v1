import { apiGet } from "@/app/helpers/apiClient";

import { UseQueryResult, useQuery } from "@tanstack/react-query";
import canvasData from "../../_lib/dummyData/canvasData.json";
import canvasData2 from "../../_lib/dummyData/canvasData2.json";
import { canvasHeader } from "@/app/canvas/[slug]/_lib/_types/canvasHeader";
import { Edge, Node } from "reactflow";

interface LoadCanvasResponse {
  canvasData: {
    header?: canvasHeader;
    visibleNodes?: Node[];
    visibleEdges?: Edge[];
    systemNodes?: Node[];
  };
}

// Define the function to load canvas data
export const loadCanvas = (
  userId: string,
  modelId: string
): Promise<LoadCanvasResponse> => {
  return apiGet<LoadCanvasResponse>(
    `/canvas?userId=${userId}&modelId=${modelId}`
  );
};

export const loadCanvasDummy = async (
  userId: string,
  modelId: string
): Promise<LoadCanvasResponse> => {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  //   Return a dummy response
  return {
    canvasData: canvasData,
  };
  //   const isSuccess = Math.random() > 0.5;

  //   if (isSuccess) {
  //     // Return a dummy response
  //     return {
  //       canvasData: `Dummy canvas data for user ${userId} and model ${modelId}`,
  //     };
  //   } else {
  //     // Simulate an error
  //     throw new Error(
  //       `Failed to load canvas data for user ${userId} and model ${modelId}`
  //     );
  //   }
};

export const useCanvasData = (
  userId: string,
  modelId: string | null
): UseQueryResult<LoadCanvasResponse, Error> => {
  return useQuery<LoadCanvasResponse, Error>({
    queryKey: ["canvasData", modelId, userId],
    queryFn: () => loadCanvasDummy(userId, modelId!),
    enabled: !!userId && !!modelId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    gcTime: 0,
  });
};
