import { XYPosition } from "reactflow";
import { flowNodeTypes } from "./DataTransferType";

export interface ExtendedNode extends Node {
  data: {
    isSticky: boolean;
  };
}

export type defaultNodestype = {
  schemaId: string;
  position: XYPosition;
};

export type canvasHeader = {
  canvasName: string;
  canvasDesc: string;
  canvasId: string;
  createdBy: string;
  modifiedBy: string;
  dateCreated: string;
  dateModified: string;
};

export type Schema = {
  schemaId: string;
  name: string;
  categoryId: string;
  // category: string;
  // categoryID: string;
  favorited: boolean;
  nodeType: string;
  inputs: Input[];
  outputs: Output[];
  icon: string;
  subcategory?: string;
  deprecated: boolean;
  description: string;
  helpText: string;
  headerColor: string;
  userProvidedName: string;
  subType?: string; //subtype for iterator
  options?: any[];
  defaultNodes: defaultNodestype[] | null;
};

export interface Output {
  readonly id: string;
  readonly kind: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly placeholder: string;
  readonly visible: boolean;
  readonly allowedDatatypes: string[];
  readonly name: string;
  readonly nodeType?: flowNodeTypes;
  readonly source: string;
  children: NodeStructureOutput[];
}

export interface NodeStructureOutput extends Output {
  parentNodeId: string;
  userProvidedName?: string;
  outputId?: string;
}

export type DropdownOption = {
  option: string;
  value: string;
};

export type Input = {
  id: number;
  type: string;
  label: string;
  description: string;
  icon: string;
  placeholder: string;
  visible: boolean;
  config: any;
};

export type SectionInput = Input & {
  children: ExtendedInput[];
  alignment: "vertical" | "horizontal";
};

export type ButtonEvents = {
  eventType: "serverEvent" | "clientEvent";
  event: "click" | "hover" | "mouseover";
  fnCall: string;
  fnArguments: any[];
};

export type ButtonInput = Input & {
  type: "button";
  events: ButtonEvents[];
  disabled: boolean;
};

export type DroppableInput = Input & {
  type: "droppable";
  allowedDataTypes: { dropType: string[]; edgeType: string | null };
  allowHardCoding: boolean;
  allowMultipleDrop?: boolean;
  kind?: string;
  selector?: boolean;
  showFlareDrawer?: boolean;
  isMappedNode?: boolean;
  modelId?: string;
  showMapProps?: boolean;
  showTransformProps?: boolean;
};

export type HeaderInput = Input & {
  type: "header";
};

export type DropdownInput = Input & {
  type: "dropdown";
  fromAPI: boolean;
  apiValue: string;
  options: DropdownOption[];
  def?: string;
};

export type IfInputGroup = Input & {
  type: "ifInputGroup";
};

export type ModelInput = Input & {
  type: "model";
  modelId: string;
};

export type ExtendedInput =
  | ButtonInput
  | DroppableInput
  | HeaderInput
  | SectionInput
  | DropdownInput
  | IfInputGroup
  | ModelInput;

export type NodeStructureInput = ExtendedInput & {
  options?: any[];
  parentNodeId: string;

  values: any;
};

export const isDroppableInput = (
  input: ExtendedInput
): input is DroppableInput => {
  return input.type === "droppable";
};

export const isNewDroppableInput = (
  input: ExtendedInput
): input is DroppableInput => {
  return input.type === "newDroppable";
};

export const isButtonInput = (input: ExtendedInput): input is ButtonInput => {
  return input.type === "button";
};

export const isModelInput = (input: ExtendedInput): input is ModelInput => {
  return input.type === "model";
};

export const isSectionInput = (input: ExtendedInput): input is SectionInput => {
  return input.type === "section";
};

export const isDropdownInput = (
  input: ExtendedInput
): input is DropdownInput => {
  return input.type === "dropdown";
};
