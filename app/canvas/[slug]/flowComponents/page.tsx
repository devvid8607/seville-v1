"use client";
import React, { useEffect, useState } from "react";
import useModelStore from "../modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import useDataTypesStore from "../_lib/_store/DataTypesStore";
import useFlowBackendStore from "./_lib/_store/FlowBackEndStore";
import { useFlowNodeStore } from "./_lib/_store/FlowNodeStore";
import { useNodeStructureStore } from "./_lib/_store/FlowNodeStructureStore";
import { useDroppableStore } from "./_lib/_store/DroppableStore";
import { useSearchParams } from "next/navigation";
import { SevilleNewValueFlow } from "./_lib/_components/inputs/SevilleNewValueFlow";

const flowComponentsWrapper = () => {
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const param = searchParams.get("param");

  //   const location = useLocation();
  const fetchSchema = useFlowBackendStore((state) => state.fetchSchema);
  const clearAllEdgedDataInStore = useFlowNodeStore(
    (state) => state.clearAllEdgedDataInStore
  );
  const clearAllNodesDataInStore = useFlowNodeStore(
    (state) => state.clearAllNodesDataInStore
  );
  const resetNodeStructures = useNodeStructureStore(
    (state) => state.resetNodeStructures
  );
  const resetTreeSelectorNodes = useDroppableStore(
    (state) => state.resetTreeSelectorNodes
  );
  const clearModels = useModelStore((state) => state.clearModels);

  const fetchModels = useModelStore((state) => state.fetchModels);

  //   const resetRules = useRulesStore((state) => state.resetRules);

  const { fetchDataTypes } = useDataTypesStore((state) => ({
    fetchDataTypes: state.fetchData,
  }));
  //   const item = location.state?.item;
  //   const param = location.state?.param;
  //   console.log("item selected", item, param);
  // alert("path name" + location.pathname);

  useEffect(() => {
    const loadSchema = async () => {
      setLoading(true);
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      resetNodeStructures();
      resetTreeSelectorNodes();
      clearModels();
      //   resetRules();
      //clear maps data
      //fetch maps data

      await fetchModels();

      await fetchSchema(param);
      await fetchDataTypes();
      setLoading(false);
    };

    loadSchema();
  }, [fetchSchema, param]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <div>done o done</div>;
  // return <SevilleNewValueFlow />;

  // return <div>test page</div>;
};

export default flowComponentsWrapper;
