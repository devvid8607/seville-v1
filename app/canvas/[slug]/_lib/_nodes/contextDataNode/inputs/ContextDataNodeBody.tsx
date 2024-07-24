import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNodeStructureStore } from "../../../../FlowStore/FlowNodeStructureStore";
import { TreeDataType } from "../../NewModelCreatorNode/SidebarTabComponents/DataTab/customTreeView/SevilleTreeTypes/TreeTypes";
import {
  getModelTree,
  transformNodeStructure,
  transformVariablesToTreeData,
} from "../../NewModelCreatorNode/SidebarTabComponents/DataTab/customTreeView/TransformToTreeData";
import TreeView from "../../NewModelCreatorNode/SidebarTabComponents/DataTab/customTreeView/TreeView";
import useModelStore from "../../NewModelCreatorNode/Store/ModelDetailsFromBackendStore";
import { useContextDataStore } from "../Store/ContextDataStore";
import { useCustomVariableStore } from "../Store/CustomVariablesStore";
import { useGlobalVariableStore } from "../Store/GlobalVariablesStore";

export const ContextDataNodeBody = () => {
  //for outputs of nodes added -like add subtract etc context output
  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);
  //for global variables
  const globalVariables = useGlobalVariableStore((state) => state.variables);
  //for custom variables
  const customVariables = useCustomVariableStore((state) => state.variables);
  //for context input data
  const contextVariables = useContextDataStore((state) => state.data);
  //for model data from input

  const { models, inputModelId } = useModelStore((state) => ({
    models: state.models,
    inputModelId: state.inputModelId,
  }));

  const [globalTreeData, setGlobalTreeData] = useState<TreeDataType[]>([]);
  const [customTreeData, setCustomTreeData] = useState<TreeDataType[]>([]);
  const [contextTreeData, setContextTreeData] = useState<TreeDataType[]>([]);
  const [modelTreeData, setModelTreeData] = useState<TreeDataType[]>([]);
  const [outputTreeData, setOutputTreeData] = useState<TreeDataType[]>([]);

  useEffect(() => {
    setGlobalTreeData(
      globalVariables
        ? transformVariablesToTreeData(
            globalVariables,
            "global-variables",
            null
          )
        : []
    );
    setCustomTreeData(
      customVariables
        ? transformVariablesToTreeData(
            customVariables,
            "custom-variables",
            null
          )
        : []
    );
    setContextTreeData(
      contextVariables
        ? transformVariablesToTreeData(
            contextVariables,
            "context-variables",
            null
          )
        : []
    );
  }, [globalVariables, customVariables, contextVariables]);

  useEffect(() => {
    console.log("re rendering");
    const nodesWithOutputs = nodeStructures.filter(
      (node) => node.outputs.length > 0
    );
    if (nodesWithOutputs.length > 0) {
      const transformedNodes = transformNodeStructure(nodesWithOutputs);

      setOutputTreeData(transformedNodes);
    } else {
      setOutputTreeData([]);
    }
  }, [nodeStructures]);

  // useEffect(() => {
  //   console.log("in model refresh use effect");
  //   const inputModel = nodes.find((node) => node.type === "inputNode");
  //   if (inputModel) {
  //     const inputModelId = inputModel.data.modelDetails.dataSourceId;
  //     if (inputModelId) {
  //       //const inputModel = getDetailedModel(inputModelId);
  //       // const childModel = findAllChildModels(inputModelId);
  //       if (inputModel) {
  //         const detailedtreedata = transformDetailedModelToTreeData(inputModel);
  //         console.log("child models", detailedtreedata);
  //         setModelTreeData([detailedtreedata]);
  //       }
  //     }
  //   }
  // }, [nodes, models]);

  useEffect(() => {
    if (inputModelId) {
      const test = getModelTree(models, inputModelId);
      setModelTreeData(test);
      console.log("test data", test);
    }
  }, [inputModelId]);

  const treeData = useMemo(
    () => [
      {
        id: "global-variables",
        parentId: null,
        parentName: null,
        title: "Global Variables",
        name: "Global Variables",
        children: globalTreeData,
        isOpen: false,
        draggable: false,
      },
      {
        id: "custom-variables",
        parentId: null,
        parentName: null,
        title: "Custom Variables",
        name: "Custom Variables",
        children: customTreeData,
        isOpen: false,
        draggable: false,
      },
      {
        id: "context-variables",
        parentId: null,
        parentName: null,
        title: "Context Data",
        name: "Context Data",
        children: contextTreeData,
        isOpen: false,
        draggable: false,
      },
      {
        id: "context-model-data",
        parentId: null,
        parentName: null,
        title: "Input Model Data",
        name: "Input Model Data",
        children: modelTreeData,
        isOpen: false,
        draggable: false,
      },
      {
        id: "context-outputs",
        parentId: null,
        parentName: null,
        title: "Outputs Data",
        name: "Outputs Data",
        children: outputTreeData,
        isOpen: false,
        draggable: false,
      },
    ],
    [
      globalTreeData,
      customTreeData,
      contextTreeData,
      modelTreeData,
      outputTreeData,
    ]
  );

  return (
    <Box mt={2}>
      <TreeView data={treeData} />
    </Box>
  );
};
