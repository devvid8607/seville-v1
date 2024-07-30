"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import { ReactFlowInstance, ReactFlowProvider } from "reactflow";

import CodeListNode from "@/app/canvas/[slug]/_lib/_nodes/codeListNode/CodeListNode";
import CustomEdge from "../edges/ButtonEdge";
import { ModelNode } from "./ModelNode";
import { NewModelCreatorCanvas } from "./NewModelCreatorCanvas";
import FlowtoolBox from "@/app/canvas/[slug]/_lib/_nodes/flowtoolbox/FlowtoolBox";

interface NewModelCreatorProps {
  refetchCanvasData: () => void;
  loading: boolean;
}

// const DynamicNewModelCreatorCanvas = dynamic(
//   () =>
//     import("./NewModelCreatorCanvas").then((mod) => mod.NewModelCreatorCanvas),
//   {
//     loading: () => <p>Loading NewModelCreator...</p>,
//     ssr: false,
//   }
// );

export const NewModelCreator = ({
  refetchCanvasData,
  loading,
}: NewModelCreatorProps) => {
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const nodeTypes = useMemo(
    () => ({
      modelNode: ModelNode,
      codeListNode: CodeListNode,
      flowtoolbox: FlowtoolBox,
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
  const handleRefetch = () => {
    refetchCanvasData();
  };

  return (
    <>
      <ReactFlowProvider>
        <NewModelCreatorCanvas
          nodeTypes={nodeTypes}
          wrapperRef={reactFlowWrapper}
          onInit={onInit}
          rfInstance={rfInstance}
          edgeTypes={edgeTypes}
          refetchCanvasData={handleRefetch}
          parentloading={loading}
        />
      </ReactFlowProvider>
    </>
  );
};
