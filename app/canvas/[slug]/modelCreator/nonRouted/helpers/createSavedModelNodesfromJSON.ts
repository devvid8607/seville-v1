import React from "react";
import { Node } from "reactflow";
import { useModelNodesStore } from "../store/modelStore/ModelNodesStore";

export const createSavedModelNodesfromJSON = async (savedNodes: Node[]) => {
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
  await new Promise((resolve) => setTimeout(resolve, 100));
};

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
