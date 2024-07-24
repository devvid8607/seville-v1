import React from "react";
import {
  isSectionInput,
  NodeStructureInput,
} from "../../flowComponents/_lib/_types/SevilleSchema";

import { Box } from "@mui/material";
import { renderInputField } from "./RenderInput";

type SevilleSectionInputsProps = {
  input: NodeStructureInput;
  nodeId: string;
};

export const SevilleSectionInput: React.FC<SevilleSectionInputsProps> = ({
  input,
  nodeId,
}) => {
  if (!isSectionInput(input)) return;
  // alert(input.alignment);
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        marginTop: 2,
        marginBottom: 2,
      }}
    >
      <>
        {input.children.map((eachInput) => {
          if (eachInput.visible) {
            return (
              <Box
                sx={{
                  margin: 3,
                }}
                key={eachInput.id}
              >
                {renderInputField(eachInput as NodeStructureInput, nodeId)}
              </Box>
            );
          }
        })}
      </>
    </Box>
  );
};
