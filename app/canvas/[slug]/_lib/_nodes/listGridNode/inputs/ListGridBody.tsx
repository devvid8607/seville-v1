import { Box } from "@mui/material";
import TableComponent from "../../../../../components/TableComponentGlide";
import {
  GridActionEnum,
  GridFunctionType,
  GridJsonType,
} from "../../../../../components/TableComponentGlide/types";
import { gridJsonBlankTemplate } from "./gridBlanktemplate";
import { useMapStore } from "../../FlowMappingModelNode/Store/NewMappingModelStore";
import { MapDetail } from "../../NewModelCreatorNode/Store/ModelDetailsFromBackendStore";
import React, { useEffect, useState } from "react";
import SampleTable from "./SampleTable";

interface ListGridProps {
  parentMapId: string;
  childMapId: string;
  gridData: GridJsonType;
  updateMapForGrid: (data: any[]) => void;
  // setGridDataFromChild:(data:a)
}

export const ListGridBody: React.FC<ListGridProps> = ({
  parentMapId,
  childMapId,
  gridData,
  updateMapForGrid,
  // setGridDataFromChild
}) => {
  // const { findChildMapById, updateChildMapById } = useMapStore((state) => ({
  //   findChildMapById: state.findChildMapById,
  //   updateChildMapById: state.updateChildMapById,
  // }));

  if (gridData === null) return;
  console.log("grid data here", gridData);

  // useEffect(() => {
  //   console.log("in use", `Map.${parentMapId}`, childMapId);
  //   const childMapData = findChildMapById(`Map.${parentMapId}`, childMapId);
  //   console.log("ch map data", childMapData);
  //   if (childMapData && childMapData.sourceData) {
  //     console.log("here in source ddata", childMapData.sourceData);
  //     gridJsonBlankTemplate.gridData = childMapData.sourceData;
  //   }
  // }, []);

  // updateMapForGrid(data);
  // const updateMapForGrid = (data: any[]) => {
  //   console.log("updating map details", parentMapId, childMapId, data);
  //   const childMapData = findChildMapById(`Map.${parentMapId}`, childMapId);
  //   if (childMapData) {
  //     console.log("child map data", childMapData);

  //     const updatedMapDetail: MapDetail = {
  //       ...childMapData,
  //       source: "",
  //       sourceName: "",
  //       sourceDataType: "list",
  //       error: false,
  //       sourceParentId: null,
  //       sourceParentName: null,
  //       sourceData: data,
  //     };

  //     updateChildMapById(`Map.${parentMapId}`, childMapId, updatedMapDetail);
  //   }
  // };

  useEffect(() => {
    console.log("Rendering grid with data:", gridData);
  }, [gridData]);
  const gridFunction: GridFunctionType = (
    action: GridActionEnum,
    data?: any
  ) => {
    switch (action) {
      case GridActionEnum.Edit:
        {
          console.log("new data", data);
          updateMapForGrid(data);
        }
        return;
      case GridActionEnum.Delete:
        return alert("Delete");
      case GridActionEnum.Create:
        return alert("Create");
      case GridActionEnum.Filter:
        return alert("Filter");
      case GridActionEnum.Sorting:
        return alert("Sorting");
      case GridActionEnum.Pagination:
        return alert("Pagination");
      case GridActionEnum.View:
        return alert("Viewed");
      case GridActionEnum.RowSelect:
        {
          console.log("selected data", data);
        }
        return;
      default:
        return alert("Invalid");
    }
  };

  const handleAddRow = (data: any[]) => {
    updateMapForGrid(data);
  };

  return (
    <Box sx={{ height: "85vh" }} mt={2}>
      {/* <TableComponent gridJson={gridData} gridFunction={gridFunction} /> */}
      <SampleTable
        data={gridData.gridData}
        onAddRow={handleAddRow}
        onDeleteRow={handleAddRow}
        onUpdateRow={handleAddRow}
      />
    </Box>
  );
};
