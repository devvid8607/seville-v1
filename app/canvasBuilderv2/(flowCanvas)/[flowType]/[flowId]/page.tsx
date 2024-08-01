"use client";
// import React, { useEffect, useState } from "react";
// import useFlowBackendStore from "../_lib/_store/FlowBackEndStore";
// import { useFlowNodeStore } from "../_lib/_store/FlowNodeStore";
// import { useNodeStructureStore } from "../_lib/_store/FlowNodeStructureStore";
// import useModelStore from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelDetailsFromBackendStore";
// import { useDroppableStore } from "../_lib/_store/DroppableStore";
// import useRulesStore from "../_lib/_store/RuleStore";
// import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";
// import { SevilleNewValueFlow } from "../_lib/_components/SevilleNewValueFlow";

const flowIndex = ({
  params,
}: {
  params: { flowType: string; flowId: string };
}) => {
  const { flowType, flowId } = params;

  // const [loading, setLoading] = useState(true);
  // const fetchSchema = useFlowBackendStore((state) => state.fetchSchema);
  // const clearAllEdgedDataInStore = useFlowNodeStore(
  //   (state) => state.clearAllEdgedDataInStore
  // );
  // const clearAllNodesDataInStore = useFlowNodeStore(
  //   (state) => state.clearAllNodesDataInStore
  // );
  // const resetNodeStructures = useNodeStructureStore(
  //   (state) => state.resetNodeStructures
  // );
  // const resetTreeSelectorNodes = useDroppableStore(
  //   (state) => state.resetTreeSelectorNodes
  // );
  // const clearModels = useModelStore((state) => state.clearModels);

  // const fetchModels = useModelStore((state) => state.fetchModels);

  // const resetRules = useRulesStore((state) => state.resetRules);

  // const { fetchDataTypes } = useDataTypesStore((state) => ({
  //   fetchDataTypes: state.fetchData,
  // }));

  // useEffect(() => {
  //   const loadSchema = async () => {
  //     setLoading(true);
  //     clearAllEdgedDataInStore();
  //     clearAllNodesDataInStore();
  //     resetNodeStructures();
  //     resetTreeSelectorNodes();
  //     clearModels();
  //     resetRules();

  //     await fetchModels();
  //     await fetchSchema(location.pathname);
  //     await fetchDataTypes();
  //     setLoading(false);
  //   };

  //   loadSchema();
  // }, [flowType, flowId]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <div>
        Flow Index for flowtype: {flowType} with flowId: {flowId}
      </div>

      {/* <SevilleNewValueFlow /> */}
    </>
  );
};

export default flowIndex;
