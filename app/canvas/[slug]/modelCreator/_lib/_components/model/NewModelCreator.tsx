"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import { ReactFlowInstance, ReactFlowProvider } from "reactflow";

import CodeListNode from "../../../../_lib/_nodes/codeListNode/CodeListNode";
import CustomEdge from "../edges/ButtonEdge";
import { ModelNode } from "./ModelNode";
import { NewModelCreatorCanvas } from "./NewModelCreatorCanvas";

// const DynamicNewModelCreatorCanvas = dynamic(
//   () =>
//     import("./NewModelCreatorCanvas").then((mod) => mod.NewModelCreatorCanvas),
//   {
//     loading: () => <p>Loading NewModelCreator...</p>,
//     ssr: false,
//   }
// );

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

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);

  return (
    <>
      <ReactFlowProvider>
        <NewModelCreatorCanvas
          nodeTypes={nodeTypes}
          wrapperRef={reactFlowWrapper}
          onInit={onInit}
          rfInstance={rfInstance}
          edgeTypes={edgeTypes}
        />
      </ReactFlowProvider>
    </>
  );
};
