import { Box, CircularProgress, Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import {
  createAttributeDataWithDataTypeParameters,
  createListAttributeDataWithParameters,
  createModelData,
} from "../../helpers/createModelData";
import { fetchModelFromAPI } from "../../hooks/useGetModel";
import { ModelBody } from "./modelInputs/ModelBody";
import { ModelHeader } from "./modelInputs/ModelHeader";
import { DropTypes } from "../../types/TreeTypes";
import useModelStore, {
  Model,
} from "../../store/modelStore/ModelDetailsFromBackendStore";

export const ModelNode = memo(({ data }: { data: any }) => {
  const { modelDetails } = data;
  const [loading, setLoading] = useState(true);
  const [localModel, setLocalModel] = useState<Model | null>(null);
  const getModelById = useModelStore((state) => state.getModelById);
  const addModelToStore = useModelStore((state) => state.addModelToStore);
  const addAttributeToModel = useModelStore(
    (state) => state.addAttributeToModel
  );

  useEffect(() => {
    const getModel = async () => {
      setLoading(true);
      let foundModel = getModelById(modelDetails.dataSourceId);
      // alert(foundModel);
      if (!foundModel || foundModel === undefined) {
        foundModel = await fetchModelFromAPI(
          modelDetails.dataSourceId,
          modelDetails.url
        );
        if (foundModel) {
          addModelToStore(foundModel);
        } else {
          foundModel = createModelData(modelDetails);
          addModelToStore(foundModel);
        }
      }

      setLocalModel(foundModel);
      setLoading(false);
    };

    getModel();
  }, [modelDetails.dataSourceId, modelDetails.url, data]);

  const handleOnDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const node = event.dataTransfer.getData("text/plain");
    //dropping a model item
    if (node) {
      const nodeJSON = JSON.parse(node);
      console.log("nodejson", nodeJSON);
      const targetModelId = event.currentTarget.getAttribute("data-model-id");

      if (
        nodeJSON &&
        nodeJSON.dropType &&
        nodeJSON.dropType === DropTypes.Model
      ) {
        console.log("text ", nodeJSON);
        console.log("dropped on", targetModelId);
        if (nodeJSON && targetModelId && nodeJSON.parentId != targetModelId) {
          const newAttribute = createListAttributeDataWithParameters(nodeJSON);
          console.log("newAttribute", newAttribute);
          addAttributeToModel(targetModelId, newAttribute);
        }
      } else if (
        nodeJSON &&
        nodeJSON.dropType &&
        nodeJSON.dropType === DropTypes.DataType
      ) {
        const newAttribute =
          createAttributeDataWithDataTypeParameters(nodeJSON);
        if (targetModelId) addAttributeToModel(targetModelId, newAttribute);
      }
    }

    // const dataTypeObject = event.dataTransfer.getData("dataTypeObj");
    // if (dataTypeObject) {
    //   const nodeJSON = JSON.parse(dataTypeObject);
    //   const targetModelId = event.currentTarget.getAttribute("data-model-id");

    //   console.log("json ", nodeJSON);
    //   console.log("dropped on", targetModelId);
    //   const newAttribute = createAttributeDataWithDataTypeParameters(nodeJSON);
    //   if (targetModelId) addAttributeToModel(targetModelId, newAttribute);
    // }
  };

  return (
    <Box
      data-model-id={data.modelDetails.dataSourceId}
      onDrop={handleOnDrop}
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
      <ModelHeader nodeId={data.nodeId} modelId={modelDetails.dataSourceId} />
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          m={2}
          p={2}
          height="100%"
        >
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading model...
          </Typography>
        </Box>
      ) : (
        <ModelBody
          dataSourceId={modelDetails.dataSourceId}
          url={modelDetails.url}
          model={localModel}
          loading={loading}
          nodeId={data.nodeId}
        />
      )}
    </Box>
  );
});
