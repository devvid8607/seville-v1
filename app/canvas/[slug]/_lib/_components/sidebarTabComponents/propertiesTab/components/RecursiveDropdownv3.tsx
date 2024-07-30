import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import useDataTypesStore, { DataType } from "../../../../_store/DataTypesStore";

import { v4 as uuidv4 } from "uuid";
import { SmallCheckbox } from "./SmallCheckBox";
import { SmallDropdown } from "./SmallDropdown";
import { SmallModelDropdown } from "./SmallModelDropDown";
import { SmallNumberField } from "./SmallNumberField";
import { SmallRadioGroup } from "./SmallRadioGroup";
import { SmallRating } from "./SmallRating";
import { SmallSlider } from "./SmallSlider";
import { SmallSwitch } from "./SmallSwitch";
import { SmallTextField } from "./SmallTextField";
import { SmallToggleButton } from "./SmallToggleButton";
import { useModelNodesStore } from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelNodesStore";
import { useTabStore } from "../../../../_store/TabStateManagmentStore";
import useModelStore from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import { CodeListDropdown } from "./CodeListDropdown";
import { useCodeListStore } from "../../../../_nodes/codeListNode/store/CodeListStore";
export type SmallListDropdownProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  enabled?: boolean;
  currentListValues: any[];
  config: {
    options: Array<{
      id: string;
      label: string;
    }>;
    fromApi: boolean;
    ApiURL: string;
  };
  //   getModelPropsFromAPI: (newValue: any) => void;
  handleUpdateValuesList: (propId: any, newValue: any) => void;
  selectId: string;
  dataType: string;
};

export interface ListItem {
  id: string;
  name: string;
  typeId: string;
  typeCode: string;
  children: ListItem[];
  properties?: any[];
}

interface RecursiveDropdownProps {
  item: ListItem;
  storeDataTypes: DataType[];
  updateItem: (item: ListItem) => void;
  handleUpdateProp: (propId: any, newValue: any) => void;
  handleUpdateCodeProp: (propId: any, newValue: any) => void;
  handleUpdateModelProp: (newValue: any) => void;
  updateDataSourceDetails: (type: string) => void;
}

