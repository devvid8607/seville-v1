import { Box, CircularProgress, Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import {
  createAttributeDataWithDataTypeParameters,
  createListAttributeDataWithParameters,
  createModelData,
} from "../../_helpers/createModelData";
import { fetchModelFromAPI } from "../../_hooks/useGetModel";
import { ModelBody } from "./modelInputs/ModelBody";
import { ModelHeader } from "./modelInputs/ModelHeader";
import { DropTypes } from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";
import useModelStore, {
  Model,
} from "../../_store/modelStore/ModelDetailsFromBackendStore";
import { useFetchModelById } from "../../_queries/useModelQueries";

export const ModelNode = memo(({ data }: { data: any }) => {
  // #region state variables
  const { modelDetails } = data;
  const [loading, setLoading] = useState(true);
  const [localModel, setLocalModel] = useState<Model | null>(null);
  const {
    data: fetchedModel,
    error,
    isLoading,
  } = useFetchModelById(modelDetails.dataSourceId);
  //#endregion

  // #region useModelStore imports
  const getModelById = useModelStore((state) => state.getModelById);
  const addModelToStore = useModelStore((state) => state.addModelToStore);
  const addAttributeToModel = useModelStore(
    (state) => state.addAttributeToModel
  );
  const storedModel = getModelById(modelDetails.dataSourceId);
  //#endregion

  // #region useeffect
  // useEffect(() => {
  //   const getModel = async () => {
  //     setLoading(true);
  //     let foundModel = getModelById(modelDetails.dataSourceId);
  //     // alert(foundModel);
  //     if (!foundModel || foundModel === undefined) {
  //       foundModel = await fetchModelFromAPI(
  //         modelDetails.dataSourceId,
  //         modelDetails.url
  //       );
  //       if (foundModel) {
  //         addModelToStore(foundModel);
  //       } else {
  //         foundModel = createModelData(modelDetails);
  //         addModelToStore(foundModel);
  //       }
  //     }

  //     setLocalModel(foundModel);
  //     setLoading(false);
  //   };

  //   getModel();
  // }, [modelDetails.dataSourceId, modelDetails.url, data]);

  // useEffect(() => {
  //   if (model) {
  //     setLocalModel(model);
  //   } else if (error) {
  //     const newModel = createModelData(modelDetails);
  //     addModelToStore(newModel);
  //     setLocalModel(newModel);
  //   }
  // }, [model, error, modelDetails]);

  console.log("stored model", storedModel);
  useEffect(() => {
    if (!storedModel && fetchedModel) {
      setLocalModel(fetchedModel);
      addModelToStore(fetchedModel);
      setLoading(false);
    } else if (storedModel) {
      setLocalModel(storedModel);
      setLoading(false);
    } else if (error) {
      const newModel = createModelData(modelDetails);
      addModelToStore(newModel);
      setLocalModel(newModel);
      setLoading(false);
    }
  }, [storedModel, fetchedModel, error, modelDetails, addModelToStore]);
  // #endregion

  // #region evenHandlers
  const handleOnDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const node = event.dataTransfer.getData("text/plain");
    console.log("nodejson", node);
    //dropping a model item

    let nodeJSON;
    if (node) {
      try {
        nodeJSON = JSON.parse(node);
        console.log("Parsed JSON:", nodeJSON);
      } catch (error) {
        console.log("Not a JSON string, treating as regular string:", node);
        nodeJSON = null; // Or handle the string case as needed
      }
      // const nodeJSON = JSON.parse(node);
      console.log("nodejson", nodeJSON);
      const targetModelId = event.currentTarget.getAttribute("data-model-id");

      if (
        nodeJSON &&
        nodeJSON.dropType &&
        nodeJSON.dropType === DropTypes.Model
      ) {
        // console.log("text ", nodeJSON);
        // console.log("dropped on", targetModelId);
        if (nodeJSON && targetModelId && nodeJSON.parentId != targetModelId) {
          const newAttribute = createListAttributeDataWithParameters(nodeJSON);
          // console.log("newAttribute", newAttribute);
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
  // #endregion

  return (
    <Box
      data-model-id={data.modelDetails.dataSourceId}
      onDrop={handleOnDrop}
      sx={{
        width: "150%",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        p: 2,
        backgroundColor: "#ffffff",
        // filter: loading ? "blur(3px)" : "none",
        // pointerEvents: loading ? "none" : "auto",
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
