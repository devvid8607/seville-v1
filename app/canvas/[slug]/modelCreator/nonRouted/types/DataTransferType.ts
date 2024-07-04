import { Input } from "./FromChainner";
import { Output, Schema } from "./FlowSchema";

export type flowNodeTypes =
  | "flowNode"
  | "flowIteratorNode"
  | "flowIteratorHelperNode"
  | "flowDataSelectorNode"
  | "flowOutputSelectorNode";

export type DataToTransfer = {
  type: flowNodeTypes;
  schemaId: string;
  inputs: Input[];
  outputs: Output[];
  node: Schema;
  offsetX: number;
  offsetY: number;
};

export interface SevilleNodeData {
  id: string;
  schemaId: string;
  inputData: Input[];
  outputData: Output[];
  node: Schema;
  label: string;
}

export interface SevilleNodeObject {
  id: string;
  type: string;
  position: any;
  dragHandle: string;
  data: SevilleNodeData;
}

export type AllowedDataType =
  | "singleValue"
  | "listValue"
  | "complexValue"
  | "logicValue"
  | "workFlowValue";

export interface SevilleDataObject {
  id: number;
  name: string;
  nodeType: string;
  allowedDatatypes: AllowedDataType[];
  parentNodeId?: string;
  icon: string;
  error: boolean;
}
