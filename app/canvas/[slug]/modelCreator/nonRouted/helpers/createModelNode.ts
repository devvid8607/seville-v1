import { Node } from "reactflow";

export const createModelNode = (
  newNodeId: string,
  dataSourceId: string,
  dataSourceFriendlyName: string,
  datatype: string,
  currentNode?: Node | undefined,
  newNodePosition?: { x: number; y: number } | undefined,
  sourcePage?: string
) => {
  //alert(datatype);

  let newPosition: { x: number; y: number } = { x: 0, y: 0 };
  if (currentNode && !newNodePosition) {
    newPosition.x = currentNode.position.x + 1400;
    newPosition.y = currentNode.position.y;
  } else if (newNodePosition) {
    newPosition = newNodePosition;
  }
  // const newNodeType = datatype === "model" ? "modelNode" : "";
  // const newNodeId = uuidv4();
  const newNode = {
    id: newNodeId,
    type: datatype,
    position: newPosition,
    dragHandle: ".custom-drag-handle",
    data: {
      nodeId: newNodeId,
      modelDetails: {
        friendlyName: dataSourceFriendlyName,
        description: "",
        url: "",
        dataSourceId: dataSourceId,
        sourcePage: sourcePage,
      },
    },
  };
  return newNode;
  //addNode(newNode);
};

export const createMappingModelNode = (
  newNodeId: string,
  parentMapModelID: string,
  parentMapNodeID: string,
  dataSourceId: string,
  dataSourceFriendlyName: string,
  mapId: string,
  path: string,
  datatype: string,
  currentNode?: Node | undefined,
  newNodePosition?: { x: number; y: number } | undefined
) => {
  //alert(datatype);

  let newPosition: { x: number; y: number } = { x: 0, y: 0 };
  if (currentNode && !newNodePosition) {
    newPosition.x = currentNode.position.x + 1400;
    newPosition.y = currentNode.position.y;
  } else if (newNodePosition) {
    newPosition = newNodePosition;
  }
  const newNodeType = datatype === "model" ? "modelNode" : "";
  // const newNodeId = uuidv4();
  const newNode = {
    id: newNodeId,
    type: datatype,
    position: newPosition,
    dragHandle: ".custom-drag-handle",
    data: {
      nodeId: newNodeId,
      modelDetails: {
        friendlyName: dataSourceFriendlyName,
        parentMapModelId: parentMapModelID,
        parentMapNodeID: parentMapNodeID,
        description: "",
        url: "",
        dataSourceId: dataSourceId,
        mapId: mapId,
        path: path,
      },
    },
  };
  return newNode;
  //addNode(newNode);
};
