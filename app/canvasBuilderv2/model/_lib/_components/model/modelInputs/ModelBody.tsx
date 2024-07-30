import {
  Autocomplete,
  Box,
  CircularProgress,
  List,
  Paper,
  Popper,
  PopperProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import {
  createAttributeData,
  createModelAttributeData,
} from "../../../_helpers/createModelData";
import useModelStore, {
  Model,
} from "../../../_store/modelStore/ModelDetailsFromBackendStore";
import useRecentlyTypedItemsInModel from "../../../../../../canvas/[slug]/_lib/_store/RecentlyTypedItemsInModel";
import { AddNewModelType } from "../../../_types/AddNewModelType";
import { ModelField } from "./ModelField";
import { useCodeListStore } from "@/app/canvas/[slug]/_lib/_nodes/codeListNode/store/CodeListStore";

import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";

interface ModelBodyProps {
  dataSourceId: string;
  url: string;
  model: Model | null;
  loading: boolean;
  nodeId: string;
}

export const ModelBody: React.FC<ModelBodyProps> = ({
  dataSourceId,
  url,
  model,
  loading,
  nodeId,
}) => {
  // #region store imports
  const { recentFields, addRecentField } = useRecentlyTypedItemsInModel();
  const addAttributeToModel = useModelStore(
    (state) => state.addAttributeToModel
  );
  const fields = useModelStore((state) =>
    state.getModelAttributes(model?.modelId || "")
  );
  const models = useModelStore((state) => state.models);
  const storeDataTypes = useDataTypesStore((state) => state.dataTypes);
  const codeLists = useCodeListStore((state) => state.codeLists);
  // #endregion

  // #region state variables
  const suggestions = useMemo(() => {
    const modelSuggestions = models.map((model) => ({
      label: model.modelFriendlyName ? model.modelFriendlyName : "",
      id: model.modelId,
      name: model.modelName,
      category: "Model",
      dataType: "model",
    }));

    const codeListSuggestions = codeLists.map((model) => ({
      label: model.name ? model.name : "",
      id: model.id,
      name: model.name,
      category: "Code List",
      dataType: "codeList",
    }));

    return [...recentFields, ...modelSuggestions, ...codeListSuggestions];
  }, [recentFields, models, codeLists]);

  const CustomPopper = (props: PopperProps) => {
    return <Popper {...props} placement="bottom-start" />;
  };
  const [inputValue, setInputValue] = useState("");
  // #endregion

  //#region event handlers
  const handleAddField = (fieldName: string) => {
    const newField = createAttributeData(fieldName);
    if (model) addAttributeToModel(model.modelId, newField);
    addRecentField({ label: fieldName, category: "Recent", dataType: "text" });
    setInputValue("");
  };

  const handleAddModel = (newModelValue: AddNewModelType) => {
    const selectedTypeData = storeDataTypes.find(
      (type) => type.code === newModelValue.dataType
    );

    const properties = selectedTypeData?.properties || [];
    if (properties.length > 0) properties[0].currentValue = newModelValue.id;
    const newField = createModelAttributeData(newModelValue, properties);
    if (model) addAttributeToModel(model.modelId, newField);
    addRecentField({
      label: newModelValue.label,
      category: "Recent",
      dataType: newModelValue.dataType,
      id: newModelValue.id,
      name: newModelValue.name,
    });
    setInputValue("");
  };
  //#endregion

  return (
    model && (
      <Box>
        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            m={2}
            p={2}
            height="100%"
          >
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading model...
            </Typography>
          </Box>
        ) : (
          <>
            {model.attributes.length > 0 ? (
              <List sx={{ m: 2 }}>
                {fields.map((field) => (
                  <ModelField
                    key={field.id}
                    field={field}
                    modelId={model.modelId}
                    nodeId={nodeId}
                  />
                ))}
              </List>
            ) : (
              <div>No fields found for this model.</div>
            )}
            <Autocomplete
              freeSolo
              selectOnFocus
              clearOnBlur
              PopperComponent={CustomPopper}
              PaperComponent={({ children }) => (
                <Paper
                  style={{ maxHeight: 400, maxWidth: 500, overflow: "auto" }}
                >
                  {children}
                </Paper>
              )}
              options={suggestions}
              groupBy={(option) => option.category}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") setInputValue(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === "object" && newValue !== null) {
                  if (newValue.dataType === "model") {
                    handleAddModel(newValue as AddNewModelType);
                  } else if (newValue.dataType === "codeList") {
                    handleAddModel(newValue as AddNewModelType);
                  } else if (newValue.dataType === "text") {
                    handleAddField(newValue.label);
                  }
                } else if (typeof newValue === "string") {
                  handleAddField(newValue);
                }
              }}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.label
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type and press enter to add a field.."
                  margin="normal"
                  variant="standard"
                />
              )}
              componentsProps={{
                clearIndicator: {
                  style: {
                    color: "red",
                  },
                },
              }}
              sx={{ m: 3 }}
            />
          </>
        )}
      </Box>
    )
  );
};
