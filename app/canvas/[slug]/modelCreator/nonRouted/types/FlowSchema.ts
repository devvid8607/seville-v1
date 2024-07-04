import { flowNodeTypes } from "./DataTransferType";
import { ExpressionJson, Input, OutputKind } from "./FromChainner";

export type Schema = {
  schemaId: string;
  name: string;
  categoryId: string;
  favorited: boolean;
  nodeType: string;
  inputs: Input[];
  outputs: Output[];
  icon: string;
  subcategory: string;
  deprecated: boolean;
  description: string;
  helpText: string;
  headerColor: string;
  userProvidedName: string;
};

// export type Input = {
//   id: number;
//   type: string;
//   kind: string;
//   label: string;
//   optional: boolean;
//   hasHandle: boolean;
//   description: string;
//   hint: boolean;
//   minLength: number;
//   maxLength: number | null;
//   placeholder: string | null;
//   multiline: boolean;
//   def: any;
//   hideLabel: boolean;
//   allowEmptyString: boolean;
//   icon: string;
// };

export interface Output {
  readonly id: number;
  readonly type?: ExpressionJson;
  readonly neverReason?: string | null;
  readonly label: string;
  readonly name: string;
  readonly kind: OutputKind;
  readonly hasHandle?: boolean;
  readonly description?: string | null;
  readonly allowedDatatypes: string[];
  readonly nodeType: flowNodeTypes;
}
