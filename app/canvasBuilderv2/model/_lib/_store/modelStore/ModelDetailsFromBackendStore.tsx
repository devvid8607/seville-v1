import { create } from "zustand";

import modelDetails from "../../dummyData/modelDetails.json";
import { v4 as uuidv4 } from "uuid";
import { FieldType } from "../../_types/FieldType";

// Assuming this is your initial data

// Define a type for your model for TypeScript (optional)
export type Model = {
  modelId: string;
  modelName: string;
  modelFriendlyName?: string;
  modelDesc?: string;
  attributes: FieldType[];
  isClone?: boolean;
  url: string;
  createdBy: string;
  modifiedBy: string;
  dateCreated: string;
  dateModified: string;
  map?: string;
  childModel?: Model;
  isUpdated?: boolean;
};
const initialModels: Model[] = modelDetails.map((model: Model) => ({
  ...model,
  isUpdated: false,
}));

type CloneModelResult =
  | {
      newModelId: string;
      newModelName: string;
      newModelFriendlyName: string;
    }
  | undefined;

export interface MappingConfiguration {
  id: string;
  path: string;
  maps: MapDetail[];
}

export interface MetaData {
  source: string;
  dataType: string;
  processSourceReference: boolean;
  defaultValue: string;
  ignoreEmptyArray: boolean;
  ignoreNullArray: boolean;
  propertyType: string;
  format: string;
}

export interface ConfigurationProperties {
  dataType: string;
  propertyType: string;
  destinationType: string;
  node: string;
}

export interface BaseTransformationProperties {
  type: string;
}

export interface FlareTransformationProperties
  extends BaseTransformationProperties {
  type: "flare";
  function?: string;
  parameters?: Parameter[];
}

export interface JsonTransposeTransformationProperties
  extends BaseTransformationProperties {
  type: "jsonTranspose";
  keyLookupField?: string;
  valueLookupField?: string;
  prependKey?: string;
}

export interface FunctionTransformationProperties
  extends BaseTransformationProperties {
  type: "function";
  function: string;
  parameters?: Parameter[];
}

export interface ValueMappingTransformationProperties
  extends BaseTransformationProperties {
  type: "valueMapping";
  parameters?: Parameter[];
}

export interface ExcelListTransformationProperties
  extends BaseTransformationProperties {
  type: "excelList";
  dataType: string;
}

export interface ExcelCellValueMappingTransformationProperties
  extends BaseTransformationProperties {
  type: "excelCellValueMapping";
  parameters?: Parameter[];
}

export interface Parameter {
  key: string;
  value: string;
}

export type TransformationProperties =
  | FlareTransformationProperties
  | JsonTransposeTransformationProperties
  | FunctionTransformationProperties
  | ValueMappingTransformationProperties
  | ExcelListTransformationProperties
  | ExcelCellValueMappingTransformationProperties
  | null;

export interface MapDetail {
  id: string;
  dest: string;
  destName: string;
  source: string;
  sourceName: string;
  sourceParentId: string | null;
  sourceParentName: string | null;
  sourceData?: any[];
  destDataType: string;
  sourceDataType: string;
  error: boolean;
  configuration?: MappingConfiguration;
  metadata: MetaData;
  configurationProperties: ConfigurationProperties | null;
  transformations: TransformationProperties;
}

export interface RootMap {
  id: string;
  dest: string;
  configuration: MappingConfiguration | undefined;
}

export interface RootMap2 {
  id: string;
  dest: string;
  configuration: MappingConfiguration | undefined;
  destName: string;
  source: string;
  sourceName: string;
  sourceParentId: string | null;
  sourceParentName: string | null;
  destDataType: string;
  sourceDataType: string;
  error: boolean;
  metadata: MetaData;
  configurationProperties: ConfigurationProperties | null;
  transformations: TransformationProperties;
  nodeId?: string | null;
}

