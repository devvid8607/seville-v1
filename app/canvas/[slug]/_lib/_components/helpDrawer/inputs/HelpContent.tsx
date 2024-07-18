import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Typography,
  Divider,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { SearchOutlined } from "@mui/icons-material";

export const HelpContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Replace this with your actual help topics data
  const topics = [
    "General",
    "Resources",
    "Models",
    "Code List",
    "Validation Set",
    "Workflows",
    "General",
    "Resources",
    "Models",
    "Code List",
    "Validation Set",
    "Workflows",
  ];

  const filteredTopics = searchQuery
    ? topics.filter((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  // Content based on selected item
  const renderContent = (item) => {
    switch (item) {
      case "General":
        return <Typography variant="body1">Content for General...</Typography>;
      case "Resources":
        return (
          <Typography variant="body1">Content for Resources...</Typography>
        );
      // ... handle other cases
      default:
        return (
          <Typography variant="body1">
            Select a topic to view help content.
          </Typography>
        );
    }
  };

  return (
    <Box display="flex" height="100%">
      <Box width="240px">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search"
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchQuery("")}>
                <SearchOutlined />
              </IconButton>
            ),
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Divider />
        <List component="nav">
          {filteredTopics.map((topic, index) => (
            <ListItem
              button
              key={index}
              selected={selectedItem === topic}
              onClick={() => setSelectedItem(topic)}
            >
              <ListItemText primary={topic} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider sx={{ ml: 2 }} orientation="vertical" flexItem />
      <Box flexGrow={1} p={2}>
        {selectedItem ? (
          renderContent(selectedItem)
        ) : (
          <Typography variant="body1">Please select a topic.</Typography>
        )}
      </Box>
    </Box>
  );
};

// Now the HelpContent component can be used inside HelpDrawer as shown previously:
//
// <Box p={2}>
//   <HelpContent />
// </Box>
