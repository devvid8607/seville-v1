import React, { useEffect, useState } from "react";
import { NodeStructureInput } from "../../../flowComponents/_lib/_types/SevilleSchema";
import { ConditionalValueType } from "../../../flowComponents/_lib/_types/ValueTypes";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useNodeStructureStore } from "../../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { IfDroppable } from "./IfDroppable";
type SevilleIFInputNodeInputsProps = {
  nodeId: string;
  index: number;
  canDelete: boolean;
  onDelete: () => void;
  input: NodeStructureInput;
  ifGroup: ConditionalValueType;
};

const inputProps1 = {
  id: 122,
  type: "newDroppable",
  label: "Input 1",
  description: "This is a desc.",
  icon: "AddCircleOutline",
  placeholder: "Single value droppable input",
  visible: true,
  values: [],
  config: {
    allowedDataTypes: {
      dropType: ["singleValue"],
      edgeType: null,
    },
    allowHardCoding: true,
    allowMultipleDrop: false,
  },
};

const inputProps2 = {
  id: 123,
  type: "newDroppable",
  label: "Input 1",
  description: "This is a desc.",
  icon: "AddCircleOutline",
  placeholder: "Single value droppable input",
  visible: true,
  values: [],
  config: {
    allowedDataTypes: {
      dropType: ["singleValue"],
      edgeType: null,
    },
    allowHardCoding: true,
    allowMultipleDrop: false,
  },
};

export const findMatchingCondition = (
  nodeId: string,
  inputId: number,
  conditionId: string | number | undefined
) => {
  const currentStructures = useNodeStructureStore.getState().nodeStructures;
  const currentNodeStructure = currentStructures.find(
    (ns) => ns.nodeId === nodeId
  );
  if (currentNodeStructure) {
    const matchingInput = currentNodeStructure.inputs.find(
      (inp) => inp.id === inputId
    );
    if (matchingInput) {
      console.log("matching input found");
      console.log(matchingInput);
      if (
        Array.isArray(matchingInput.values) &&
        matchingInput.values.length > 0
      ) {
        console.log(matchingInput.values);
        const matchingConditionObj = matchingInput.values.find(
          (cond: ConditionalValueType) => cond.id === conditionId
        );
        return matchingConditionObj;
      } else return null;
    } else return null;
  } else return null;
};

export const findMatchingInput = (nodeId: string, inputId: number) => {
  const currentStructures = useNodeStructureStore.getState().nodeStructures;
  const currentNodeStructure = currentStructures.find(
    (ns) => ns.nodeId === nodeId
  );
  if (currentNodeStructure) {
    const matchingInput = currentNodeStructure.inputs.find(
      (inp) => inp.id === inputId
    );
    return matchingInput;
  } else return null;
};

export const IfInput: React.FC<SevilleIFInputNodeInputsProps> = ({
  nodeId,
  index,
  canDelete,
  onDelete,
  input,
  ifGroup,
}) => {
  console.log("ifGroup");
  console.log(ifGroup);

  const [condition, setCondition] = useState("");
  const [logicalOperator, setLogicalOperator] = useState("");
  const currentStructures = useNodeStructureStore.getState().nodeStructures;

  useEffect(() => {
    const matchingConditionObj = findMatchingCondition(
      nodeId,
      input.id,
      ifGroup.id
    );
    if (matchingConditionObj) {
      setCondition(matchingConditionObj.condition);
      setLogicalOperator(matchingConditionObj.logic);
    }
  }, [currentStructures]);

  const handleLogicalOperatorChange = (
    event: React.MouseEvent<HTMLElement>,
    newOperator: string | null
  ) => {
    if (newOperator !== null) {
      setLogicalOperator(newOperator);
      const matchingConditionObj = findMatchingCondition(
        nodeId,
        input.id,
        ifGroup.id
      );
      if (matchingConditionObj) {
        matchingConditionObj.logic = newOperator;
      }
    }
  };

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    console.log("handling change");
    const newConditionType = event.target.value as string;
    setCondition(newConditionType);
    const matchingConditionObj = findMatchingCondition(
      nodeId,
      input.id,
      ifGroup.id
    );
    if (matchingConditionObj) {
      matchingConditionObj.condition = newConditionType;
    }
  };

  return (
    <>
      <Box
        key={ifGroup.id}
        sx={{
          width: "100%",
          margin: "auto",
          boxShadow: 1,
          padding: 2,
          mt: 3,
          position: "relative",
        }}
      >
        {canDelete && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={logicalOperator}
              exclusive
              onChange={handleLogicalOperatorChange}
              sx={{ display: "inline-flex", alignItems: "center" }}
            >
              <Tooltip title="And Condition">
                <ToggleButton
                  value="and"
                  sx={{
                    "&.MuiButtonBase-root": {
                      color: "#88A2FD",
                      border: "none",
                    },
                    width: "90px",
                  }}
                >
                  And
                </ToggleButton>
              </Tooltip>
              <Divider
                orientation="vertical"
                flexItem
                variant="middle"
                sx={{ mx: 1, color: "red" }}
              />
              <Tooltip title="Or Condition">
                <ToggleButton
                  value="or"
                  sx={{
                    "&.MuiButtonBase-root": {
                      color: "#88A2FD",
                      border: "none",
                    },
                    width: "90px",
                  }}
                >
                  Or
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
        )}
        {canDelete && (
          <IconButton
            onClick={onDelete}
            sx={{
              position: "absolute",
              top: 2,
              right: 4,
            }}
          >
            <Tooltip title="Remove Condition">
              <CloseOutlined sx={{ color: "red" }} />
            </Tooltip>
          </IconButton>
        )}

        <IfDroppable
          input={inputProps1 as NodeStructureInput}
          nodeId={nodeId}
          textFieldId="valueOne"
          isFromIfNode={true}
          inputIfNode={input}
          conditionID={ifGroup.id}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl margin="normal" sx={{ mt: 2 }} fullWidth>
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              id="condition-select"
              value={condition}
              label="Condition"
              onChange={handleDropdownChange}
              sx={{
                "& .MuiSelect-icon": {
                  color: "red",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"greaterThan"}>Is Greater than</MenuItem>
              <MenuItem value={"greaterThanOrEqualTo"}>
                Is Greater than or equals
              </MenuItem>
              <MenuItem value={"lessThan"}>Is Less Than</MenuItem>
              <MenuItem value={"lessThanOrEqualTo"}>
                Is Less Than or equals
              </MenuItem>
              <MenuItem value={"equalTo"}>Equals</MenuItem>
              <MenuItem value={"notequalTo"}>Not Equals</MenuItem>
              <MenuItem value={"contains"}>Contains</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <IfDroppable
          input={inputProps2 as NodeStructureInput}
          nodeId={nodeId}
          textFieldId="valueTwo"
          isFromIfNode={true}
          inputIfNode={input}
          conditionID={ifGroup.id}
        />
      </Box>
      <Divider />
    </>
  );
};
