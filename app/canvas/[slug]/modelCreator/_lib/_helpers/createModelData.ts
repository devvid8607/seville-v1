import { v4 as uuidv4 } from "uuid";
import { FieldType } from "../_types/FieldType";
import { MetaDataType } from "../_types/ModelTypes";
import { AddNewModelType } from "../_types/AddNewModelType";

export const createModelData = (modelDetails?: MetaDataType) => {
  let newFields: FieldType[] = [];
  let modelId = uuidv4();

  newFields.push({
    id: uuidv4(),
    name: "id",
    friendlyName: "ID",
    description: "This is ID desc",
    key: true,
    locked: true,
    notNull: true,
    isRemovable: false,
    enabled: false,
    dataType: "text",
    hasHandle: false,
  });

  return {
    modelId: modelDetails ? modelDetails.dataSourceId : modelId,
    modelName: modelDetails
      ? modelDetails.name
      : `Model-${modelId.slice(0, 5)}`,
    modelFriendlyName: modelDetails
      ? modelDetails.friendlyName
      : `Model-${modelId.slice(0, 5)}-fn`,
    url: "",
    createdBy: "admin",
    modifiedBy: "admin",
    dateCreated: modelDetails ? modelDetails.dateCreated : "25.03.2024",
    dateModified: modelDetails ? modelDetails.dateModified : "25.03.2024",
    attributes: newFields,
  };
};

export const createAttributeData = (fieldName: string) => {
  return {
    id: uuidv4(),
    name: fieldName,
    friendlyName: fieldName,
    description: "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: "text",
    hasHandle: false,
  };
};

export const createAttributeDataWithParameters = (attribute: any) => {
  return {
    id: uuidv4(),
    name: attribute.name,
    friendlyName: attribute.friendlyName,
    description: attribute.description,
    key: attribute.key,
    locked: attribute.locked,
    notNull: attribute.notNull,
    isRemovable: attribute.isRemovable,
    enabled: attribute.enabled,
    dataType: attribute.dataType,
    hasHandle: attribute.hasHandle,
    properties: attribute.properties,
  };
};

export const createAttributeDataWithDataTypeParameters = (datatype: any) => {
  return {
    id: uuidv4(),
    name: `Sample ${datatype.name}`,
    friendlyName: `Sample ${datatype.name}`,
    description: "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: datatype.type,
    hasHandle: false,
    properties: datatype.properties,
  };
};

export const createModelAttributeData = (
  newModelValue: AddNewModelType,
  properties: any
) => {
  console.log("properties", properties);
  return {
    id: uuidv4(),
    name: newModelValue.label ? newModelValue.label : newModelValue.name,
    friendlyName: newModelValue.label
      ? newModelValue.label
      : newModelValue.friendlyname
      ? newModelValue.friendlyname
      : "",
    description: "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: newModelValue.dataType,
    hasHandle: false,
    dataSourceFriendlyName: newModelValue.name,
    dataSourceId: newModelValue.id,
    properties: properties,
  };
};

export const createModelAttributeDataWithParameters = (newModelValue: any) => {
  return {
    id: uuidv4(),
    name: newModelValue.name,
    friendlyName: newModelValue.friendlyName,
    description: newModelValue.description,
    key: newModelValue.key,
    locked: newModelValue.locked,
    notNull: newModelValue.notNull,
    isRemovable: newModelValue.isRemovable,
    enabled: newModelValue.enabled,
    dataType: "model",
    hasHandle: newModelValue.hasHandle,
    dataSourceFriendlyName: newModelValue.dataSourceFriendlyName,
    dataSourceId: newModelValue.dataSourceId,
  };
};
export const createListAttributeDataWithParameters = (newModelValue: any) => {
  console.log(newModelValue);
  return {
    id: uuidv4(),
    name: newModelValue.name,
    friendlyName: newModelValue.friendlyName || newModelValue.name,
    description: newModelValue.description || "",
    key: newModelValue.key || false,
    locked: newModelValue.locked || false,
    notNull: newModelValue.notNull || false,
    isRemovable: newModelValue.isRemovable || true,
    enabled: newModelValue.enabled || true,
    dataType: newModelValue.dataType,
    hasHandle: newModelValue.hasHandle,
    dataSourceFriendlyName: newModelValue.dataSourceFriendlyName
      ? newModelValue.dataSourceFriendlyName
      : newModelValue.name,
    dataSourceId: newModelValue.dataSourceId ? newModelValue.dataSourceId : "",
    properties: newModelValue.properties,
    childDataType: newModelValue.childDataType || "",
  };
};

