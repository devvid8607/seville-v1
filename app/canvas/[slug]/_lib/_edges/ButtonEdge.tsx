import React, { useRef } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  MarkerType,
  getBezierPath,
} from "reactflow";

import "./buttonedge.css";
import { useFlowNodeStore } from "../../flowComponents/_lib/_store/FlowNodeStore";
import { Box, IconButton, Tooltip } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { updatePathOfAllNodes } from "../../flowComponents/_lib/_helpers/CanvasValidation";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = useFlowNodeStore((state) => state.removeEdge);

  // const ruleId = useTabStore((state) => state.ruleId);

  const buttonRef = useRef(null);

  const onEdgeClick = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    evt.stopPropagation();

    // alert(`remove ${id}`);
    removeEdge(id);
    updatePathOfAllNodes();
    // if (ruleId) {
    //   removeEdgeFromRule(ruleId, id);
    // }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={MarkerType.Arrow} style={style} />

      <EdgeLabelRenderer>
        <Box
          sx={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            zIndex: 5,
          }}
        >
          <Tooltip title="Delete Edge">
            <IconButton
              ref={buttonRef}
              sx={{
                color: "red",
                pointerEvents: "all",
                backgroundColor: "#f9f9f9",
                borderRadius: "50%",
                padding: "3px",
                "&:hover": {
                  backgroundColor: "white",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
                  transform: "scale(1.05)",
                },
              }}
              onClick={(event) => onEdgeClick(event, id)}
            >
              <CloseOutlined />
            </IconButton>
          </Tooltip>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};
