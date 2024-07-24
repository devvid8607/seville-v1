import React from "react";
import { Node } from "reactflow";
import { useModelNodesStore } from "../_store/modelStore/ModelNodesStore";

export const createSavedModelNodesfromJSON = async (savedNodes: Node[]) => {
  savedNodes &&
    savedNodes.length > 0 &&
    savedNodes.forEach((savedNode) => {
      const newNode = {
        id: savedNode.id,
        type: savedNode.type,
        position: savedNode.position,
        dragHandle: ".custom-drag-handle",
        data: savedNode.data,
        width: savedNode.width,
      };

      useModelNodesStore.getState().addNode(newNode);
    });
  await new Promise((resolve) => setTimeout(resolve, 3000));
};

// export const createSavedModelNodesfromJSON = async (
//   savedNodes: Node[]
// ): Promise<void> => {
//   const addNodePromises = savedNodes.map(async (savedNode) => {
//     const newNode = {
//       id: savedNode.id,
//       type: savedNode.type,
//       position: savedNode.position,
//       dragHandle: ".custom-drag-handle",
//       data: savedNode.data,
//       width: savedNode.width,
//     };

//     useModelNodesStore.getState().addNode(newNode);
//   });

//   await Promise.all(addNodePromises);
// };

export const createSavedModelNodefromJSON = (savedNode: Node) => {
  const newNode = {
    id: savedNode.id,
    type: savedNode.type,
    position: savedNode.position,
    dragHandle: ".custom-drag-handle",
    data: savedNode.data,
    width: savedNode.width,
  };
  useModelNodesStore.getState().addNode(newNode);
};