export const createCodeAttributeData = (
  newModelValue: AddNewModelType,
  properties: any
) => {
  console.log("creating code ", newModelValue);
  return {
    id: uuidv4(),
    name: newModelValue.label,
    friendlyName: newModelValue.label,
    description: "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: newModelValue.dataType,
    hasHandle: false,
    dataSourceFriendlyName: newModelValue.name,
    dataSourceId: newModelValue.id,
    properties: properties,
  };
};

export const createIdAttributeData = () => {
  return {
    id: uuidv4(),
    name: "ID",
    friendlyName: "Id",
    description: "",
    key: true,
    locked: true,
    notNull: true,
    isRemovable: false,
    enabled: false,
    dataType: "text",
    hasHandle: false,
  };
};

export const getAttributeIdFromHandle = (
  sourceHandleId: string
): string | null => {
  // Split the sourceHandleId by "|"
  const parts = sourceHandleId.split("|");
  // Find the index of "attr" to locate the attributeId correctly
  const attrIndex = parts.findIndex((part) => part === "attr");
  if (attrIndex !== -1 && attrIndex + 1 < parts.length) {
    // The attributeId should be right after "attr", hence attrIndex + 1
    return parts[attrIndex + 1];
  }
  // Return null if the attribute ID isn't found
  return null;
};

export const getNodeIDFromHandle = (handleID: string): string | null => {
  // Split the handleID by "|"
  const parts = handleID.split("|");
  // Assuming the node ID always follows "nd" in the handleID format
  const ndIndex = parts.findIndex((part) => part === "nd");
  if (ndIndex !== -1 && ndIndex + 1 < parts.length) {
    // Return the part immediately following "nd", which should be the node ID
    return parts[ndIndex + 1];
  }
  // Return null if the node ID isn't found
  return null;
};

export const getDataTypeFromHandle = (
  sourceHandleId: string
): string | null => {
  // Split the sourceHandleId by "|"
  const parts = sourceHandleId.split("|");
  // Find the index of "dt" to locate the dataType correctly
  const dtIndex = parts.findIndex((part) => part === "dt");
  if (dtIndex !== -1 && dtIndex + 1 < parts.length) {
    // The dataType should be right after "dt", hence dtIndex + 1
    return parts[dtIndex + 1];
  }
  // Return null if the data type isn't found
  return null;
};

/////new methods added based on the new tree structure from backend
export const createAttributeForModel = (newModelValue: any) => {
  console.log("newModelValue", newModelValue);
  return {
    id: uuidv4(),
    name: newModelValue.name,
    friendlyName: newModelValue.configuration.friendlyName,
    description: newModelValue.description || "",
    key: newModelValue.configuration.key || false,
    locked: newModelValue.configuration.locked || false,
    notNull: newModelValue.configuration.notNull || false,
    isRemovable: newModelValue.configuration.isRemovable || true,
    enabled: newModelValue.configuration.enabled || true,
    dataType: newModelValue.configuration.dataType,
    dataSourceFriendlyName: newModelValue.configuration.dataSourceName ?? null,
    dataSourceId: newModelValue.configuration.dataSourceId
      ? newModelValue.configuration.dataSourceId
      : null,
    properties: newModelValue.configuration.properties ?? [],
    childDataType: newModelValue.childDataType || "",
  };
};

export const createDataTypeAttributeForModel = (datatype: any) => {
  console.log("datatype", datatype);
  return {
    id: uuidv4(),
    name: `Sample ${datatype.name}`,
    friendlyName: `Sample ${datatype.name}`,
    description: "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: datatype.configuration.dataType,
    properties: datatype.configuration.properties ?? [],
  };
};

export const createCodeListAttributeForModel = (newModelValue: any) => {
  return {
    id: uuidv4(),
    name: newModelValue.name,
    friendlyName: newModelValue.configuration.friendlyName,
    description: newModelValue.description || "",
    key: false,
    locked: false,
    notNull: false,
    isRemovable: true,
    enabled: true,
    dataType: newModelValue.configuration.dataType,
    properties: newModelValue.configuration.properties ?? [],
    dataSourceFriendlyName: newModelValue.configuration.dataSourceName ?? null,
    dataSourceId: newModelValue.configuration.dataSourceId
      ? newModelValue.configuration.dataSourceId
      : null,
  };
};
