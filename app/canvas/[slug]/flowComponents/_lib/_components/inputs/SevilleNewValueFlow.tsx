import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";
import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";
import CustomEdge from "@/app/canvas/[slug]/modelCreator/_lib/_components/edges/ButtonEdge";
import { FlowEndNode } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/FlowEndNode";
import { FlowItemSelector } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/FlowItemSelector";
import { FlowNode } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/dynamicFlowNode/FlowNode";
import { FlowStartNode } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/FlowStartNode";
import { FlowValid } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/FlowValid";
import { FlowInValid } from "@/app/canvas/[slug]/_lib/_nodes/flownodes/FlowInvalid";
import CodeListNode from "@/app/canvas/[slug]/_lib/_nodes/codeListNode/CodeListNode";

//import CodeListGridNode from "../../_nodes/codeListGridNode/CodeListGridNode";
// import CodeListNode from "./newValueChangesFlow/FlowComponents/Node/CodeListNode/CodeListNode";
// import { ContextDataNode } from "./newValueChangesFlow/FlowComponents/Node/ContextDataNode/ContextDataNode";
// import { CustomEdge } from "./newValueChangesFlow/FlowComponents/Node/Edges/ButtonEdge";

// import { FlowInputNode } from "./newValueChangesFlow/FlowComponents/Node/FlowInputNode/FlowInputNode";
// import { FlowInValid } from "./newValueChangesFlow/FlowComponents/Node/FlowInvalid";
// import { SevilleIteratorNode } from "./newValueChangesFlow/FlowComponents/Node/FlowIteratorNode/SevilleIteratorNode";
// import { MappingModelNode } from "./newValueChangesFlow/FlowComponents/Node/FlowMappingModelNode/MappingModelNode";

//
// import { FlowValid } from "./newValueChangesFlow/FlowComponents/Node/FlowValid";
// import { ValidationOutputNode } from "./newValueChangesFlow/FlowComponents/Node/FlowValidationOutputNode/ValidationOutputNode";
// import { ListGridNode } from "./newValueChangesFlow/FlowComponents/Node/ListGridNode/ListGridNode";
// import { LogicOutputNode } from "./newValueChangesFlow/FlowComponents/Node/LogicOutputNode/LogicOutputNode";
// import { RuleNode } from "./newValueChangesFlow/FlowComponents/Node/RuleNode/RuleNode";
// import { SevilleCanvas } from "./newValueChangesFlow/SevilleCanvas";

const flowKey = "example-flow";

export const SevilleNewValueFlow = () => {
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fetchDataTypes } = useDataTypesStore((state) => ({
    fetchDataTypes: state.fetchData,
  }));

  const { setSliderOpen } = useTabStore((state) => ({
    setSliderOpen: state.setSliderOpen,
  }));

  // const { clearAllNodesDataInStore, clearAllEdgedDataInStore } =
  //   useFlowNodeStore((state) => ({
  //     clearAllNodesDataInStore: state.clearAllNodesDataInStore,
  //     clearAllEdgedDataInStore: state.clearAllEdgedDataInStore,
  //   }));

  useEffect(() => {
    //fetch datatypes on load
    // fetchDataTypes();
    setSliderOpen(false);
    // clearAllNodesDataInStore();
    // clearAllEdgedDataInStore();
    // setInitialSchema(getInitialSchema());
    //reset and fetch model nodes
    // fetch all related maps on load
  }, []);

  const nodeTypes = useMemo(
    () => ({
      flowNode: FlowNode,
      flowNodeSelectorNode: FlowItemSelector,
      flowStartNode: FlowStartNode,
      flowEndNode: FlowEndNode,
      flowValidNode: FlowValid,
      flowInValidNode: FlowInValid,
      codeListNode: CodeListNode,
      // inputNode: FlowInputNode,
      // flowIteratorNode: SevilleIteratorNode,
      // contextDataNode: ContextDataNode,
      // ruleNode: RuleNode, //
      // validationOutputNode: ValidationOutputNode,
      // mappingModelNode: MappingModelNode,

      // codeListGridNode: CodeListGridNode,
      // listGridNode: ListGridNode,

      // logicOutputNode: LogicOutputNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      sevilleDeletableEdge: CustomEdge,
    }),
    []
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const jsonData = JSON.stringify(flow, null, 2);

      localStorage.setItem(flowKey, jsonData);
    }
  }, [rfInstance]);

  return (
    <>
      <div>in progress</div>
      {/* <ReactFlowProvider>
        <SevilleCanvas
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onSave={onSave}
          wrapperRef={reactFlowWrapper}
          onInit={setRfInstance}
          rfInstance={rfInstance}
        />
      </ReactFlowProvider> */}
    </>
  );
};
