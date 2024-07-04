import { useModelNodesStore } from "../store/modelStore/ModelNodesStore";
export const saveModelCanvasNodes = () => {
  const { nodes: flowNodes } = useModelNodesStore.getState();
  //   const { nodeStructures } = useNodeStructureStore.getState();

  return { flowNodes };
};

export const saveModelEdges = () => {
  const { edges } = useModelNodesStore.getState();
  return edges;
};
