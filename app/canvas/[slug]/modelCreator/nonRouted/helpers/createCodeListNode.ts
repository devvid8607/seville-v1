import { Node } from "reactflow";

export const createCodeListNode = (
  newNodeId: string,
  parentMapModelID: string,
  parentMapNodeID: string,
  childMapId: string,
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
        parentMapModelId: parentMapModelID,
        parentMapNodeID: parentMapNodeID,
        childMapId: childMapId,
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