export const RecursiveDropdownv3: React.FC<SmallListDropdownProps> = React.memo(
  ({
    label,
    placeholder,
    required = false,
    defaultValue,
    size,
    id,
    currentValue,
    currentListValues,
    enabled = true,
    handleUpdateValuesList,
    selectId,
    dataType,
  }) => {
    const [localCurrentListValues, setLocalCurrentListValues] = useState<
      ListItem[]
    >([]);
    const { storeDataTypes } = useDataTypesStore((state) => ({
      storeDataTypes: state.dataTypes,
    }));

    const getCodeById = useCodeListStore((state) => state.getCodeById);

    const attributeId = useTabStore((state) => state.attributeId);
    const modelId = useTabStore((state) => state.modelId);
    const currentNode = useModelNodesStore((state) => state.currentNode);
    const getConnectedTargetNodeAndEdgeIdByHandle = useModelNodesStore(
      (state) => state.getConnectedTargetNodeAndEdgeIdByHandle
    );
    const removeEdge = useModelNodesStore((state) => state.removeEdge);
    const removeNodeById = useModelNodesStore((state) => state.removeNodeById);
    const getModelById = useModelStore((state) => state.getModelById);
    const updateAttributeValueOfAModel = useModelStore(
      (state) => state.updateAttributeValueOfAModel
    );

    useEffect(() => {
      if (currentListValues.length === 0) {
        const initialData: ListItem = {
          id: uuidv4(),
          typeId: "",
          typeCode: "",
          name: "",
          children: [],
          properties: [],
        };
        setLocalCurrentListValues([initialData]);
      } else {
        setLocalCurrentListValues(currentListValues as ListItem[]);
      }
    }, []);

    const updateItem = (updatedItem: ListItem) => {
      const updateNestedItems = (items: ListItem[]): ListItem[] => {
        return items.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          } else if (item.children.length > 0) {
            return {
              ...item,
              children: updateNestedItems(item.children),
            };
          }
          return item;
        });
      };

      const newList = updateNestedItems(localCurrentListValues);
      setLocalCurrentListValues(newList);
      handleUpdateValuesList(id, newList);
    };

    const updatePropertyValue = (
      items: ListItem[],
      propId: string,
      newValue: string
    ): ListItem[] => {
      return items.map((item) => {
        // Check if the current item has the property we're looking for
        const properties = item.properties?.map((prop) => {
          if (prop.id === propId) {
            // Found the property, update its currentValue
            return { ...prop, currentValue: newValue };
          }
          return prop;
        });

        // Recursively update children if the current item is not the one we're looking for
        const children =
          item.children && item.children.length > 0
            ? updatePropertyValue(item.children, propId, newValue)
            : item.children;

        // Return the updated item with new properties and/or children
        return { ...item, properties, children };
      });
    };

    const handleUpdatePropValueLocal = (propId: string, newValue: string) => {
      console.log("in hereeee");
      const updatedList = updatePropertyValue(
        localCurrentListValues,
        propId,
        newValue
      );

      // Set the state with the new updated list
      setLocalCurrentListValues(updatedList);
      handleUpdateValuesList(id, updatedList);
    };

    const updateDataSourceDetails = (type: string) => {
      console.log("currentnode", currentNode);
      if (currentNode) {
        //construct the handle id
        const handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|list`;
        const { edgeId, targetNode } = getConnectedTargetNodeAndEdgeIdByHandle(
          currentNode.id,
          handleId
        );
        console.log(edgeId, targetNode);
        if (edgeId) removeEdge(edgeId);
        if (targetNode) removeNodeById(targetNode.id);
      }
      updateAttributeValueOfAModel(modelId, attributeId, "dataSourceId", null);
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceFriendlyName",
        null
      );
      updateAttributeValueOfAModel(modelId, attributeId, "childDataType", type);
    };

    console.log("localCurrentListValues", localCurrentListValues);

    const handleUpdateModelProp = (newValue: string) => {
      console.log("model value", newValue, dataType);
      if (currentNode) {
        //construct the handle id
        let handleId = null;
        handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|model`;
        if (handleId) {
          const { edgeId, targetNode } =
            getConnectedTargetNodeAndEdgeIdByHandle(currentNode.id, handleId);
          if (edgeId && targetNode) {
            removeEdge(edgeId);
            removeNodeById(targetNode.id);
          } else {
            handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|list`;
            const { edgeId, targetNode } =
              getConnectedTargetNodeAndEdgeIdByHandle(currentNode.id, handleId);
            if (edgeId && targetNode) {
              removeEdge(edgeId);
              removeNodeById(targetNode.id);
            }
          }
        }
      }
      const selectedModel = getModelById(newValue);
      console.log("TBD");
      if (selectedModel) {
        updateAttributeValueOfAModel(
          modelId,
          attributeId,
          "dataSourceId",
          newValue
        );
        updateAttributeValueOfAModel(
          modelId,
          attributeId,
          "dataSourceFriendlyName",
          selectedModel.modelName
        );
        const updatedList = updatePropertyValue(
          localCurrentListValues,
          "1",
          newValue
        );
        setLocalCurrentListValues(updatedList);
        handleUpdateValuesList(id, updatedList);
      }
    };

    const handleUpdateCodeProp = (propid: any, newValue: string) => {
      console.log("model value", newValue);
      if (currentNode) {
        //construct the handle id
        let handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|model`;
        if (handleId) {
          const { edgeId, targetNode } =
            getConnectedTargetNodeAndEdgeIdByHandle(currentNode.id, handleId);
          if (edgeId && targetNode) {
            removeEdge(edgeId);
            removeNodeById(targetNode.id);
          } else {
            handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|list`;
            const { edgeId, targetNode } =
              getConnectedTargetNodeAndEdgeIdByHandle(currentNode.id, handleId);
            if (edgeId && targetNode) {
              removeEdge(edgeId);
              removeNodeById(targetNode.id);
            }
          }
        }
      }
      const selectedModel = getCodeById(newValue);
      console.log("TBD");
      if (selectedModel) {
        updateAttributeValueOfAModel(
          modelId,
          attributeId,
          "dataSourceId",
          newValue
        );
        updateAttributeValueOfAModel(
          modelId,
          attributeId,
          "dataSourceFriendlyName",
          selectedModel.name
        );
        const updatedList = updatePropertyValue(
          localCurrentListValues,
          "1",
          newValue
        );
        setLocalCurrentListValues(updatedList);
        handleUpdateValuesList(id, updatedList);
      }
    };

    return (
      <div>
        {localCurrentListValues.map((item) => (
          <RecursiveDropdownItem
            key={item.id}
            item={item}
            storeDataTypes={storeDataTypes}
            updateItem={updateItem}
            handleUpdateProp={handleUpdatePropValueLocal}
            handleUpdateModelProp={handleUpdateModelProp}
            handleUpdateCodeProp={handleUpdateCodeProp}
            updateDataSourceDetails={updateDataSourceDetails}
          />
        ))}
      </div>
    );
  }
);

const RecursiveDropdownItem: React.FC<RecursiveDropdownProps> = React.memo(
  ({
    item,
    storeDataTypes,
    updateItem,
    handleUpdateProp,
    handleUpdateModelProp,
    handleUpdateCodeProp,
    updateDataSourceDetails,
  }) => {
    const { getDataTypeByCode } = useDataTypesStore((state) => ({
      getDataTypeByCode: state.getDataTypeByCode,
    }));

    const handleChange = (event: SelectChangeEvent<string>) => {
      event.preventDefault();
      const itemSelected = getDataTypeByCode(event.target.value);

      if (itemSelected && !itemSelected.isRecursive) {
        const updatedItem: ListItem = {
          ...item,
          name: itemSelected.name,
          typeId: itemSelected.id,
          typeCode: itemSelected.code,
          properties: itemSelected.properties,
          children: [],
        };

        updateItem(updatedItem);
        updateDataSourceDetails(event.target.value);
      } else if (itemSelected && itemSelected.isRecursive) {
        const updatedItem: ListItem = {
          ...item,
          typeId: itemSelected.id,
          typeCode: itemSelected.code,
          properties: [],
          children: [
            {
              id: uuidv4(),
              typeId: "",
              typeCode: "",
              name: "",
              children: [],
              properties: [],
            },
          ],
        };

        updateItem(updatedItem);
      }
    };

    const renderDropdown = (item: ListItem) => {
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>{item.typeCode}</InputLabel>
          <Select
            size="small"
            value={item.typeCode}
            label={item.typeCode}
            onChange={handleChange}
            renderValue={(selected) => `Selected: ${selected}`}
            sx={{
              "& .MuiSvgIcon-root": {
                color: "red",
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {storeDataTypes.map((type) => (
              <MenuItem key={type.id} value={type.code}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    };

    const handleModelConnection = (newValue: any) => {
      //case where node is expanded and user trying to connect to another model
      console.log("TBD2", newValue);
      handleUpdateModelProp(newValue);
    };
    const handleUpdatePropValueToStore = (propId: any, newValue: any) => {
      console.log("TBD1", newValue, propId);
      handleUpdateProp(propId, newValue);
    };

    const handleCodeListConnection = (propId: any, newValue: any) => {
      //case where node is expanded and user trying to connect to another model
      console.log("TBD244", newValue);
      handleUpdateCodeProp(propId, newValue);
    };

    const renderFields = (properties: any[]) =>
      properties.map((prop: any) => {
        switch (prop.type) {
          case "text":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallTextField
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "number":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallNumberField
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "dropdown":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallDropdown
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "switch":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallSwitch
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "checkbox":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallCheckbox
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "radioGroup":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallRadioGroup
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "rating":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallRating
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "slider":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallSlider
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "toggleButton":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallToggleButton
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleUpdatePropValueToStore(propId, newValue)
                  }
                />
              </Grid>
            );
          case "modeldropdown":
            return (
              <Grid item key={prop.id} mt={2}>
                <SmallModelDropdown
                  {...prop}
                  getModelPropsFromAPI={(newValue: any) =>
                    handleModelConnection(newValue)
                  }
                />
              </Grid>
            );
          case "codeListDropdown":
            return (
              <Grid item key={prop.id}>
                <CodeListDropdown
                  {...prop}
                  updatePropertyValueToModel={(propId: any, newValue: any) =>
                    handleCodeListConnection(propId, newValue)
                  }
                />
              </Grid>
            );
        }
      });

    return (
      <Box>
        <>
          {renderDropdown(item)}
          {item.children &&
            item.children.map((child, index) => (
              <RecursiveDropdownItem
                key={index}
                item={child}
                storeDataTypes={storeDataTypes}
                updateItem={updateItem}
                handleUpdateProp={handleUpdateProp}
                handleUpdateModelProp={handleUpdateModelProp}
                handleUpdateCodeProp={handleUpdateCodeProp}
                updateDataSourceDetails={updateDataSourceDetails}
              />
            ))}
          {renderFields(item.properties || [])}
        </>
      </Box>
    );
  }
);

export default RecursiveDropdownv3;
