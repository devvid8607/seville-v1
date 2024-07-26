export enum DropTypes {
  Model = "Model",
  Output = "Output",
  DataType = "DataType",
  GlobalVar = "GlobalVar",
  CustomVar = "CustomVar",
  List = "List",
  Flare = "Flare",
}

export type ToolBoxTreeDataType = {
  id: string;
  treeType: string; //type from the toolbox tree
  parentId: null | string;
  parentName: null | string;
  title: string;
  name: string;
  children: ToolBoxTreeDataType[];
  isOpen: boolean;
  type?: string | string[];
  draggable: boolean;
  icon?: string;
  haschildren: boolean;
  configuration: any;

  properties?: any[];

  dropType?: DropTypes;
  dropDetails?: {
    droppedName: string;
    droppedId: string;
    parentId?: string | null;
    doSelfNodeCheck: boolean;
    doPreviousOutputCheck: boolean;
    doInputModelCheck: boolean;
    typeCheck: string | string[];
    attrId?: string;
  };
};
