import { Box } from "@mui/material";
import { NodeStructureInput } from "../../flowComponents/_lib/_types/SevilleSchema";
import { renderInputField } from "../_inputs/RenderInput";

export const showUI = (
  nodeId: string,
  inputs: NodeStructureInput[],
  inputsToShow: number[]
) => {
  const inputsToRender = inputs.filter((input) =>
    inputsToShow.includes(input.id)
  );

  const inputsJSX = inputsToRender.map((input, index) => (
    <Box
      width="100%"
      sx={{ marginBottom: 2, mt: 2 }}
      key={`${input.id}-${index}`}
    >
      {renderInputField(input, nodeId)}
    </Box>
  ));

  return <>{inputsJSX}</>;
};
