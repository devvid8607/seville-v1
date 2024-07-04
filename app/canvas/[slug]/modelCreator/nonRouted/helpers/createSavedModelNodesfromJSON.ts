import React from "react";
import { Node } from "reactflow";
import { useModelNodesStore } from "../store/modelStore/ModelNodesStore";

export const createSavedModelNodesfromJSON = (savedNodes: Node[]) => {
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
};
