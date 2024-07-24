import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NodeStructureInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { testfn } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/CanvasValidation";

import { DataItem } from "@/app/canvas/[slug]/_lib/_nodes/listGridNode/Inputs/SampleTable";
import SampleTable from "@/app/canvas/[slug]/_lib/_nodes/listGridNode/Inputs/SampleTable";

import { useDroppableStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/DroppableStore";

type gridSelectorProps = {
  nodeId: string;
  input: NodeStructureInput;
  // onDataUpdate: (expanded: string[], selected: string[]) => void;
};

export const GridSelector: React.FC<gridSelectorProps> = ({
  nodeId,
  input,
}) => {
  const { getGridSelectorNode } = useDroppableStore((state) => ({
    getGridSelectorNode: state.getGridSelectorNode,
  }));

  // useEffect(() => {
  //   if (
  //     input.values &&
  //     input.values.length === 1 &&
  //     input.values[0].selector &&
  //     input.values[0].selector.gridData &&
  //     input.values[0].selector.gridData.length > 0
  //     // input.values[0].dropType === DropTypes.Model
  //   ) {
  //     console.log("in tree useeffect", input);
  //     setData(input.values[0].selector.gridata);
  //   }
  // }, []);

  const gridSelectorNodes = getGridSelectorNode(nodeId);
  console.log("gridSelectorNodes here", gridSelectorNodes);

  const [data, setData] = useState<DataItem[]>(
    gridSelectorNodes ? gridSelectorNodes : []
  );

  // useEffect(() => {
  //   setData(gridSelectorNodes ? gridSelectorNodes.gridData : []);
  // }, []);

  useEffect(() => {
    if (gridSelectorNodes) {
      setData(gridSelectorNodes);
    }
  }, [gridSelectorNodes]);

  useEffect(() => {
    if (
      data &&
      data.length > 0 &&
      input &&
      input.values &&
      input.values.length > 0
    ) {
      testfn(nodeId, input.id, input.values[0].id, {
        expanded: [],
        selected: [],
        gridData: data,
      });
    }
  }, [data]);
  if (!gridSelectorNodes) return;
  const handleAddRow = (newData: DataItem[]) => {
    setData(newData);
  };

  const handleDeleteRow = (newData: DataItem[]) => {
    setData(newData);
  };

  const handleUpdateRow = (newData: DataItem[]) => {
    setData(newData);
  };

  return (
    <Box mt={2}>
      <SampleTable
        data={data && data.length > 0 ? data : []}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onUpdateRow={handleUpdateRow}
      />
    </Box>
  );
};

export default GridSelector;
