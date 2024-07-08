//this is use in model builder

import { Box } from "@mui/material";
import React, { memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import CodeHeader from "./inputs/CodeHeader";
import { CodeBody } from "./inputs/CodeBody";
import { CodeList, useCodeListStore } from "./store/CodeListStore";

export const CodeListNode = memo(({ data }: { data: any }) => {
  const [localModel, setLocalModel] = useState<CodeList | null>(null);
  const [loading, setLoading] = useState(true);
  const getCodeById = useCodeListStore((state) => state.getCodeById);
  const { modelDetails } = data;

  useEffect(() => {
    const codeData = getCodeById(modelDetails.dataSourceId);
    if (codeData) {
      setLocalModel(codeData);
      setLoading(false);
    }
  }, [modelDetails.dataSourceId, modelDetails.url, data]);
  return (
    <Box
      data-model-id={data.modelDetails.dataSourceId}
      //   onDrop={handleOnDrop}
      sx={{
        width: "150%",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        p: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <Handle
        type="target"
        id="testId"
        position={Position.Left}
        style={{
          background: "transparent",
          border: "2px solid #9c9c9c",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          left: "-12px",
          zIndex: 200,
        }}
      />
      <CodeHeader nodeId={data.nodeId} modelId={modelDetails.dataSourceId} />
      <CodeBody
        dataSourceId={modelDetails.dataSourceId}
        url={modelDetails.url}
        model={localModel}
        loading={loading}
        nodeId={data.nodeId}
      />
    </Box>
  );
});

export default CodeListNode;
