import { NodeStructure } from "../../../../../../FlowStore/FlowNodeStructureStore";
import { NodeStructureOutput } from "../../../../../../FlowTypes/SevilleSchema";
import { Variable } from "../../../../ContextDataNode/Store/CommonStoreType";
import { DataType } from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";
import { Model } from "../../../../_store/modelStore/ModelDetailsFromBackendStore";
import { FieldType } from "../../../../_types/FieldType";
import { DropTypes, TreeDataType } from "./sevilleTreeTypes/TreeTypes";
import { v4 as uuidv4 } from "uuid";

export const transformModelsToTreeData = (
  models: Model[],
  expandedNodes?: Record<string, boolean>
): TreeDataType[] => {
  const findModelById = (models: Model[], modelId: string): Model | undefined =>
    models.find((model) => model.modelId === modelId);

  const transformAttributeToNode = (
    attr: FieldType,
    parentId: string,
    depth: number = 0, // Starting depth
    maxDepth: number = 10 // Adjusted max depth to avoid infinite recursion
  ): TreeDataType => {
    if (depth > maxDepth) {
      // Prevent further recursion if the max depth is exceeded

      return {
        ...attr,
        id: attr.id,
        parentId: parentId,
        parentName: null,
        title: `Depth limit reached for ${attr.friendlyName}`,
        children: [],
        draggable: true,
        isOpen: expandedNodes ? expandedNodes[attr.id] : false,
        dropType: DropTypes.Model,
      };
    }

    const node: TreeDataType = {
      ...attr,
      id: attr.id,
      parentId: parentId,
      parentName: null,
      title: attr.friendlyName || attr.name,
      children: [],
      draggable: true,
      isOpen: expandedNodes ? expandedNodes[attr.id] : false,
      dropType: DropTypes.Model,
    };

    if (
      attr.dataType === "model" &&
      attr.dataSourceId &&
      !attr.dataSourceFriendlyName
    ) {
      const referencedModel = findModelById(models, attr.dataSourceId);
      if (referencedModel) {
        const childrenNodes: TreeDataType[] = referencedModel.attributes.map(
          (attribute) =>
            transformAttributeToNode(attribute, attr.id, depth + 1, maxDepth)
        );
        node.children = childrenNodes;
      }
    } else {
      // If it's a model attribute with dataSourceId and dataSourceFriendlyName, keep children empty
      node.children = [];
    }

    return node;
  };

  return models.map((model) => {
    const filteredAttributes = model.attributes.filter(
      (attribute) => !attribute.key
    );
    return {
      id: model.modelId,
      parentId: null,
      parentName: null,
      title: model.modelFriendlyName || model.modelName,
      name: model.modelName,
      dataType: "model",
      draggable: true,
      dataSourceId: model.modelId,
      isOpen: expandedNodes ? expandedNodes[model.modelId] : false,
      dropType: DropTypes.Model,
      children: filteredAttributes.map((attr) =>
        transformAttributeToNode(attr, model.modelId, 0, 10)
      ),
    };
  });
};

export const transformDataTypesToTreeData = (
  types: DataType[]
): TreeDataType[] => {
  return types.map((type) => ({
    id: type.id,
    parentId: null,
    parentName: null,
    title: type.name,
    name: type.code,
    children: [],
    isOpen: false,
    type: type.code,
    draggable: true,
    properties: type.properties,
    dropType: DropTypes.DataType,
  }));
};

// Helper function to transform the store data to the TreeDataType structure
export const transformVariablesToTreeData = (
  variables: Variable[],
  parentId: string | null = null,
  parentName: string | null = null
): TreeDataType[] => {
  return variables.map((variable) => {
    const treeData: TreeDataType = {
      id: variable.id,
      parentId,
      parentName,
      type: variable.type,
      title: variable.name, // Assuming title is the display name you want
      name: variable.name,
      draggable: true,
      dropType: DropTypes.GlobalVar,
      dropDetails: {
        droppedName: variable.name,
        droppedId: variable.id,
        parentId: "",
        doSelfNodeCheck: false,
        doPreviousOutputCheck: false,
        doInputModelCheck: false,
        typeCheck: [variable.type],
      },
      children: variable.children
        ? transformVariablesToTreeData(
            variable.children,
            variable.id,
            variable.name
          )
        : [],
      isOpen: false,
    };

    // Handle additional logic if variable has referencedModelDetails

    return treeData;
  });
};

