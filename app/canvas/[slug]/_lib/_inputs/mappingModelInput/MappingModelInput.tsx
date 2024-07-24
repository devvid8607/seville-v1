import React, { useEffect } from "react";
import {
  NodeStructureInput,
  isModelInput,
} from "../../../flowComponents/_lib/_types/SevilleSchema";

import { Box, Typography } from "@mui/material";
import useModelStore from "../../../modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import { useMappingStore } from "../../../flowComponents/_lib/mapping/MappingStore";
import { useMapStore } from "../../../flowComponents/_lib/mapping/NewMappingModelStore";
import { MappingInputDroppableTextField } from "./inputs/MappingInputDroppableTextField";

// this comes up when a validation set is dragged and dropped on to the canvas

type MappingModelInputProps = {
  input: NodeStructureInput;
  nodeId: string;
};

export const MappingModelInput: React.FC<MappingModelInputProps> = ({
  input,
  nodeId,
}) => {
  if (!isModelInput(input)) return;

  const { getModelById, createMapForModelInput } = useModelStore((state) => ({
    getModelById: state.getModelById,
    createMapForModelInput: state.createMapForModelInput,
  }));

  const { setMappingModelId, setMappingNodeId } = useMappingStore((state) => ({
    setMappingModelId: state.setMappingModelId,
    setMappingNodeId: state.setMappingNodeId,
  }));

  const mappedModel = getModelById(input.modelId);
  if (!mappedModel) return;

  console.log("input in model", input);

  let mapData;

  // const updateNodeInternals = useUpdateNodeInternals();

  const { addOrUpdateMap } = useMapStore((state) => ({
    addOrUpdateMap: state.addOrUpdateMap,
  }));

  useEffect(() => {
    mapData = createMapForModelInput(mappedModel.modelId, nodeId);
    console.log("Mapdata", mapData);
    addOrUpdateMap(mappedModel.modelId, nodeId, mapData);
    console.log("setting model and node ");
    setMappingModelId(mappedModel.modelId);
    setMappingNodeId(nodeId);
  }, []);

  // useEffect(() => {
  //   updateNodeInternals(nodeId);
  //   mapData = createMapForModelInput(mappedModel.modelId);
  //   console.log("Mapdata", mapData);
  //   addOrUpdateMap(mappedModel.modelId, mapData);
  // }, [nodeId]);

  return (
    <Box>
      <Typography variant="body1">
        {`Input Model : ${
          mappedModel.modelFriendlyName
            ? mappedModel.modelFriendlyName
            : mappedModel.modelName
        }`}
      </Typography>
      <Box display="flex" mt={3} gap={3}>
        <Typography mt={3} sx={{ whiteSpace: "nowrap" }}>
          {mappedModel.modelFriendlyName
            ? mappedModel.modelFriendlyName
            : mappedModel.modelName}
        </Typography>
        <MappingInputDroppableTextField
          modelId={mappedModel.modelId}
          nodeId={nodeId}
          input={input}
        />

        {/* <Handle
          id="new_id"
          position={Position.Right}
          type="source"
          style={handleStyle}
        /> */}
      </Box>
    </Box>
  );
};

export default MappingModelInput;
