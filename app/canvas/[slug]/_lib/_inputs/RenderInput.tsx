import { NodeStructureInput } from "../../flowComponents/_lib/_types/SevilleSchema";
import { INPUT_TYPES } from "../../flowComponents/_lib/_constants/inputTypes";
import { SevilleButtonInput } from "./SevilleButtonInput";
import { SevilleHeader } from "./SevilleHeader";
import { SevilleTexfieldButtonGroup } from "./SevilleTexfieldButtonGroup";
import { SevilleSectionInput } from "./SevilleSectionInput";
import { SevilleDropdownButtonGroup } from "./SevilleDropdownButtonGroup";
import { SevilleDroppableInput } from "./SevilleDroppableInput";
import { SevilleDropdownInput } from "./SevilleDropdownInput";
import { TreeSelector } from "./newDroppable/treeSelector/TreeSelector";
import { SevilleNewDroppableInput } from "./newDroppable/SevilleNewDroppableInput";
import { IfInputGroup } from "./sevilleIfInputGroup/IfInputGroup";
import MappingModelInput from "./mappingModelInput/MappingModelInput";

export const renderInputField = (input: NodeStructureInput, nodeId: string) => {
  if (input.type === INPUT_TYPES.DROPPABLE) {
    return <SevilleDroppableInput input={input} nodeId={nodeId} />;
  }

  if (input.type === INPUT_TYPES.NEWDROPPABLE) {
    console.log(input, nodeId);
    return <SevilleNewDroppableInput input={input} nodeId={nodeId} />;
  }
  if (input.type === INPUT_TYPES.HEADER) {
    return <SevilleHeader input={input} />;
  }
  if (input.type === INPUT_TYPES.BUTTON) {
    return <SevilleButtonInput input={input} nodeId={nodeId} />;
  }
  if (input.type === INPUT_TYPES.SECTION) {
    return <SevilleSectionInput input={input} nodeId={nodeId} />;
  }
  if (input.type === INPUT_TYPES.TREESELECTOR) {
    return <TreeSelector input={input} nodeId={nodeId} />;
  }
  if (input.type === INPUT_TYPES.IFINPUTGROUP) {
    return <IfInputGroup nodeId={nodeId} input={input} />;
  }
  if (input.type === INPUT_TYPES.TEXTFIELDBUTTONGROUP) {
    return <SevilleTexfieldButtonGroup nodeId={nodeId} input={input} />;
  }
  if (input.type === INPUT_TYPES.DROPDOWNBUTTONGROUP) {
    return <SevilleDropdownButtonGroup nodeId={nodeId} input={input} />;
  }
  if (input.type === INPUT_TYPES.DROPDOWN) {
    return <SevilleDropdownInput input={input} nodeId={nodeId} />;
  }
  if (input.type === INPUT_TYPES.MODELINPUT) {
    return <MappingModelInput input={input} nodeId={nodeId} />;
  }
};
