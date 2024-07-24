import { Box } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { ListGridHeader } from "./Inputs/ListGridHeader";
import { ListGridBody } from "./Inputs/ListGridBody";
import { GridJsonType } from "../../../../components/TableComponentGlide/types";
import { gridJsonBlankTemplate } from "./Inputs/gridBlanktemplate";
import { useMapStore } from "../FlowMappingModelNode/Store/NewMappingModelStore";
import { MapDetail } from "../NewModelCreatorNode/Store/ModelDetailsFromBackendStore";

export const ListGridNode = memo(({ data }: { data: any }) => {
  const { modelDetails } = data;

  const [gridJson, setGridJson] = useState<GridJsonType>(gridJsonBlankTemplate);
  const { findChildMapById, updateChildMapById } = useMapStore((state) => ({
    findChildMapById: state.findChildMapById,
    updateChildMapById: state.updateChildMapById,
  }));

  // useEffect(() => {
  //   if (modelDetails.parentMapModelId && modelDetails.childMapId) {
  //     const childMapData = findChildMapById(
  //       `Map.${modelDetails.parentMapModelId}`,
  //       modelDetails.parentMapNodeID,
  //       modelDetails.childMapId
  //     );
  //     console.log("childmapdata", childMapData);
  //     if (childMapData && childMapData.sourceData) {
  //       const newGridJson = {
  //         ...gridJsonBlankTemplate,
  //         gridData: childMapData.sourceData,
  //       };
  //       console.log("newGridJson", newGridJson);
  //       setGridJson(newGridJson);
  //     }
  //   } else setGridJson(gridJsonBlankTemplate);
  // }, []);

  useEffect(() => {
    if (modelDetails.parentMapModelId && modelDetails.childMapId) {
      const childMapData = findChildMapById(
        `Map.${modelDetails.parentMapModelId}`,
        modelDetails.parentMapNodeID,
        modelDetails.childMapId
      );
      console.log("childmapdata", childMapData);
      if (childMapData && childMapData.sourceData) {
        const newGridJson = {
          ...gridJsonBlankTemplate,
          gridData: childMapData.sourceData,
        };
        console.log("newGridJson", newGridJson);
        setGridJson(newGridJson);
      }
    }
  }, [
    modelDetails.parentMapModelId,
    modelDetails.childMapId,
    modelDetails.parentMapNodeID,
    findChildMapById,
  ]);

  const updateMapForGrid = (data: any[]) => {
    console.log(
      "updating map details",
      modelDetails.parentMapModelId,
      modelDetails.childMapId,
      data
    );
    const childMapData = findChildMapById(
      `Map.${modelDetails.parentMapModelId}`,
      modelDetails.parentMapNodeID,
      modelDetails.childMapId
    );
    console.log("child map data", childMapData);
    if (childMapData) {
      const updatedMapDetail: MapDetail = {
        ...childMapData,
        source: "",
        sourceName: "",
        sourceDataType: "list",
        error: false,
        sourceParentId: null,
        sourceParentName: null,
        sourceData: data,
      };

      updateChildMapById(
        `Map.${modelDetails.parentMapModelId}`,
        modelDetails.parentMapNodeID,
        modelDetails.childMapId,
        updatedMapDetail
      );
      const newGridJson = {
        ...gridJsonBlankTemplate,
        gridData: data,
      };
      setGridJson(newGridJson);
    }
  };

  // useEffect(() => {
  //   console.log("Rendering with parent ", gridJson);
  // }, [gridJson]);
  return (
    <Box
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
      <ListGridHeader nodeId={data.nodeId} />
      <ListGridBody
        parentMapId={modelDetails.parentMapModelId}
        childMapId={modelDetails.childMapId}
        gridData={gridJson}
        updateMapForGrid={updateMapForGrid}
        // setGridDataFromChild={setGridDataFromChild}
      />
    </Box>
  );
});

export default ListGridNode;
