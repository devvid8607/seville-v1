import React, { useMemo, useState } from "react";

import { CodeList } from "../store/CodeListStore";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import codeListData from "../../../../_lib/dummyData/CodeListData.json";

interface CodeBodyProps {
  dataSourceId: string;
  url: string;
  model: CodeList | null;
  loading: boolean;
  nodeId: string;
}

export const CodeBody: React.FC<CodeBodyProps> = ({
  dataSourceId,
  url,
  model,
  loading,
  nodeId,
}) => {
  if (!model) return;

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const matchedCodeList = useMemo(
    () =>
      codeListData.codeListData.find((codeList) => codeList.id === model.id),
    [model]
  );

  // Extracting the keys from the first object to use as column headers
  if (!matchedCodeList) {
    return <div>No data found for the selected model.</div>;
  }
  const handleKeyChange = (event: SelectChangeEvent) => {
    setSelectedKey(event.target.value);
    setSelectedValue("");
  };

  const handleValueChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <Box display="flex" flexDirection="row" mt={2} mb={2}>
        <FormControl fullWidth sx={{ margin: 2 }}>
          <InputLabel id="key-select-label">Key</InputLabel>
          <Select
            labelId="key-select-label"
            id="key-select"
            value={selectedKey}
            label="Key"
            onChange={handleKeyChange}
          >
            {matchedCodeList.properties.map((prop) => (
              <MenuItem key={prop.id} value={prop.name}>
                {prop.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ margin: 2 }}>
          <InputLabel id="value-select-label">Value</InputLabel>
          <Select
            labelId="value-select-label"
            id="value-select"
            value={selectedValue}
            label="Value"
            onChange={handleValueChange}
            disabled={!selectedKey}
          >
            {matchedCodeList.properties.map((prop) => (
              <MenuItem key={prop.id} value={prop.name}>
                {prop.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Code</TableCell>
              <TableCell align="right">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchedCodeList.data.map((row) => (
              <TableRow
                key={row.Id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Id}
                </TableCell>
                <TableCell align="right">{row.Code}</TableCell>
                <TableCell align="right">{row.Description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
