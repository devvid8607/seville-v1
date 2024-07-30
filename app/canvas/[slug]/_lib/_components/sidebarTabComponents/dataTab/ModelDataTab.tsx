import { useEffect, useMemo } from "react";
import useModelStore from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import {
  transformDataTypesToTreeData,
  transformModelsToTreeData,
} from "./customTreeView/TransformToTreeData";
import TreeView from "./customTreeView/TreeView";
import useCustomTreeStore from "./customTreeView/customTreeStore/CustomTreeStore";

import useDataTypesStore from "../../../_store/DataTypesStore";

export const ModelDataTab = () => {
  const models = useModelStore((state) => state.models);
  const expandedNodes = useCustomTreeStore((state) => state.expandedNodes);
  const setAllNodeIds = useCustomTreeStore((state) => state.setAllNodeIds);

  const { storeDataTypes } = useDataTypesStore((state) => ({
    storeDataTypes: state.dataTypes,
  }));

  const getAllNodeIds = (nodes: any): string[] => {
    let ids = [];
    for (const node of nodes) {
      ids.push(node.id); // Add the current node's ID
      if (node.children && node.children.length > 0) {
        // If the node has children, recurse into them
        ids = ids.concat(getAllNodeIds(node.children));
      }
    }
    return ids;
  };

  // const treeData = useMemo(() => {
  //   if (models && models.length > 0) {
  //     //
  //     return transformModelsToTreeData(models, expandedNodes);
  //   }
  //   return [];
  // }, [models, expandedNodes]);

  const treeData = useMemo(() => {
    const modelsTreeData =
      models && models.length > 0 ? transformModelsToTreeData(models) : [];
    const dataTypesTreeData =
      storeDataTypes && storeDataTypes.length > 0
        ? transformDataTypesToTreeData(storeDataTypes)
        : [];

    return [
      {
        id: "models",
        parentId: null,
        parentName: null,
        title: "Models",
        name: "Models",
        children: modelsTreeData,
        isOpen: false,
        draggable: false,
      },
      {
        id: "data-types",
        parentId: null,
        parentName: null,
        title: "Data Types",
        name: "Data Types",
        children: dataTypesTreeData,
        isOpen: false,
        draggable: false,
      },
    ];
  }, [models, storeDataTypes]);
  console.log("treedata", treeData);

  useEffect(() => {
    // Call getAllNodeIds to get all node IDs from the current tree data
    const allNodeIds = getAllNodeIds(treeData);
    // Update the store with the current list of all node IDs
    setAllNodeIds(allNodeIds);
  }, [treeData, setAllNodeIds]);

  return (
    <>
      <TreeView data={treeData} />
      {/* <DataTypeSelector /> */}
    </>
  );
};
