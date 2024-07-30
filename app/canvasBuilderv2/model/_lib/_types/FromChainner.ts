import { XYPosition } from "reactflow";
import { flowNodeTypes } from "./DataTransferType";

export interface NodeData {
  readonly id: string;
  readonly parentNode?: string;
  readonly schemaId: string;
  readonly isDisabled?: boolean;
  readonly isLocked?: boolean;
  readonly inputData: Input[];
  readonly groupState?: GroupState;
  readonly inputSize?: InputSize;
  readonly invalid?: boolean;
  readonly iteratorSize?: Readonly<IteratorSize>;
  readonly minWidth?: number;
  readonly minHeight?: number;
}
export interface EdgeData {
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
}

export type InputId = number;
export type InputData = Readonly<Record<InputId, InputValue>>;
export type InputValue = InputSchemaValue | undefined;
export type InputSchemaValue = string | number;
export type GroupState = Readonly<Record<GroupId, unknown>>;
export type GroupId = number;
export type InputSize = Readonly<Record<InputId, Readonly<Size>>>;
export interface Size {
  width: number;
  height: number;
}
export interface IteratorSize extends Size {
  offsetTop: number;
  offsetLeft: number;
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type GetSetState<T> = readonly [T, SetState<T>];

export interface NodeProto {
  id?: string;
  position: Readonly<XYPosition>;
  data: Omit<NodeData, "id" | "inputData"> & { inputData?: InputData };
  nodeType: flowNodeTypes;
}

export const getUniqueKey = (item: InputItem): number => {
  if (item.kind === "group") return item.group.id + 2000;
  return item.id;
};
export type GroupKind = Group["kind"];
interface GroupBase {
  readonly id: GroupId;
  readonly kind: GroupKind;
  readonly options: Readonly<Record<string, unknown>>;
  readonly items: readonly (InputId | Group)[];
}
interface OptionalListGroup extends GroupBase {
  readonly kind: "optional-list";
  readonly options: Readonly<Record<string, never>>;
}
interface ConditionalGroup extends GroupBase {
  readonly kind: "conditional";
  readonly options: {
    readonly condition: Condition;
  };
}
export type InputKind = Input["kind"];
export type ExpressionJson =
  | string
  | number
  | boolean
  | ExpressionJson[]
  | number[]
  | string[];

export interface InputBase {
  readonly id: InputId;
  readonly type: string;
  readonly adapt?: ExpressionJson | null;
  readonly typeDefinitions?: string | null;
  readonly kind: InputKind;
  readonly label: string;
  readonly optional: boolean;
  readonly hasHandle?: boolean;
  readonly description?: string;
  readonly hint: boolean;
  readonly allowedDatatypes: string[];
  readonly nodeType: flowNodeTypes;
  readonly allowHardCoding: boolean;
  readonly helpText: string;
}

export interface TextInput extends InputBase {
  readonly kind: "text";
  readonly isEmail?: boolean;
  readonly isURL?: boolean;
  readonly isPassword?: boolean;
  readonly multiline?: boolean;
  readonly minLength?: number | null;
  readonly maxLength?: number | null;
  readonly placeholder?: string | null;
  readonly def: string | null;
  readonly allowEmptyString?: boolean;
  readonly hideLabel: boolean;
  readonly mask?: string;
  readonly adornment?: string;
  readonly isHidden?: boolean;
}
export interface NumberInput extends InputBase {
  readonly kind: "number";
  readonly def: number;
  readonly min: number | null;
  readonly max: number | null;
  readonly precision: number;
  readonly controlsStep: number;
  readonly unit?: string | null;
  readonly noteExpression?: string | null;
  readonly hideTrailingZeros: boolean;
  readonly hideLabel: boolean;
}

export interface DateInput extends InputBase {
  readonly kind: "date";
  readonly def: string;
  readonly hideLabel: boolean;
}

export interface DropDownInput extends InputBase {
  readonly kind: "dropdown";
  readonly def: string | number;
  readonly options: readonly InputOption[];
  readonly preferredStyle: DropDownStyle;
  readonly isAutocomplete?: boolean;
  readonly multiSelect?: boolean;
  readonly optionsFromAPI?: boolean;
}

export interface InputOption {
  option: string;
  value: InputSchemaValue;
  type?: ExpressionJson;
}

export type DropDownStyle = "dropdown" | "checkbox" | "radio";

export type FieldKind = "number" | "text" | "date" | "dropdown";

export type Group = OptionalListGroup | ConditionalGroup;

export type Input = TextInput | NumberInput | DateInput | DropDownInput;

export type InputItem = Input | GroupInputItem;

export interface GroupInputItem {
  readonly kind: "group";
  readonly group: Group;
  readonly inputs: readonly InputItem[];
}
export type Condition =
  | AndCondition
  | OrCondition
  | NotCondition
  | EnumCondition
  | TypeCondition;
export interface AndCondition {
  readonly kind: "and";
  readonly items: readonly Condition[];
}
export interface OrCondition {
  readonly kind: "or";
  readonly items: readonly Condition[];
}
export interface NotCondition {
  readonly kind: "not";
  readonly condition: Condition;
}
export interface EnumCondition {
  readonly kind: "enum";
  readonly enum: InputId;
  readonly values: readonly InputSchemaValue[] | InputSchemaValue;
}
export interface TypeCondition {
  readonly kind: "type";
  readonly input: InputId;
  readonly condition: ExpressionJson;
  readonly ifNotConnected: boolean;
}

export type OutputKind = "image" | "large-image" | "tagged" | "generic";
