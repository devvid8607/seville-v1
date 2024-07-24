import { DropTypes } from "../../../_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";

export interface InputValueType {
  id: string;
  values: ValueModelType[];
}

export interface ValueModelType {
  id?: string | number;
}

export interface ComplexValueType extends ValueModelType {
  name: string | null;
  icon: string | null;
  error: boolean | null;
  typeError: boolean | null;
  // source: string | null;
  values: AnyValueModelType[] | null;
  //fullId: string;
  parentId: string;
  droppedId: string;

  doSelfNodeCheck: boolean;
  doPreviousOutputCheck: boolean;
  doInputModelCheck: boolean;
  isFlareItem: boolean;
  dropType: DropTypes;
  selector: any;
  childDataType: string | null;
}

export interface SimpleValueType extends ValueModelType {
  textValue: string;
}

export type AnyValueModelType =
  | SimpleValueType
  | ComplexValueType
  | ConditionalValueType
  | IteratorValue;

export interface ConditionalValueType extends ValueModelType {
  valueOne: AnyValueModelType;
  condition: string;
  valueTwo: AnyValueModelType;
  logic: string;
}

export interface IndividualIteratorType extends ValueModelType {
  item: AnyValueModelType;
  index: AnyValueModelType | null;
  noOfIterations: AnyValueModelType;
}

export interface IteratorValue extends ValueModelType {
  values: IndividualIteratorType[] | ConditionalValueType[];
}

export type InputValuesArrayType = AnyValueModelType[];

// export function isComplexValueType(value: any): value is ComplexValueType {
//   return (
//     value && typeof value.name === "string" && typeof value.icon === "string"
//   );
// }

export function isComplexValueType(value: any): value is ComplexValueType {
  // Check if value exists and validate all properties that define ComplexValueType
  // return (
  //   value !== null &&
  //   typeof value === "object" &&
  //   typeof value.name === "string" && // Ensures name is a string
  //   typeof value.icon === "string" && // Ensures icon is a string
  //   typeof value.error === "boolean" && // Ensures error is a boolean
  //   typeof value.typeError === "boolean" && // Ensures typeError is a boolean
  //   typeof value.source === "string" && // Ensures source is a string
  //   Array.isArray(value.values) && // Ensures values is an array (or null, handle null separately if needed)
  //   typeof value.fullId === "string"
  // );
  // Ensures fullId is a string
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.error === "boolean" &&
    typeof value.typeError === "boolean" &&
    // typeof value.source === "string" &&
    (value.values === null || Array.isArray(value.values)) && // Allows values to be null or an array
    typeof value.parentId === "string" &&
    typeof value.droppedId === "string"
  );
}

export function isSimpleValueType(value: any): value is SimpleValueType {
  return value && typeof value.textValue === "string";
}
