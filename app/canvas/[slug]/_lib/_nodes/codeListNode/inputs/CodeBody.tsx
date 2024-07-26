import React, { useMemo, useState, useEffect } from "react";

import { CodeList, useCodeListStore } from "../store/CodeListStore";
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
  const [localCode, setLocalCode] = useState<CodeList>();

  // const matchedCodeList = useMemo(
  //   () =>
  //     codeListData.codeListData.find((codeList) => codeList.id === model.id),
  //   [model]
  // );

  const getCodeById = useCodeListStore((state) => state.getCodeById);
  const fetchCodeById = useCodeListStore((state) => state.fetchCodeById);

  useEffect(() => {
    const fetchcodedetails = async () => {
      const code = getCodeById(model.id);
      if (!code) {
        await fetchCodeById(model.id);
        const updatedCodeList = getCodeById(model.id);
        if (updatedCodeList) {
          setLocalCode(updatedCodeList);
        }
      } else {
        setLocalCode(code);
      }
    };

    fetchcodedetails();
  }, []);

  // Extracting the keys from the first object to use as column headers
  // if (!matchedCodeList) {
  //   return <div>No data found for the selected model.</div>;
  // }
  const handleKeyChange = (event: SelectChangeEvent) => {
    setSelectedKey(event.target.value);
    setSelectedValue("");
  };

  const handleValueChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  if (!localCode) return <div>Loading..</div>;

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
            {localCode.properties.map((prop) => (
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
            {localCode.properties.map((prop) => (
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
              <TableCell>Id</TableCell>
              <TableCell>Columns</TableCell>
              {/* <TableCell align="right">Code</TableCell>
              <TableCell align="right">Description</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {localCode.properties.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {/* <TableCell align="right">{row.Code}</TableCell>
                <TableCell align="right">{row.Description}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