// export const transformOutputsToTreeDataTypes = (
//   data: NodeStructureOutput[],
//   parentId: string | null = null,
//   nodeId?: string
// ): TreeDataType[] => {
//   return data.map((node) =>
//     transformOutputToTreeDataType(node, parentId, nodeId)
//   );
// };

// const transformOutputToTreeDataType = (
//   data: NodeStructureOutput,
//   parentId: string | null,
//   nodeId?: string
// ): TreeDataType => {
//   return {
//     id: uuidv4(),
//     parentId: parentId,
//     title: data.label,
//     name: data.name,
//     draggable: true,
//     children: data.children
//       ? transformOutputsToTreeDataTypes(
//           data.children,
//           String(data.id),
//           data.parentNodeId
//         )
//       : [],
//     isOpen: false,
//     type: data.allowedDatatypes,
//     parentName: data.userProvidedName ? data.userProvidedName : "",
//     referencedNodeDetails: data.parentNodeId
//       ? {
//           referencedNodeId: data.parentNodeId,
//           source: "nodeOutputs",
//           outputId: data.outputId ? data.outputId : "",
//           kind: data.kind,
//         }
//       : nodeId
//       ? {
//           referencedNodeId: nodeId,
//           source: "nodeOutputs",
//           outputId: data.outputId ? data.outputId : "",
//           kind: data.kind,
//         }
//       : undefined,
//   };
// };

export const transformOutputsToTreeDataTypes = (
  outputs: NodeStructureOutput[],
  parentId: string,
  nodeName: string,
  userProvidedName: string,
  parentDroppedName: string,
  nodeId: string
): TreeDataType[] => {
  return outputs
    .filter((output) => output.kind !== "header")
    .map((output) => {
      const currentDroppedName = parentDroppedName
        ? `${parentDroppedName}.${output.label}`
        : `${userProvidedName}-${output.label}`;
      const nodeData = {
        id: uuidv4(),
        parentId,
        title: output.label,
        name: output.name,
        draggable: true,
        children: output.children
          ? transformOutputsToTreeDataTypes(
              output.children,
              uuidv4(),
              output.name,
              "",
              currentDroppedName,
              nodeId
            )
          : [],
        isOpen: false,
        type: output.allowedDatatypes,
        parentName: nodeName,
        dropDetails: {
          droppedName: currentDroppedName,
          droppedId: String(output.id),
          parentId: nodeId,

          doSelfNodeCheck: true,
          doPreviousOutputCheck: true,
          doInputModelCheck: false,
          typeCheck: output.allowedDatatypes,
        },
        dropType: DropTypes.Output,
      };
      return nodeData;
    });
};

// Function to transform each node and include its outputs directly under it
export const transformNodeStructure = (
  nodes: NodeStructure[]
): TreeDataType[] => {
  return nodes.map((node) => {
    const rootDroppedName = `${node.userProvidedName}`; // Start the droppedName with the userProvidedName
    return {
      id: uuidv4(),
      parentId: "context-outputs",
      parentName: null,
      title: `${node.name} - ${node.userProvidedName}`,
      name: node.userProvidedName,
      draggable: false,
      children: transformOutputsToTreeDataTypes(
        node.outputs,
        uuidv4(),
        node.name,
        node.userProvidedName,
        rootDroppedName, // Initial droppedName for children
        node.nodeId
      ),
      dropType: DropTypes.Output,
      isOpen: false,
    };
  });
};

