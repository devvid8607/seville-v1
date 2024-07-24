import * as MuiIcons from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { memo, useState } from "react";
import { useFlowNodeStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStore";
import { useNodeStructureStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStructureStore";
import { updatePathOfAllNodes } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/CanvasValidation";
import useDetachNodesStore from "../../../_store/useDetachStore";
import { isNewDroppableInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { useMapStore } from "@/app/canvas/[slug]/flowComponents/_lib/mapping/NewMappingModelStore";

export const FlowNodeHeader = memo(({ nodeId }: { nodeId: string }) => {
  const { nodeStructure, updateNodeStructure, getNodeStructure } =
    useNodeStructureStore((state) => ({
      nodeStructure: state.getNodeStructure(nodeId),
      updateNodeStructure: state.updateNodeStructure,
      toggleNodeStructurePinned: state.toggleNodeStructurePinned,
      getNodeStructure: state.getNodeStructure,
    }));

  // const ruleId = useTabStore((state) => state.ruleId);

  const { removeMapByModelId } = useMapStore((state) => ({
    removeMapByModelId: state.removeMapByModelId,
  }));

  const hasParent = useFlowNodeStore(
    (state) => !!state.nodes.find((n) => n.id === nodeId)?.parentNode
  );

  const detachNodes = useDetachNodesStore();

  const onDetach = () => {
    detachNodes([nodeId]);
    updatePathOfAllNodes();
  };

  const removeNode = useFlowNodeStore((state) => state.removeNode);

  const {
    getNodeById,
    getConnectedTargetNodeAndEdgeIdByHandle,
    removeNodeAndDescendants,
  } = useFlowNodeStore((state) => ({
    getNodeById: state.getNodeById,
    getConnectedTargetNodeAndEdgeIdByHandle:
      state.getConnectedTargetNodeAndEdgeIdByHandle,
    removeNodeAndDescendants: state.removeNodeAndDescendants,
  }));
  const removeNodeStructure = useNodeStructureStore(
    (state) => state.removeNodeStructure
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(
    nodeStructure?.userProvidedName || "placeholder"
  );

  if (!nodeStructure) return;

  const { icon, headerColor, helpText, name, userProvidedName } = nodeStructure;
  const IconComponent = MuiIcons[icon as keyof typeof MuiIcons];
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedName("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setEditedName(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      // Set editedName to the placeholder if the condition is true
      setEditedName(nodeStructure?.userProvidedName || "placeholder"); // Replace 'placeholder' with your actual placeholder value
    } else {
      // Otherwise, set editedName to the input value
      setEditedName(event.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (editedName === "" || editedName === null) {
      // Set editedName to the placeholder if the condition is true
      setEditedName(nodeStructure?.userProvidedName || "placeholder"); // Replace 'placeholder' with your actual placeholder value
    } else {
      updateNodeStructure(nodeId, { userProvidedName: editedName });
    }
    setIsEditing(false);
  };

  const handleRemoveNodeClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const nodeToDelete = getNodeById(nodeId);

    if (nodeToDelete) {
      console.log("nodeToDelete", nodeToDelete);

      //need to remove only the mapping nodes if any exists for a validation set node
      if (
        nodeToDelete.data.schemaId === "seville:utility:validationSetNodeTest"
      ) {
        const nodeStruc = getNodeStructure(nodeId);
        if (nodeStruc) {
          const modelInput = nodeStruc.inputs.find(
            (input) => input.type === "newDroppable"
          );
          if (modelInput) {
            console.log("Model input found:", modelInput, nodeToDelete.id);

            if (isNewDroppableInput(modelInput)) {
              if (modelInput.isMappedNode && modelInput.modelId) {
                removeMapByModelId(modelInput.modelId, nodeToDelete.id);
                const handleId = `handle|nd|${nodeId}|model|${modelInput.modelId}`;
                const { targetNode } = getConnectedTargetNodeAndEdgeIdByHandle(
                  nodeId,
                  handleId
                );
                if (targetNode) removeNodeAndDescendants(targetNode.id);
              }
            }
          } else {
            console.log("No model input found");
          }
        }
      }
      removeNode(nodeId);
      removeNodeStructure(nodeId);
    }
  };

  return (
    <Box
      id="node_header_outer_box"
      sx={{
        backgroundColor: headerColor,
        borderBottom: "1px solid #aaa",
        height: "auto",
        pt: 2,
        pb: 2,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        id="node_content_box"
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          paddingLeft: 2,
        }}
      >
        <Box
          id="node_header_item_box"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 4,
            height: 4,
            mr: 2,
            ml: 1,
          }}
        >
          <IconComponent />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            m: 0,
            whiteSpace: "nowrap",
          }}
        >
          {name} :
        </Typography>
        <Box onDoubleClick={handleDoubleClick} sx={{ cursor: "pointer" }}>
          {isEditing ? (
            <TextField
              autoFocus
              fullWidth
              value={editedName}
              onChange={handleChange}
              onBlur={handleBlur}
              size="small"
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mr: 5,
                ml: 1,
                whiteSpace: "nowrap",
              }}
            >
              {userProvidedName}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={helpText} sx={{ cursor: "pointer", marginRight: 1 }}>
          <MuiIcons.HelpOutline />
        </Tooltip>
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Tooltip title="Delete Node">
            <IconButton onClick={handleRemoveNodeClick}>
              <MuiIcons.CloseOutlined sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <span className="custom-drag-handle">
            <Tooltip title="Drag Node">
              <MuiIcons.DragHandleOutlined />
            </Tooltip>
          </span>
        </Box>
        {/* <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <span className="custom-drag-handle">
            <Tooltip title="Pin">
              <IconButton onClick={() => toggleNodeStructurePinned(nodeId)}>
                {nodeStructure.isPinned ? (
                  <MuiIcons.LocationOffOutlined sx={{ color: "black" }} />
                ) : (
                  <MuiIcons.LocationOnOutlined sx={{ color: "black" }} />
                )}
              </IconButton>
            </Tooltip>
          </span>
        </Box> */}
        {hasParent && (
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <IconButton onClick={onDetach}>
              <Tooltip
                title="Detach From Parent"
                sx={{ cursor: "pointer", marginRight: 1 }}
              >
                <span className="custom-drag-handle">
                  <MuiIcons.ContentCutOutlined
                    sx={{ color: "black" }}
                    fontSize="small"
                  />
                </span>
              </Tooltip>
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
});
