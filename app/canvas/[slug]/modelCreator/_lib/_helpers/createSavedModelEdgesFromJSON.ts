import { Edge } from "reactflow";

import { useModelNodesStore } from "../_store/modelStore/ModelNodesStore";

export const createSavedModelEdgesFromJSON = async (savedEdges: Edge[]) => {
  const newEdges = savedEdges.map((savedEdge) => ({
    id: savedEdge.id,
    source: savedEdge.source,
    target: savedEdge.target,
    sourceHandle: savedEdge.sourceHandle,
    targetHandle: savedEdge.targetHandle,
    type: savedEdge.type,
    zIndex: savedEdge.zIndex,
  }));

  useModelNodesStore.getState().addEdges(newEdges);
  await new Promise((resolve) => setTimeout(resolve, 3000));
};