export const transformDetailedModelToTreeData = (
  model: Model,
  parentId: string | null = null,
  parentPath: string = "",
  currentIdPath: string = ""
): TreeDataType => {
  const fullPath = parentPath
    ? `${parentPath}.${model.modelName}`
    : model.modelName;

  const baseIdPath = currentIdPath
    ? `${currentIdPath}.${model.modelId}`
    : model.modelId;
  const treeData: TreeDataType = {
    id: model.modelId,
    parentId: parentId,
    parentName: parentId ? `${parentId}` : null,
    title: model.modelFriendlyName || model.modelName,
    name: model.modelName,
    children: [],
    isOpen: false,
    draggable: true,
    type: "model",
    dropDetails: {
      droppedName: fullPath,
      droppedId: currentIdPath,
      // source: "ModelDetail",
      parentId: null,
      doSelfNodeCheck: false,
      doPreviousOutputCheck: false,
      doInputModelCheck: true,
      typeCheck: "model",
    },
    dropType: DropTypes.Model,

    // referencedDetailedModelDetail: {
    //   droppedName: fullPath, // Set the full path as droppedName
    //   source: "ModelDetail",
    //   droppedId: currentIdPath,
    // },
  };

  // Iterate over attributes to handle nested models or simple attributes
  model.attributes.forEach((attr) => {
    if (!attr.key) {
      const attributeFullPath = parentPath
        ? `${parentPath}.${attr.name}`
        : `${model.modelName}.${attr.name}`;
      const attributeFullIdPath = currentIdPath
        ? `${currentIdPath}.${attr.id}`
        : `${model.modelId}.${attr.id}`;
      if (attr.dataType === "model" && attr.childModel) {
        // Recursive call if the attribute is a model. Use attr.name as the title to reflect the attribute name.
        treeData.children.push({
          id: attr.childModel.modelId,
          parentId: model.modelId,
          parentName: model.modelName,
          title: attr.friendlyName || attr.name,
          name: attr.name,
          children: transformDetailedModelToTreeData(
            attr.childModel,
            attr.id,
            attributeFullPath,
            attributeFullIdPath
          ).children, // Recursively add children with adjusted structure
          isOpen: false,
          draggable: true,
          type: "model",
          dropDetails: {
            droppedName: attributeFullPath,
            droppedId: attributeFullIdPath,
            // source: "ModelDetail",
            parentId: null,
            doSelfNodeCheck: false,
            doPreviousOutputCheck: false,
            doInputModelCheck: true,
            typeCheck: "model",
          },
          // referencedDetailedModelDetail: {
          //   droppedName: attributeFullPath, // Use the constructed path
          //   source: "ModelDetail",
          //   droppedId: attributeFullIdPath,
          // },
        });
      } else {
        // Handle normal attributes
        treeData.children.push({
          id: attr.id,
          parentId: model.modelId,
          parentName: model.modelName,
          title: attr.friendlyName || attr.name,
          name: attr.name,
          children: [],
          isOpen: false,
          draggable: false,
          type: attr.dataType,
          dropDetails: {
            droppedName: attributeFullPath,
            droppedId: attributeFullIdPath,
            // source: "ModelDetail",
            parentId: null,
            doSelfNodeCheck: false,
            doPreviousOutputCheck: false,
            doInputModelCheck: true,
            typeCheck: attr.dataType,
          },

          // referencedDetailedModelDetail: {
          //   droppedName: attributeFullPath, // Use the constructed path
          //   source: "ModelDetail",
          //   droppedId: attributeFullIdPath,
          // },
        });
      }
    }
  });

  return treeData;
};

// export const getModelTree = (
//   models: Model[],
//   parentModelId: string
// ): TreeDataType[] => {
//   const model = models.find((model) => model.modelId === parentModelId);
//   if (!model) return [];

//   function transformAttributesToTree(
//     attributes: FieldType[],
//     parentId = "",
//     parentName = "", // Added parentName to keep track of the hierarchy
//     depth = 0
//   ): TreeDataType[] {
//     if (depth > 10) {
//       // Set your recursion limit based on expected data structures
//       console.log("Recursion depth exceeded, stopping");
//       return [];
//     }

//     return attributes.map((attr) => {
//       const fullParentId = parentId ? `${parentId}.${attr.id}` : attr.id; // Constructing hierarchical ID
//       const fullParentName = parentName
//         ? `${parentName}.${attr.name}`
//         : attr.name; // Constructing hierarchical name

//       const children = models
//         .filter((m) => m.modelId === attr.dataSourceId)
//         .flatMap((m) =>
//           transformAttributesToTree(
//             m.attributes,
//             fullParentId,
//             fullParentName,
//             depth + 1
//           )
//         );

//       return {
//         id: uuidv4(),
//         parentId,
//         parentName: attributes.find((a) => a.id === parentId)?.name || null,
//         title: attr.friendlyName,
//         name: attr.name,
//         children,
//         isOpen: false,
//         draggable: true,
//         type: attr.dataType,
//         dropDetails: {
//           droppedName: fullParentName,
//           droppedId: fullParentId,
//           parentId: parentModelId,
//           doSelfNodeCheck: false,
//           doPreviousOutputCheck: false,
//           doInputModelCheck: true,
//           typeCheck: attr.dataType,
//         },
//       };
//     });
//   }

//   return transformAttributesToTree(model.attributes);
// };

