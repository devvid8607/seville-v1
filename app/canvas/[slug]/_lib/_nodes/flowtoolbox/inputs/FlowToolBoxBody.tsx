import {
  ToolBoxType,
  useFetchToolbox,
  useGetToolboxDataById,
} from "@/app/canvasBuilderv2/model/_lib/_queries/useToolBoxQueries";
import { useToolboxStore } from "../store/FlowToolBoxStore";
import { useEffect, useMemo, useState } from "react";

import { Box, CircularProgress } from "@mui/material";

import ToolboxTreeView from "./ToolBox-TreeViewCustom/ToolboxTreeView";
import { ToolBoxTreeDataType } from "./ToolBox-TreeViewCustom/ToolboxtreeType";

const FlowToolBoxBody: React.FC = () => {
  const { data: categories, error, isLoading } = useFetchToolbox();

  const { setToolboxItems, toolboxItems, updateNodeChildren } = useToolboxStore(
    (state) => ({
      setToolboxItems: state.setToolboxItems,
      toolboxItems: state.toolboxItems,
      updateNodeChildren: state.updateNodeChildren,
    })
  );
  console.log("toolbox items", toolboxItems);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const { data: fetchedData, error: fetchError } = useGetToolboxDataById(
    currentNodeId || ""
  );

  useEffect(() => {
    if (categories) {
      setToolboxItems(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (fetchedData && currentNodeId) {
      console.log("fetchdata", fetchedData);
      updateNodeChildren(currentNodeId, fetchedData);
    }
  }, [fetchedData, currentNodeId]);

  const transformCategoriesToTreeData = (
    categories: ToolBoxType[]
  ): ToolBoxTreeDataType[] => {
    return categories.map((category) => ({
      id: category.id,
      parentId: category.parentId ?? null,
      treeType: category.type ?? null,
      parentName: null,
      title: category.name ?? null,
      name: category.name ?? null,
      children: category.children
        ? transformCategoriesToTreeData(category.children)
        : [],
      isOpen: false,
      draggable: false,
      haschildren: category.hasChildren ?? false,
      configuration: category.configuration ?? null,
    }));
  };

  const treeData = useMemo(() => {
    const transformedData = transformCategoriesToTreeData(toolboxItems);
    console.log("Transformed Tree Data:", transformedData);
    return transformedData;
  }, [toolboxItems]);

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  const handleFetchChildren = async (nodeId: string) => {
    setCurrentNodeId(nodeId);
  };

  return (
    <Box mt={2}>
      <ToolboxTreeView data={treeData} fetchChildren={handleFetchChildren} />
    </Box>
  );
};

export default FlowToolBoxBody;
