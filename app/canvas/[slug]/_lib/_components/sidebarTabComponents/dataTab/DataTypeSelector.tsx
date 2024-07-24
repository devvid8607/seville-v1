import React from "react";
import useDataTypesStore, { DataType } from "../../../_store/DataTypesStore";
import { Box, Paper, Typography } from "@mui/material";
interface DataTypeBoxProps {
  dataType: DataType;
}

const DataTypeBox: React.FC<DataTypeBoxProps> = ({ dataType }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const JSONStringDataType = JSON.stringify(dataType);
    event.dataTransfer.setData("dataTypeObj", JSONStringDataType);
  };
  return (
    <Box
      sx={{ margin: 1, padding: 1, backgroundColor: "#ccc" }}
      draggable="true"
      onDragStart={handleDragStart}
    >
      <Typography variant="subtitle1">{dataType.name}</Typography>
    </Box>
  );
};

export const DataTypeSelector = () => {
  const dataTypes = useDataTypesStore((state) => state.dataTypes);

  return (
    <Box display="flex" flexDirection="column" mt={2}>
      <Typography>Select from datatypes</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {dataTypes.map((dataType) => (
          <DataTypeBox key={dataType.id} dataType={dataType} />
        ))}
      </Box>
    </Box>
  );
};
