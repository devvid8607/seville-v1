import { AllowedDataType } from "../../../modelCreator/_lib/_types/DataTransferType";
export interface Variable {
  id: string;
  name: string;
  type: AllowedDataType;
  children?: Variable[];
  dropDetails?: any;
}
