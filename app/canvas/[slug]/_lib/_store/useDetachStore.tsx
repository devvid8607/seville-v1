import { useCallback } from "react";
import { useFlowNodeStore } from "../../flowComponents/_lib/_store/FlowNodeStore";
import { Edge } from "reactflow";
import { useNodeStructureStore } from "../../flowComponents/_lib/_store/FlowNodeStructureStore";

function useDetachNodesStore() {
  const { nodes, updateNode, removeNode, edges, removeEdge } =
    useFlowNodeStore();

  const { nodeStructures, updateNodeStructure } = useNodeStructureStore();

  const detachNodes = useCallback(
    (ids: string[], removeParentId?: string) => {
      const edgesToRemove: Edge[] = [];

      const nextNodes = nodes.map((n) => {
        if (ids.includes(n.id) && n.parentNode) {
          const parentNode = nodes.find((node) => node.id === n.parentNode);

          if (parentNode) console.log("Parent node:", parentNode);

          edges.forEach((edge) => {
            if (edge.source === n.id || edge.target === n.id) {
              edgesToRemove.push(edge);
            }
          });

          const newX =
            (parentNode?.position?.x ?? 0) -
            // (parentNode?.width ?? 0) +
            (n?.width ?? 0);
          const newY =
            (parentNode?.position?.y ?? 0) -
            // (parentNode?.height ?? 0) +
            (n?.height ?? 0);

          // Return the updated node
          return {
            ...n,
            position: { x: newX, y: newY },
            positionAbsolute: { x: newX, y: newY },
            extent: undefined,
            parentNode: undefined,
          };
        }
        return n;
      });

      // Apply the node updates
      nextNodes.forEach((node) => {
        if (!removeParentId || node.id !== removeParentId) {
          updateNode(node);

          if (ids.includes(node.id)) {
            // Update the corresponding node structure
            updateNodeStructure(node.id, {
              parentIteratorNode: "",
              position: node.position,
            });
          }
        }
      });

      // Remove the identified edges
      edgesToRemove.forEach((edge) => {
        removeEdge(edge.id);
      });

      // Optionally, remove the parent node
      if (removeParentId) {
        removeNode(removeParentId);
      }
    },
    [nodes, updateNode, removeNode]
  );

  return detachNodes;
}
export default useDetachNodesStore;
