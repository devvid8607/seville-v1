import { useMemo, useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { ModelNode } from "./ModelNode";
import { NewModelCreatorCanvas } from "./NewModelCreatorCanvas";
import CodeListNode from "../../../../nonRouted/nodes/codeListNode/CodeListNode";
import CustomEdge from "../edges/ButtonEdge";

export const NewModelCreator = () => {
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const nodeTypes = useMemo(
    () => ({
      modelNode: ModelNode,
      codeListNode: CodeListNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      buttonedge: CustomEdge,
    }),
    []
  );

  return (
    <>
      <ReactFlowProvider>
        <NewModelCreatorCanvas
          nodeTypes={nodeTypes}
          wrapperRef={reactFlowWrapper}
          onInit={setRfInstance}
          rfInstance={rfInstance}
          edgeTypes={edgeTypes}
        />
      </ReactFlowProvider>
    </>
  );
};
