import { Node } from "reactflow";
import { useModelNodesStore } from "../_store/modelStore/ModelNodesStore";
import { ModelType } from "../_types/ModelTypes";

export const useCreateSavedModelNodesFromJSON = (savedNodes: ModelType[]) => {
  // const addNode = useModelNodesStore((state) => state.addNode);

  // useEffect(() => {
  savedNodes.forEach((savedNode) => {
    const newNode = {
      id: savedNode.id,
      type: savedNode.nodeType,
      position: savedNode.position,
      dragHandle: ".custom-drag-handle",
      data: {
        nodeId: savedNode.id,
        modelDetails: {
          friendlyName: savedNode.metaData?.friendlyName || "Default Name",
          description: savedNode.metaData?.description || "Default Description",
          url: savedNode.metaData?.url || "",
          dataSourceId:
            savedNode.metaData?.dataSourceId || "Default DataSource",
          name: savedNode.metaData?.name || "Default Name",
          createdBy: savedNode.metaData?.createdBy || "",
          modifiedBy: savedNode.metaData?.modifiedBy || "Default Modifier",
          dateCreated: savedNode.metaData?.dateCreated || "Default Date",
          dateModified: savedNode.metaData?.dateModified || "Default Date",
          sourcePage: savedNode.metaData?.sourcePage || "Default Source Page",
        },
      },
    };
    useModelNodesStore.getState().addNode(newNode);
  });
  // }, [savedNodes]);
};

export const CreateSavedModelNode = (savedNode: ModelType): Node => {
  // const addNode = useModelNodesStore((state) => state.addNode);

  // useEffect(() => {

  const newNode = {
    id: savedNode.id,
    type: savedNode.nodeType,
    position: savedNode.position,
    dragHandle: ".custom-drag-handle",
    data: {
      nodeId: savedNode.id,
      modelDetails: {
        friendlyName: savedNode.metaData?.friendlyName || "Default Name",
        description: savedNode.metaData?.description || "Default Description",
        url: savedNode.metaData?.url || "",
        dataSourceId: savedNode.metaData?.dataSourceId || "Default DataSource",
        name: savedNode.metaData?.name || "Default Name",
        createdBy: savedNode.metaData?.createdBy || "",
        modifiedBy: savedNode.metaData?.modifiedBy || "Default Modifier",
        dateCreated: savedNode.metaData?.dateCreated || "Default Date",
        dateModified: savedNode.metaData?.dateModified || "Default Date",
        sourcePage: savedNode.metaData?.sourcePage || "Default Source Page",
      },
    },
  };
  useModelNodesStore.getState().addNode(newNode);
  return newNode;
  // }, [savedNodes]);
};

// export const useCreateSavedModelNodesFromJSONReset = (
//   savedNodes: ModelType[]
// ) => {
//   const addNode = useModelNodesStore().addNode;

//   savedNodes.forEach((savedNode) => {
//     const newNode = {
//       id: savedNode.id,
//       type: savedNode.nodeType,
//       position: savedNode.position,
//       dragHandle: ".custom-drag-handle",
//       data: {
//         nodeId: savedNode.id,
//         modelDetails: {
//           friendlyName: savedNode.metaData?.friendlyName || "Default Name",
//           description: savedNode.metaData?.description || "Default Description",
//           url: savedNode.metaData?.url || "",
//           dataSourceId:
//             savedNode.metaData?.dataSourceId || "Default DataSource",
//           name: savedNode.metaData?.name || "Default Name",
//           createdBy: savedNode.metaData?.createdBy || "",
//           modifiedBy: savedNode.metaData?.modifiedBy || "Default Modifier",
//           dateCreated: savedNode.metaData?.dateCreated || "Default Date",
//           dateModified: savedNode.metaData?.dateModified || "Default Date",
//           sourcePage: savedNode.metaData?.sourcePage || "Default Source Page",
//         },
//       },
//     };
//     addNode(newNode);
//   });
// };
