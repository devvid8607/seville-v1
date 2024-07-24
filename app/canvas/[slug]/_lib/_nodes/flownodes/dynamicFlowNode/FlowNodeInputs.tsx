import { Box } from "@mui/material";
import { NodeStructureInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { renderInputField } from "../../../_inputs/RenderInput";

type SevilleNodeInputsProps = {
  inputs: NodeStructureInput[];
  nodeId: string;
};

export const FlowNodeInputs: React.FC<SevilleNodeInputsProps> = ({
  inputs,
  nodeId,
}) => {
  return (
    <>
      {inputs.map((input) => {
        if (input.visible) {
          return (
            <Box m={2} key={input.id}>
              {renderInputField(input, nodeId)}
            </Box>
          );
        }
      })}
    </>
  );
};
