export enum DropTypes {
  Model = "Model",
  Output = "Output",
  DataType = "DataType",
  GlobalVar = "GlobalVar",
  CustomVar = "CustomVar",
  List = "List",
  Flare = "Flare",
}

export type TreeDataType = {
  id: string;
  parentId: null | string;
  parentName: null | string;
  title: string;
  name: string;
  children: TreeDataType[];
  isOpen: boolean;
  type?: string | string[];
  draggable: boolean;
  icon?: string;

  properties?: any[];

  dropType?: DropTypes;

  // dropType?: {
  //   isModelAttribute?: boolean;
  //   isDataType?: boolean;
  //   isOutputData?: boolean;
  // };

  //trying to keep it common
  dropDetails?: {
    droppedName: string;
    droppedId: string;
    parentId?: string | null;
    // source: string;
    doSelfNodeCheck: boolean;
    doPreviousOutputCheck: boolean;
    doInputModelCheck: boolean;
    typeCheck: string | string[];
    attrId?: string;
  };

  //for model tree
  // referencedModelDetails?: {
  //   referencedModelId: string;
  //   referencedModelName: string;
  //   referencedModelFriendlyName?: string;
  // };
  //for output tree
  // referencedNodeDetails?: {
  //   referencedNodeId: string;
  //   source: string;
  //   outputId: string;
  //   kind: string;
  //   droppedName: string;
  // };

  //for detailed model node
  // referencedDetailedModelDetail?: {
  //   droppedName: string;
  //   source: string;
  //   droppedId: string;
  // };
};