export const getModelTree = (
  models: Model[],
  parentModelId: string
): TreeDataType[] => {
  const model = models.find((model) => model.modelId === parentModelId);
  if (!model) return [];

  function transformAttributesToTree(
    attributes: FieldType[],
    parentId = "",
    parentName = "", // Added parentName to keep track of the hierarchy
    depth = 0
  ): TreeDataType[] {
    if (depth > 10) {
      console.log("Recursion depth exceeded, stopping");
      return [];
    }

    return attributes.map((attr) => {
      // console.log("attribute here", attr);
      const fullParentId = parentId ? `${parentId}.${attr.id}` : attr.id; // Constructing hierarchical ID
      const fullParentName = parentName
        ? `${parentName}.${attr.name}`
        : attr.name; // Constructing hierarchical name

      const children = models
        .filter((m) => m.modelId === attr.dataSourceId)
        .flatMap((m) =>
          transformAttributesToTree(
            m.attributes,
            fullParentId,
            fullParentName,
            depth + 1
          )
        );

      return {
        id: uuidv4(),
        parentId,
        parentName: parentId
          ? attributes.find((a) => a.id === parentId)?.name || null
          : null, // Modified to return null if not found
        title: attr.friendlyName,
        name: attr.name,
        children,
        isOpen: false,
        draggable: true,
        type: attr.dataType,
        dropDetails: {
          droppedName: fullParentName,
          droppedId: fullParentId,
          parentId: parentModelId,
          doSelfNodeCheck: false,
          doPreviousOutputCheck: false,
          doInputModelCheck: true,
          typeCheck: attr.dataType,
          attrId: attr.id,
          childDataType: attr.childDataType ? attr.childDataType : null,
        },
        dropType: attr.dataType === "list" ? DropTypes.List : DropTypes.Model,
      };
    });
  }

  // Creating a root node for the model
  const rootNode: TreeDataType = {
    id: uuidv4(),
    parentId: null,
    parentName: null,
    title: model.modelFriendlyName || model.modelName, // Using model's friendly name or name
    name: model.modelName,
    children: transformAttributesToTree(
      model.attributes,
      model.modelId,
      model.modelName,
      0
    ),
    isOpen: true, // Initially open to show children
    draggable: false, // Typically, root nodes are not draggable
    type: "model",
    dropDetails: {
      droppedName: model.modelName,
      droppedId: model.modelId,
      parentId: null,
      doSelfNodeCheck: false,
      doPreviousOutputCheck: false,
      doInputModelCheck: true,
      typeCheck: "model", // Assuming the root is of type 'model'
      attrId: model.modelId,
    },
    dropType: DropTypes.Model,
  };

  return [rootNode];
};

function parseAttributePath(attributePath: string) {
  // Assuming the attributePath format is "modelId.attr_id" or "modelId.attr_id.nested_attr_id"
  const parts = attributePath.split(".");
  return {
    modelId: parts[0],
    attributeIds: parts.slice(1), // This will handle deeper paths like "attr_id.nested_attr_id"
  };
}

function findAttributeNode(
  nodes: TreeDataType[],
  attrIds: string[],
  index = 0
) {
  if (index >= attrIds.length || !nodes) {
    // If we've exhausted the attrIds or have no nodes to search, return null
    return null;
  }

  // Find the node in the current list of nodes that matches the current attrId
  const currentNode = nodes.find(
    (node) => node.dropDetails && node.dropDetails.attrId === attrIds[index]
  );

  console.log("current node", currentNode);

  // If a matching node is found and we are at the last index of attrIds, return the node
  if (currentNode && index === attrIds.length - 1) {
    return currentNode;
  }

  // If a matching node is found but more attrIds exist, recurse into the children of the current node
  if (currentNode) {
    return findAttributeNode(currentNode.children, attrIds, index + 1);
  }

  // If no matching node is found at this level, return null
  return null;
}

export const buildAttributeTree = (
  models: Model[],
  droppedId: string
): TreeDataType | null => {
  const { modelId, attributeIds } = parseAttributePath(droppedId);
  const model = models.find((m) => m.modelId === modelId);
  if (!model) {
    console.log("Model not found");
    return null;
  }

  const parentTreeData = getModelTree(models, modelId);
  console.log("parentTreeData", parentTreeData);
  console.log("attributeids", attributeIds);

  const resultNode = findAttributeNode(
    parentTreeData[0].children,
    attributeIds
  );
  return resultNode;
};
