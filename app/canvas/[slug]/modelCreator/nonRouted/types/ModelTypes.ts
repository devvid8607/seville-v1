export type ModelNodeType = {
  schemaId: string;
  name: string;
  nodeType: string;
  helpText: string;
  description: string;
  icon: string;
  deprecated: boolean;
  headerColor: string;
  config: ModelConfigType;
};

type ModelConfigType = {
  sidebarTabOptions: string[];
};

export type MetaDataType = {
  dataSourceId: string;
  friendlyName: string;
  description: string;
  url: string;
  name: string;
  createdBy: string;
  modifiedBy: string;
  dateCreated: string;
  dateModified: string;
  sourcePage: string;
  rules?: any[];
  values?: any[]; //added for logic output model values
};

export type ModelType = {
  id: string;
  nodeType: string;
  position: { x: number; y: number };
  metaData?: MetaDataType;
};
