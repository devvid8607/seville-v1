import { useEffect, useState } from "react";
import {
  DropdownOption,
  NodeStructureInput,
  isDropdownInput,
} from "../../flowComponents/_lib/_types/SevilleSchema";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useNodeStructureStore } from "../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { INPUT_TYPES } from "../../flowComponents/_lib/_constants/inputTypes";
import { checkTypeOfInputItems } from "./SevilleDroppableInput";
import { SimpleValueType } from "../../flowComponents/_lib/_types/ValueTypes";

type SevilleDropdownInputsProps = {
  input: NodeStructureInput;
  nodeId: string;
  isFromIterator?: boolean;
  itemToBeUpdated?: string;
  isFromDropDownButtonGroup?: boolean;
  dropDownId?: string;
};

export const SevilleDropdownInput: React.FC<SevilleDropdownInputsProps> = ({
  input,
  nodeId,
  isFromIterator,
  itemToBeUpdated,
  isFromDropDownButtonGroup,
  dropDownId,
}) => {
  if (!isDropdownInput(input)) return;
  console.log("input.id");
  console.log(input);

  if (input.values) input.def = input.values;
  const [selectedValue, setSelectedValue] = useState<string>(input.def || "");
  const [options, setOptions] = useState<DropdownOption[]>(input.options || []);

  const { updateNodeStructure, getNodeStructure } = useNodeStructureStore();

  useEffect(() => {
    if (input.values !== null) {
      console.log("in dropdown", input.values);
      const resultOfTypeCheck = checkTypeOfInputItems(input.values);
      let textValues;
      if (resultOfTypeCheck.isSimpleType) {
        if (input.values.length === 1) {
          textValues = input.values[0].textValue;
          //input.def = textValues;
        } else {
          // Extract textValue from each object and join them with a comma
          textValues = input.values
            .map((item: SimpleValueType) => item.textValue)
            .join(", ");
        }
      }
      input.def = textValues;
    }
  }, [input, input.values]);
  useEffect(() => {
    setSelectedValue(input.def || "");
  }, [input.def]);

  useEffect(() => {
    const fetchOptions = () => {
      if (input.fromAPI) {
        const apiResponse = [
          { option: "API Option 1", value: "apiValue1" },
          { option: "API Option 2", value: "apiValue2" },
          { option: "API Option 3", value: "apiValue3" },
        ];
        setOptions(apiResponse);
      } else {
        setOptions(input.options);
      }
    };

    fetchOptions();
  }, [input.fromAPI, input.options]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;

    setSelectedValue(event.target.value as string);
    // const currentStructures = useNodeStructureStore.getState().nodeStructures;
    // const nodeStructure = currentStructures.find((ns) => ns.nodeId === nodeId);
    const nodeStructure = getNodeStructure(nodeId);
    if (nodeStructure) {
      let updatedInputs;
      if (isFromIterator && itemToBeUpdated) {
        console.log("in case 1");
        console.log(isFromIterator, itemToBeUpdated);
        const forInputGroupInput = nodeStructure.inputs.find(
          (input) => input.type === INPUT_TYPES.FORINPUTGROUP
        );
        console.log(forInputGroupInput);
        if (forInputGroupInput) {
          // Ensure the childNodes array exists
          if (!forInputGroupInput.values) {
            forInputGroupInput.values = null;
          }

          // Update baseInputs with the value of itemToBeUpdated
          forInputGroupInput.values[0][itemToBeUpdated] = [
            { textValue: newValue },
          ];
          // Update the inputs array
          updatedInputs = nodeStructure.inputs.map((inp) =>
            inp.id === forInputGroupInput.id ? forInputGroupInput : inp
          );
        }
      } else if (dropDownId && isFromDropDownButtonGroup) {
        console.log("in case 2");
        const dropDownInput = nodeStructure.inputs.find(
          (input) => input.type === INPUT_TYPES.DROPDOWNBUTTONGROUP
        );

        if (dropDownInput) {
          // Ensure the value array exists
          if (!dropDownInput.values) {
            dropDownInput.values = [];
          }

          // Find the existing dropdown value by dropDownId
          const existingDropDown = dropDownInput.values.find(
            (val: any) => val.id === dropDownId
          );

          if (existingDropDown) {
            // Update the existing value
            existingDropDown.values = [{ textValue: newValue }];
          } else {
            // Add new dropdown value
            dropDownInput.values.push({
              id: dropDownId,
              values: [{ textValue: newValue }],
            });
          }

          // Update the inputs array
          updatedInputs = nodeStructure.inputs.map((inp) =>
            inp.id === dropDownInput.id ? dropDownInput : inp
          );
        }
      } else {
        console.log("in case 3");
        updatedInputs = nodeStructure.inputs.map((inp) =>
          inp.id === input.id
            ? { ...inp, values: [{ textValue: newValue }] }
            : inp
        );
      }

      // Save the updated node structure
      if (updatedInputs) {
        updateNodeStructure(nodeId, { inputs: updatedInputs });
      }
    }
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id={`${nodeId}-dropdown-label`}>{input.label}</InputLabel>
      <Select
        labelId={`${nodeId}-dropdown-label`}
        id={`${nodeId}-dropdown`}
        value={selectedValue}
        label={input.label}
        onChange={handleChange}
        sx={{
          "& .MuiSelect-icon": {
            color: "red",
          },
        }}
      >
        <MenuItem value="">
          <em>Select a value</em>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
