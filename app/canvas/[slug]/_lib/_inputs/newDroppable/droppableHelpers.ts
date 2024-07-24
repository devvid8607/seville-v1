import { DragDataType } from "../../../flowComponents/_lib/_constants/transferType";
import { checkTypeCompatibility } from "../../../flowComponents/_lib/_helpers/StringCompare";
import { v4 as uuidv4 } from "uuid";
import { DropTypes } from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";

export const parseDragData = (event: React.DragEvent) => {
  const draggableInputs = [
    DragDataType.FlowComponent,
    DragDataType.FlowDraggableInput,
    DragDataType.FlowDraggableOutput,
    "text/plain",
  ];

  console.log("Available types: ", draggableInputs); // Log to see if types are expected
  for (let type of draggableInputs) {
    const data = event.dataTransfer.getData(type);
    if (data) {
      // Ensure type and data are logged
      let item = JSON.parse(data);
      console.log("Dragged data:", type, item);
      // const source = determineSource(type);
      const allowedDatatypes = [item.type];
      // console.log("Source determined as:", source);

      return { item, allowedDatatypes };
    }
  }

  console.log("No matching type found, returning default."); // Log if no types matched
  return { item: null, source: "", allowedDatatypes: [] };
};

const determineSource = (type: string) => {
  switch (type) {
    case DragDataType.FlowDraggableInput:
      return "dataSelectorNode";
    case DragDataType.FlowDraggableOutput:
      return "nodeOutputs";
    default:
      return "externalSource";
  }
};

export const createFlareItem = (expression: string) => {
  return {
    id: uuidv4(),
    icon: "CodeOutlined",
    error: false,
    typeError: false,
    values: null,
    name: expression,
    parentId: "",
    droppedId: "",
    doSelfNodeCheck: false,
    doPreviousOutputCheck: false,
    doInputModelCheck: false,
    isFlareItem: true,
    dropType: DropTypes.Flare,
    selector: { expanded: [], selected: [] },
    childDataType: null,
  };
};

export const createNewItem = (
  item: any,
  isError: boolean,
  isTypeError: boolean
) => ({
  id: item.dropDetails?.parentId ? item.dropDetails.parentId : uuidv4(),
  icon: item.icon ? item.icon : "AddOutlined",
  error: isError,
  typeError: !isTypeError,
  values: null,
  name: item.dropDetails.droppedName,
  parentId: item.dropDetails?.parentId ? item.dropDetails.parentId : "",
  droppedId: item.dropDetails ? item.dropDetails.droppedId : "",
  doSelfNodeCheck: item.dropDetails.doSelfNodeCheck,
  doPreviousOutputCheck: item.dropDetails.doPreviousOutputCheck,
  doInputModelCheck: item.dropDetails.doInputModelCheck,
  isFlareItem: false,
  dropType: item.dropType,
  selector: { expanded: [], selected: [] },
  childDataType: item.dropDetails.childDataType,
  typeCheck: item.dropDetails.typeCheck ? item.dropDetails.typeCheck : null,
});

export const isAnyTypeCompatible = (
  itemType: string,
  targetAllowedTypes: string[]
) => {
  console.log("sdfgfdg", itemType, targetAllowedTypes);
  for (const targetType of targetAllowedTypes) {
    if (checkTypeCompatibility(itemType, targetType)) {
      return true;
    }
  }

  return false; // Return false if no compatible type is found
};
