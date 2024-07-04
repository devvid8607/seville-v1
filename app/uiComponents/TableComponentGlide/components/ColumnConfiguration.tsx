import { useEffect } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { SortableList } from "../../SortableList";
import { ColumnConfigurationType } from "../types";
import { SearchTextField } from "../../Input/InputField";

interface ManageColumnsComponentProps {
  open: boolean;
  onClose: () => void;
  columnsData: ColumnConfigurationType[];
  onManageColumnsDataChange: (column: ColumnConfigurationType[]) => void;
}

const ManageColumnsComponent: React.FC<ManageColumnsComponentProps> = ({
  open,
  onClose,
  columnsData,
  onManageColumnsDataChange,
}) => {
  const theme = useTheme();
  const [searchAvailableItems, setSearchAvailableItems] =
    useState<ColumnConfigurationType[]>(columnsData);
  const [visibleItems, setVisibleItems] = useState<ColumnConfigurationType[]>(
    columnsData.filter((item) => item.isVisible)
  );
  const [searchText, setSearchText] = useState("");
  const [alertControl, setAlertControl] = useState(false);

  useEffect(() => {
    setSearchAvailableItems(columnsData);
    setVisibleItems(columnsData.filter((item) => item.isVisible));
  }, [columnsData]);

  // useEffect(() => {
  //   setSearchAvailableItems(
  //     columnsData.filter((item) =>
  //       item.title.toLowerCase().includes(searchText.toLowerCase())
  //     )
  //   );
  // }, [searchText]);

  const handleClose = () => {
    setSearchAvailableItems(columnsData);
    setVisibleItems(columnsData.filter((item) => item.isVisible));
    setAlertControl(false);
    setSearchText("");
    onClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    const filteredColumns = [...columnsData];

    setSearchText(searchText);

    // Create a dictionary to store the isVisible property of each item in searchResults
    const searchResultsVisibility = searchAvailableItems.reduce((acc, item) => {
      acc[item.id] = item.isVisible ?? true;
      return acc;
    }, {} as Record<string, boolean>);

    const updatedColumns = filteredColumns.map((item) => ({
      ...item,
      isVisible: searchResultsVisibility[item.id] ?? item.isVisible, // Keep original visibility if not in searchResults
    }));

    setSearchAvailableItems(
      updatedColumns.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const handleCheckboxChange = (itemId: UniqueIdentifier) => {
    // console.log({ itemId });

    // Find the corresponding item in the searchAvailableItems array
    const visibleItemsCount = visibleItems.filter(
      (item) => item.isVisible
    ).length;

    // If there are exactly 3 visible items and the user is trying to uncheck an item,
    // show an alert and prevent unchecking.
    if (
      visibleItemsCount === 3 &&
      searchAvailableItems.find((item) => item.id === itemId)?.isVisible
    ) {
      setAlertControl(true);
      return;
    }

    const updatedSearchAvailableItems = searchAvailableItems.map((item) =>
      item.id === itemId
        ? // ? { ...item, index: -1, isVisible: !item.isVisible }
          { ...item, isVisible: !item.isVisible }
        : item
    );
    setSearchAvailableItems(updatedSearchAvailableItems);

    // Check if the item is currently in the visibleItems list
    const isInVisibleItems = visibleItems.some((item) => item.id === itemId);

    if (isInVisibleItems) {
      // Find the corresponding item in the visibleItems array
      //   const updatedVisibleItems = visibleItems.filter(
      //     (item) => item.id !== itemId
      //   );
      const updatedVisibleItems = visibleItems.map((item) =>
        item.id === itemId ? { ...item, isVisible: !item.isVisible } : item
      );
      setVisibleItems(updatedVisibleItems);
    } else {
      // If the item is not in the visibleItems list, add it with isVisible set to true
      const itemToAdd = columnsData.find((item) => item.id === itemId);
      if (itemToAdd) {
        itemToAdd.index = visibleItems.length + 1;
        setVisibleItems((prevItems) => [
          ...prevItems,
          { ...itemToAdd, isVisible: true },
        ]);
      }
    }
  };

  const handleSortChange = (updatedItems: ColumnConfigurationType[]) => {
    const visibleItems = updatedItems.filter((item) => item.isVisible);
    const itemsWithUpdatedPosition = visibleItems.map((item, index) => ({
      ...item,
      index: index,
    }));

    const nonVisibleItems = searchAvailableItems.filter(
      (item) => !item.isVisible
    );
    const itemsWithNaPosition = nonVisibleItems.map((item) => ({
      ...item,
      index: -1,
    })) as ColumnConfigurationType[]; // Type assertion here

    const finalUpdatedItems = itemsWithUpdatedPosition.concat(nonVisibleItems);

    setVisibleItems(finalUpdatedItems);
    setSearchAvailableItems(finalUpdatedItems);
  };

  const handleItemDelete = (id: UniqueIdentifier) => {
    // Create a new array with updated visibility by setting isVisible to false for the item with the specified id
    //  console.log("log line here");

    const updatedVisibleItems = visibleItems.map((item) =>
      item.id === id ? { ...item, isVisible: false } : item
    );

    // After deleting the item, reposition the visible items
    const sortedVisibleItems = updatedVisibleItems
      .filter((item) => item.isVisible)
      .map((item, index) => ({ ...item, index: index }));

    // Check if there are exactly 3 visible items after deletion
    const visibleItemsCount = sortedVisibleItems.filter(
      (item) => item.isVisible
    ).length;
    if (visibleItemsCount === 2) {
      setAlertControl(true);
      return;
    }

    // Update the state with the sortedVisibleItems array
    setVisibleItems(sortedVisibleItems);

    setSearchAvailableItems((prevItems) => {
      // Find the item to be deleted
      const itemToDelete = prevItems.find((item) => item.id === id);

      if (itemToDelete) {
        // Set the isVisible property of the item to false before deleting
        itemToDelete.isVisible = false;
        // itemToDelete.index = -1;
      }

      // Return the updated list without the deleted item
      return prevItems;
    });
  };

  const handleSaveClick = () => {
    onManageColumnsDataChange(searchAvailableItems);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      // sx={{ maxHeight: "700px" }}
    >
      <DialogTitle sx={{ p: 2 }}>
        <Typography variant="h6">Manage Columns</Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 2, pb: 0 }} className="custom-scrollbar">
        {alertControl && (
          <Alert
            severity="warning"
            variant="standard"
            onClose={() => {
              setAlertControl(false);
            }}
          >
            At least 3 items should be selected.
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          {/* Left Side */}
          <Box
            id="left"
            flex="1"
            sx={{
              height: "100%",
              overflowY: "auto",
              minWidth: "100px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 0,
            }}
          >
            <Typography variant="h6">Column Options</Typography>

            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 1,
              }}
            >
              <SearchTextField
                value={searchText}
                handleChange={handleSearchChange}
                sx={{
                  ".MuiInputBase-root ": { background: "white" },
                  ".MuiInputBase-input ": { p: 1 },
                  "& .MuiSvgIcon-root": {
                    color: "black",
                    width: theme.spacing(3),
                    height: theme.spacing(3),
                  },
                  width: "90%",
                }}
              />
              <Box
                className="custom-scrollbar"
                sx={{ height: "400px", overflowY: "auto" }}
              >
                <List
                  sx={{
                    p: 0,
                  }}
                >
                  {searchAvailableItems.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <Checkbox
                        sx={{
                          p: 1,
                        }}
                        color="info"
                        checked={item.isVisible}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <ListItemText primary={item.title} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>

          {/* Right Side */}
          <Box
            id="right"
            flex="1.5"
            sx={{
              height: "100%",
              overflowY: "auto",
              minWidth: "200px",
              p: 0,
            }}
          >
            <Box>
              <Typography variant="h6">Selected Columns</Typography>
              <Typography variant="body2">
                Drag and Drop columns to arrange
              </Typography>
            </Box>

            {/* <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            > */}
            <Box
              className="custom-scrollbar"
              sx={{
                height: "485px",
                overflowY: "auto",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 1,
                mt: 2,
                p: 2,
              }}
            >
              <SortableList
                items={searchAvailableItems
                  .filter((item) => item.isVisible)
                  .sort((a, b) => a.index - b.index)}
                onChange={handleSortChange}
                renderItem={(item) => (
                  <SortableList.Item
                    id={item.id}
                    onDelete={handleItemDelete}

                    // isDisabled={isDeleteButtonDisabled}
                  >
                    <SortableList.DragHandle />
                    <Typography sx={{ fontSize: "12px" }}>
                      {item.title}
                    </Typography>
                  </SortableList.Item>
                )}
              />
            </Box>

            {/* </Grid> */}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ color: "white", textTransform: "none" }}
          onClick={handleSaveClick}
          size="small"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageColumnsComponent;