interface ModelStore {
  models: Model[];
  inputModelId: string | null;
  setInputModelId: (modelId: string) => void;
  addModelToStore: (newModel: Model) => void;
  getModelById: (modelId: string) => Model | undefined;

  addAttributeToModel: (modelId: string, newAttribute: FieldType) => void;
  getModelAttributes: (modelId: string) => FieldType[];
  getAttributeById: (
    modelId: string,
    attributeId: string
  ) => FieldType | undefined;
  updateAttributeValueOfAModel: (
    modelId: string,
    fieldId: string,
    propertyName: keyof FieldType,
    newValue: any
  ) => void;
  addAttributeProperties: (
    modelId: string,
    attributeId: string,
    newProperties: any[]
  ) => void;
  updateProperties: (
    modelId: string,
    attributeId: string,
    newProperties: any[]
  ) => void;
  getAttributeProperties: (
    modelId: string,
    attributeId: string
  ) => any[] | undefined;
  updatePropertyCurrentValue: (
    modelId: string,
    fieldId: string,
    propertyId: string,
    newValue: any
  ) => void;
  updatePropertyCurrentListValues: (
    modelId: string,
    fieldId: string,
    propertyId: string,
    newValue: any
  ) => void;
  findPropertyIdByType: (
    modelId: string,
    fieldId: string,
    propertyType: string
  ) => string | undefined;
  cloneModel: (modelId: string, header: string) => CloneModelResult;
  removeAttribute: (modelId: string, attributeId: string) => void;
  reorderAttributes: (
    modelId: string,
    sourceAttributeId: string,
    targetAttributeId: string
  ) => void;
  removeAllAttributesFromModel: (modelId: string) => void;
  updateModelProperty: <K extends keyof Model>(
    modelId: string,
    propertyName: K,
    newValue: Model[K]
  ) => void;
  updateModelMapProperty: (modelId: string, newMapValue: string) => void;
  createMapForModel: (modelId: string) => RootMap;
  createMapForModelInput: (modelId: string, nodeId: string) => RootMap2;
  findAllChildModels: (modelId: string) => Model[];
  //getDetailedModel: (modelId: string) => Model;
  fetchModels: () => Promise<void>;
  clearModels: () => void;
}

// Define your store
const useModelStore = create<ModelStore>((set, get) => ({
  models: [],
  inputModelId: null,
  // Implementations for the methods defined in ModelStore
  addModelToStore: (newModel) =>
    set((state) => {
      const modelExists = state.models.some(
        (model) => model.modelId === newModel.modelId
      );

      if (modelExists) {
        console.warn(`Model with id ${newModel.modelId} already exists.`);
        return state; // Return the current state without changes
      }

      return {
        models: [...state.models, { ...newModel, isUpdated: true }],
      };
    }),

  getModelById: (modelId) =>
    get().models.find((model) => model.modelId === modelId),

  addAttributeToModel: (modelId, newAttribute) => {
    set((state) => ({
      models: state.models.map((model) =>
        model.modelId === modelId
          ? {
              ...model,
              attributes: [...model.attributes, newAttribute],
              isUpdated: true,
            }
          : model
      ),
    }));
  },

  getModelAttributes: (modelId) => {
    const model = get().models.find((model) => model.modelId === modelId);
    return model ? model.attributes : [];
  },

  getAttributeById: (modelId, attributeId) => {
    const model = get().models.find((model) => model.modelId === modelId);
    if (!model) return undefined;
    return model.attributes.find((attribute) => attribute.id === attributeId);
  },

  updateAttributeValueOfAModel: (
    modelId,
    attributeId,
    propertyName,
    newValue
  ) => {
    console.log(
      `Updating attribute value: modelId=${modelId}, attributeId=${attributeId}, propertyName=${propertyName}, newValue=${newValue}`
    );
    set((state) => {
      const updatedModels = state.models.map((model) => {
        if (model.modelId === modelId) {
          console.log(
            `Found model with modelId=${modelId}. Updating attributes...`
          );
          const updatedAttributes = model.attributes.map((attribute) => {
            if (attribute.id === attributeId) {
              console.log(
                `Found attribute with id=${attributeId}. Updating ${propertyName} to ${newValue}.`
              );
              return { ...attribute, [propertyName]: newValue };
            }
            return attribute;
          });

          return {
            ...model,
            attributes: updatedAttributes,
          };
        }
        return model;
      });

      // Optionally, log the updated models to see the changes
      console.log("Updated models:", updatedModels);

      return { models: updatedModels };
    });
  },

  updateProperties: (modelId, attributeId, newProperties) => {
    set((state) => ({
      models: state.models.map((model) => {
        if (model.modelId === modelId) {
          const updatedAttributes = model.attributes.map((attribute) => {
            if (attribute.id === attributeId) {
              return { ...attribute, properties: newProperties };
            }
            return attribute;
          });
          return { ...model, attributes: updatedAttributes };
        }
        return model;
      }),
    }));
  },

  addAttributeProperties: (modelId, attributeId, newProperties) => {
    set((state) => ({
      models: state.models.map((model) => {
        if (model.modelId === modelId) {
          const updatedAttributes = model.attributes.map((attribute) => {
            if (
              attribute.id === attributeId &&
              (!attribute.properties || attribute.properties.length === 0)
            ) {
              return { ...attribute, properties: newProperties };
            }
            return attribute;
          });
          return { ...model, attributes: updatedAttributes };
        }
        return model;
      }),
    }));
  },

  getAttributeProperties: (modelId, attributeId) => {
    const model = get().models.find((model) => model.modelId === modelId);
    if (!model) return undefined; // Model not found

    const attribute = model.attributes.find((attr) => attr.id === attributeId);
    if (!attribute) return undefined; // Attribute not found

    return attribute.properties;
  },
  findPropertyIdByType: (modelId, fieldId, propertyType) => {
    // Find the model by modelId
    const model = get().models.find((m) => m.modelId === modelId);
    if (!model) return undefined;

    // Find the field by fieldId within the found model
    const field = model.attributes.find((f) => f.id === fieldId);
    if (!field || !field.properties) return undefined;

    // Find the property by type within the found field
    const property = field.properties.find((p) => p.type === propertyType);
    if (!property) return undefined;

    // Return the id of the found property
    return property.id;
  },
  cloneModel: (modelId, header) => {
    console.log("header", header);
    const originalModel = get().getModelById(modelId);
    if (!originalModel) {
      console.error("Model not found:", modelId);
      return undefined; // Return undefined if the original model is not found
    }
    console.log("original modal", originalModel);
    // Assuming Model and FieldType include all necessary fields to be cloned
    // Deep clone the model to ensure nested objects are copied
    const clonedModel = JSON.parse(JSON.stringify(originalModel));

    // Assign a new unique modelId to the cloned model
    clonedModel.modelId = uuidv4(); // Generate a new UUID for the model

    // Optionally modify the cloned model's name or any other properties
    const idSnippet = modelId.substring(0, 5);
    clonedModel.modelName =
      header === ""
        ? `${originalModel.modelName}-clone-${idSnippet}`
        : `${header}-${originalModel.modelName}-clone-${idSnippet}`;
    clonedModel.modelFriendlyName =
      header === ""
        ? `${originalModel.modelFriendlyName}-clone-${idSnippet}`
        : `${header}-${originalModel.modelFriendlyName}-clone-${idSnippet}`;
    clonedModel.isClone = true;

    // Add the cloned model to the store
    get().addModelToStore(clonedModel);

    // Return the new modelId of the cloned model
    return {
      newModelId: clonedModel.modelId,
      newModelName: clonedModel.modelName,
      newModelFriendlyName: clonedModel.modelFriendlyName,
    };
  },
  reorderAttributes: (
    modelId: string,
    sourceAttributeId: string,
    targetAttributeId: string
  ) => {
    set((state: ModelStore) => {
      const modelIndex = state.models.findIndex(
        (model) => model.modelId === modelId
      );
      if (modelIndex === -1) return state; // If model not found, return the current state unmodified

      const model = state.models[modelIndex];
      const attributes = model.attributes;
      const sourceIndex = attributes.findIndex(
        (attr) => attr.id === sourceAttributeId
      );
      const targetIndex = attributes.findIndex(
        (attr) => attr.id === targetAttributeId
      );

      // Find the index of the key attribute, if any
      const keyIndex = attributes.findIndex((attr) => attr.key);

      if (sourceIndex === -1 || targetIndex === -1) return state; // If attribute not found, return the current state unmodified
      if (sourceIndex === keyIndex) return state; // Do not allow moving the key attribute

      // Adjust targetIndex to prevent placing any attribute above the key attribute
      let adjustedTargetIndex = targetIndex;
      if (keyIndex === 0 && targetIndex === 0 && sourceIndex !== keyIndex) {
        adjustedTargetIndex = 1;
      }

      // Reorder attributes with adjusted target index
      const newAttributes = [...attributes];
      const [removedAttribute] = newAttributes.splice(sourceIndex, 1);
      newAttributes.splice(
        adjustedTargetIndex > sourceIndex
          ? adjustedTargetIndex - 1
          : adjustedTargetIndex,
        0,
        removedAttribute
      );

      // Update the model with the new attributes array and produce a new models array with the updated model
      const newModels = state.models.map((model, index) =>
        index === modelIndex ? { ...model, attributes: newAttributes } : model
      );

      // Return the updated state
      return { ...state, models: newModels };
    });
  },

  removeAllAttributesFromModel: (modelId: string) => {
    set((state: ModelStore) => {
      // Find the index of the model to update
      const modelIndex = state.models.findIndex(
        (model) => model.modelId === modelId
      );
      if (modelIndex === -1) {
        // Model not found, optionally handle error
        console.error("Model not found");
        return state; // Return the current state unchanged
      }

      // Copy the current state's models to a new array for immutability
      const updatedModels = [...state.models];

      // Filter attributes to keep only those with key property as true
      const keyAttributes = updatedModels[modelIndex].attributes.filter(
        (attribute) => attribute.key === true
      );

      // Update the specified model's attributes to keep only key attributes
      updatedModels[modelIndex] = {
        ...updatedModels[modelIndex],
        attributes: keyAttributes,
      };

      // Return the part of the state that's updated
      return { ...state, models: updatedModels };
    });
  },

  updatePropertyCurrentValue: (modelId, attributeId, propertyId, newValue) =>
    set((state) => {
      console.log(
        "updatePropertyCurrentValue called with:",
        modelId,
        attributeId,
        propertyId,
        newValue
      );

      const updatedModels = state.models.map((model) => {
        if (model.modelId === modelId) {
          console.log("Matching model found:", model);

          const updatedAttributes = model.attributes.map((attribute) => {
            if (attribute.id === attributeId) {
              console.log("Matching attribute found:", attribute);

              const updatedProperties = attribute.properties?.map((prop) => {
                if (prop.id === propertyId) {
                  console.log("Matching property found:", prop);
                  return { ...prop, currentValue: newValue };
                }
                return prop;
              });

              console.log("Updated properties:", updatedProperties);
              return { ...attribute, properties: updatedProperties };
            }
            return attribute;
          });

          console.log("Updated attributes:", updatedAttributes);
          return { ...model, attributes: updatedAttributes };
        }
        return model;
      });

      console.log("Updated models:", updatedModels);
      // Make sure to return an object that matches your state structure
      return { models: updatedModels };
    }),
  updatePropertyCurrentListValues: (
    modelId: string,
    attributeId: string,
    propertyId: string,
    newValue: any[]
  ) => {
    set((state) => {
      // Log for debugging
      console.log(
        "updatePropertyCurrentListValues called with:",
        modelId,
        attributeId,
        propertyId,
        newValue
      );

      // Map through the models to find the correct model
      const updatedModels = state.models.map((model) => {
        if (model.modelId === modelId) {
          // Found the model, now find the correct attribute
          const updatedAttributes = model.attributes.map((attribute) => {
            if (attribute.id === attributeId) {
              // Found the attribute, now find the correct property
              const updatedProperties = attribute.properties?.map((prop) => {
                if (prop.id === propertyId) {
                  // Found the property, replace its currentListValues
                  return { ...prop, currentListValues: newValue };
                }
                return prop; // Return other properties unchanged
              });

              // Return the updated attribute
              return { ...attribute, properties: updatedProperties };
            }
            return attribute; // Return other attributes unchanged
          });

          // Return the updated model
          return { ...model, attributes: updatedAttributes };
        }
        return model; // Return other models unchanged
      });

      // Return the updated state
      return { models: updatedModels };
    });
  },
  removeAttribute: (modelId, attributeId) =>
    set((state) => {
      const updatedModels = state.models.map((modelNode) => {
        if (modelNode.modelId === modelId) {
          // Filter out the field with the specified fieldId
          const updatedFields = modelNode.attributes.filter(
            (attribute) => attribute.id !== attributeId
          );
          return { ...modelNode, attributes: updatedFields };
        }
        return modelNode;
      });

      // Directly return the updated models array as part of the state
      return { ...state, models: updatedModels };
    }),
  updateModelProperty: <K extends keyof Model>(
    modelId: string,
    propertyName: K,
    newValue: Model[K]
  ) => {
    console.log(`Attempting to update model with ID ${modelId}`);
    set((state: ModelStore) => {
      const modelIndex = state.models.findIndex(
        (model) => model.modelId === modelId
      );

      console.log(`Found model at index: ${modelIndex}`);

      if (modelIndex === -1) {
        console.error("Model not found");
        return state; // Early return if the model is not found
      }

      // Logging the current (before update) model for reference
      console.log(`Current model before update:`, state.models[modelIndex]);

      // Create a new copy of models for immutability
      const updatedModels = [...state.models];

      // Update the specified property of the model
      updatedModels[modelIndex] = {
        ...updatedModels[modelIndex],
        [propertyName]: newValue,
      };

      // Log the model after the update attempt
      console.log(`Updated model:`, updatedModels[modelIndex]);

      // Return the updated state
      return { ...state, models: updatedModels };
    });
  },
  updateModelMapProperty: (modelId, newMapValue) => {
    set((state) => {
      const updatedModels = state.models.map((model) =>
        model.modelId === modelId ? { ...model, map: newMapValue } : model
      );
      return { models: updatedModels };
    });
  },
  createMapForModel: (modelId: string): RootMap => {
    const getModelById = (id: string): Model | undefined => {
      return get().models.find((model) => model.modelId === id);
    };

    const createMapping = (
      model: Model | undefined,
      path = "",
      depth = 0 // Add a new parameter to track recursion depth
    ): MappingConfiguration | null => {
      if (!model || depth > 10) return null; // Stop recursion if depth exceeds 10

      const configuration: MappingConfiguration = {
        id: `${model.modelId}`,
        path: path ? `${path}|${model.modelId}` : `${model.modelId}`,
        maps: [],
      };

      model.attributes.forEach((attr) => {
        if (attr.dataType === "model" && attr.dataSourceId) {
          const nestedModel = getModelById(attr.dataSourceId);
          // Increment depth for the recursive call
          const nestedMapping = createMapping(
            nestedModel,
            configuration.path,
            depth + 1
          );
          if (nestedMapping) {
            configuration.maps.push({
              id: `Map.${configuration.path}.${attr.id}`,
              source: "",
              sourceName: "",
              sourceDataType: "",
              dest: `${attr.dataSourceId}`,
              destName: attr.friendlyName,
              destDataType: attr.dataType,
              error: false,

              configuration: nestedMapping,
              sourceParentId: null,
              sourceParentName: null,
              metadata: {
                source: "",
                dataType: "",
                processSourceReference: false,
                defaultValue: "",
                ignoreEmptyArray: false,
                ignoreNullArray: false,
                propertyType: "",
                format: "",
              },
              configurationProperties: null,
              transformations: null,
            });
          }
        } else {
          configuration.maps.push({
            id: `Map.${configuration.path}.${attr.id}`,
            source: "",
            sourceName: "",
            sourceDataType: "",
            dest: `${attr.id}`,
            destName: attr.friendlyName,
            destDataType: attr.dataType,
            error: false,

            sourceParentId: null,
            sourceParentName: null,
            metadata: {
              source: "",
              dataType: "",
              processSourceReference: false,
              defaultValue: "",
              ignoreEmptyArray: false,
              ignoreNullArray: false,
              propertyType: "",
              format: "",
            },
            configurationProperties: null,
            transformations: null,
          });
        }
      });

      return configuration;
    };

    const rootModel = getModelById(modelId);
    if (!rootModel) {
      console.error("Root model not found:", modelId);
      return {
        // rootMap: {
        id: `Map.${modelId}`,
        dest: "Error",
        configuration: undefined,
        // },
      };
    }
    const rootMapResult = {
      // rootMap: {
      id: `Map.${modelId}`,
      dest: rootModel.modelName,
      configuration: createMapping(rootModel) || undefined,
      // },
    };
    get().updateModelMapProperty(modelId, rootMapResult.id);

    return rootMapResult;
  },

  createMapForModelInput: (modelId: string, nodeId: string): RootMap2 => {
    const getModelById = (id: string): Model | undefined => {
      return get().models.find((model) => model.modelId === id);
    };

    const createMapping = (
      model: Model | undefined,
      path = "",
      depth = 0 // Add a new parameter to track recursion depth
    ): MappingConfiguration | null => {
      if (!model || depth > 10) return null; // Stop recursion if depth exceeds 10

      const configuration: MappingConfiguration = {
        id: `${model.modelId}`,
        path: path ? `${path}|${model.modelId}` : `${model.modelId}`,
        maps: [],
      };

      model.attributes.forEach((attr) => {
        if (attr.dataType === "model" && attr.dataSourceId) {
          const nestedModel = getModelById(attr.dataSourceId);
          // Increment depth for the recursive call
          const nestedMapping = createMapping(
            nestedModel,
            configuration.path,
            depth + 1
          );
          if (nestedMapping) {
            configuration.maps.push({
              id: `Map.${configuration.path}.${attr.id}`,
              source: "",
              sourceName: "",
              sourceDataType: "",
              dest: `${attr.dataSourceId}`,
              destName: attr.friendlyName,
              destDataType: attr.dataType,
              error: false,

              configuration: nestedMapping,
              sourceParentId: null,
              sourceParentName: null,
              metadata: {
                source: "",
                dataType: "",
                processSourceReference: false,
                defaultValue: "",
                ignoreEmptyArray: false,
                ignoreNullArray: false,
                propertyType: "",
                format: "",
              },
              configurationProperties: null,
              transformations: null,
            });
          }
        } else if (attr.dataType === "codeList" && attr.dataSourceId) {
          //const nestedModel = getModelById(attr.dataSourceId);
          // const nestedMapping = createMapping(
          //   nestedModel,
          //   configuration.path,
          //   depth + 1
          // );
          // if (nestedMapping) {
          configuration.maps.push({
            id: `Map.${configuration.path}.${attr.id}`,
            source: "",
            sourceName: "",
            sourceDataType: "",
            dest: `${attr.dataSourceId}`,
            destName: attr.friendlyName,
            destDataType: attr.dataType,
            error: false,
            sourceData: [],

            //configuration: null,
            sourceParentId: null,
            sourceParentName: null,
            metadata: {
              source: "",
              dataType: "",
              processSourceReference: false,
              defaultValue: "",
              ignoreEmptyArray: false,
              ignoreNullArray: false,
              propertyType: "",
              format: "",
            },
            configurationProperties: null,
            transformations: null,
          });
          // }
        } else {
          configuration.maps.push({
            id: `Map.${configuration.path}.${attr.id}`,
            source: "",
            sourceName: "",
            sourceDataType: "",
            dest: `${attr.id}`,
            destName: attr.friendlyName,
            destDataType: attr.dataType,
            error: false,

            sourceParentId: null,
            sourceParentName: null,
            metadata: {
              source: "",
              dataType: "",
              processSourceReference: false,
              defaultValue: "",
              ignoreEmptyArray: false,
              ignoreNullArray: false,
              propertyType: "",
              format: "",
            },
            configurationProperties: null,
            transformations: null,
          });
        }
      });

      return configuration;
    };

    const rootModel = getModelById(modelId);
    if (!rootModel) {
      console.error("Root model not found:", modelId);
      return {
        // rootMap: {
        id: `Map.${modelId}`,
        dest: "Error",
        error: true,
        configuration: undefined,
        source: "",
        sourceName: "",
        sourceDataType: "",
        destName: "",
        destDataType: "model",
        sourceParentId: null,
        sourceParentName: null,
        metadata: {
          source: "",
          dataType: "",
          processSourceReference: false,
          defaultValue: "",
          ignoreEmptyArray: false,
          ignoreNullArray: false,
          propertyType: "",
          format: "",
        },
        configurationProperties: null,
        transformations: null,
        nodeId: null,
        // },
      };
    }
    const rootMapResult = {
      // rootMap: {
      id: `Map.${modelId}`,
      dest: rootModel.modelName,
      configuration: createMapping(rootModel) || undefined,
      error: false,
      source: "",
      sourceName: "",
      sourceDataType: "",
      destName: rootModel.modelName,
      destDataType: "model",
      sourceParentId: null,
      sourceParentName: null,
      metadata: {
        source: "",
        dataType: "",
        processSourceReference: false,
        defaultValue: "",
        ignoreEmptyArray: false,
        ignoreNullArray: false,
        propertyType: "",
        format: "",
      },
      configurationProperties: null,
      transformations: null,
      nodeId: nodeId,
      // },
    };
    get().updateModelMapProperty(modelId, rootMapResult.id);

    return rootMapResult;
  },

  // createMapForModel: (modelId: string): RootMap => {
  //   const getModelById = (id: string): Model | undefined => {
  //     return get().models.find((model) => model.modelId === id);
  //   };

  //   const createMapping = (
  //     model: Model | undefined,
  //     path = "",
  //     depth = 0 // Parameter to track recursion depth
  //   ): MappingConfiguration | null => {
  //     if (!model || depth > 10) return null; // Stop recursion if depth exceeds 10

  //     // Create the root configuration for the model itself
  //     const configuration: MappingConfiguration = {
  //       id: `Map.${model.modelId}`,
  //       path: path ? `${path}|${model.modelId}` : `${model.modelId}`,
  //       maps: [], // This will include attribute mappings
  //     };

  //     // Iterate over model attributes to create nested mappings
  //     model.attributes.forEach((attr) => {
  //       if (attr.dataType === "model" && attr.dataSourceId) {
  //         const nestedModel = getModelById(attr.dataSourceId);
  //         const nestedMapping = createMapping(
  //           nestedModel,
  //           `${configuration.path}.${attr.id}`,
  //           depth + 1
  //         );
  //         if (nestedMapping) {
  //           configuration.maps.push({
  //             id: `Map.${configuration.path}.${attr.id}`,
  //             source: "",
  //             sourceName: "",
  //             sourceDataType: "",
  //             dest: `${attr.dataSourceId}`,
  //             destName: attr.friendlyName,
  //             destDataType: attr.dataType,
  //             error: false,
  //             configuration: nestedMapping,
  //             sourceParentId: null,
  //             sourceParentName: null,
  //             metadata: {
  //               source: "",
  //               dataType: "",
  //               processSourceReference: false,
  //               defaultValue: "",
  //               ignoreEmptyArray: false,
  //               ignoreNullArray: false,
  //               propertyType: "",
  //               format: "",
  //             },
  //             configurationProperties: null,
  //             transformations: null,
  //           });
  //         }
  //       } else {
  //         configuration.maps.push({
  //           id: `Map.${configuration.path}.${attr.id}`,
  //           source: "",
  //           sourceName: "",
  //           sourceDataType: "",
  //           dest: `${attr.id}`,
  //           destName: attr.friendlyName,
  //           destDataType: attr.dataType,
  //           error: false,
  //           sourceParentId: null,
  //           sourceParentName: null,
  //           metadata: {
  //             source: "",
  //             dataType: "",
  //             processSourceReference: false,
  //             defaultValue: "",
  //             ignoreEmptyArray: false,
  //             ignoreNullArray: false,
  //             propertyType: "",
  //             format: "",
  //           },
  //           configurationProperties: null,
  //           transformations: null,
  //         });
  //       }
  //     });

  //     return configuration;
  //   };

  //   const rootModel = getModelById(modelId);
  //   if (!rootModel) {
  //     console.error("Root model not found:", modelId);
  //     return {
  //       id: `Map.${modelId}`,
  //       dest: "Error",
  //       configuration: undefined,
  //     };
  //   }

  //   const rootMapResult = {
  //     id: `Map.${modelId}`,
  //     dest: rootModel.modelName,
  //     configuration: createMapping(rootModel) || undefined,
  //     source: "",
  //     sourceName: "",
  //     sourceDataType: "",

  //     destName: rootModel.modelFriendlyName,
  //     destDataType: "model",
  //     error: false,
  //     sourceParentId: null,
  //     sourceParentName: null,
  //     metadata: {
  //       source: "",
  //       dataType: "",
  //       processSourceReference: false,
  //       defaultValue: "",
  //       ignoreEmptyArray: false,
  //       ignoreNullArray: false,
  //       propertyType: "",
  //       format: "",
  //     },
  //     configurationProperties: null,
  //     transformations: null,
  //   };

  //   get().updateModelMapProperty(modelId, rootMapResult.id);

  //   return rootMapResult;
  // },

  findAllChildModels: (modelId: string) => {
    const visitedModels = new Set();
    const allModels = new Map();

    const findChildren = (currentModelId: string) => {
      if (visitedModels.has(currentModelId)) {
        return;
      }

      const currentModel = get().getModelById(currentModelId);
      if (!currentModel) {
        return;
      }

      visitedModels.add(currentModelId);
      allModels.set(currentModelId, currentModel);

      currentModel.attributes.forEach((attr) => {
        if (attr.dataType === "model" && attr.dataSourceId) {
          findChildren(attr.dataSourceId);
        }
      });
    };

    findChildren(modelId);
    return Array.from(allModels.values());
  },
  setInputModelId: (model) => set({ inputModelId: model }),
  fetchModels: async () => {
    // Simulate a fetch operation
    const fetchedModels: Model[] = await new Promise((resolve) =>
      setTimeout(() => resolve(modelDetails), 100)
    );
    const updatedModels = fetchedModels.map((model) => ({
      ...model,
      isUpdated: false,
    }));

    set({ models: updatedModels });
  },
  clearModels: () => set({ models: [] }),
  // getDetailedModel: (modelId: string) => {
  //   //get detailed model from bACKEND based on modelId
  //   get().setInputModel(detailedModel);
  //   return detailedModel;
  // },
}));

export default useModelStore;
