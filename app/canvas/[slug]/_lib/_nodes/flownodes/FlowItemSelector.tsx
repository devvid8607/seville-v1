import {
  CategoryOutlined,
  DragHandleOutlined,
  ExpandMore,
  LocationOffOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import useFlowBackendStore from "../../../flowComponents/_lib/_store/FlowBackEndStore";
import { FlowRepresentativeNodeWrapper } from "./FlowRepresentativeNodeWrapper";
import { useFlowNodeStore } from "../../../flowComponents/_lib/_store/FlowNodeStore";
import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";

const labelStyle = {
  display: "flex",
  alignItems: "center",
};

export const FlowItemSelector = () => {
  const { categories, schemas } = useFlowBackendStore();

  const { nodes } = useFlowNodeStore();

  const toggleNodeType = useFlowNodeStore((state) => state.toggleNodeType);

  const nodeSelectorNode = nodes.find((node) => node.id === "flowNodeSelector");

  if (!nodeSelectorNode) {
    return null;
  }

  const handleToggleNodeType = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    toggleNodeType(nodeSelectorNode.id);
  };

  const { setActiveTabIndex, setIsSystemNodeHeaderPropertyShowing } =
    useTabStore((state) => ({
      setActiveTabIndex: state.setActiveTabIndex,
      setSliderOpen: state.setSliderOpen,
      sliderOpen: state.sliderOpen,
      setIsSystemNodeHeaderPropertyShowing:
        state.setIsSystemNodeHeaderPropertyShowing,
    }));

  const handleHeaderSingleClick = () => {
    setIsSystemNodeHeaderPropertyShowing(true);
    setActiveTabIndex(1);
    // if (!sliderOpen) setSliderOpen(true);
  };

  return (
    <>
      <Box width="80%" sx={{ border: "2px solid #ccc" }}>
        <Box
          display="flex"
          justifyContent="space-evenly"
          sx={{
            backgroundColor: "#ccc",
            padding: "8px",
          }}
          onClick={handleHeaderSingleClick}
        >
          <CategoryOutlined sx={{ marginTop: 3 }} />
          <h2>Items</h2>

          <div style={labelStyle}>
            {nodeSelectorNode?.type !== "stickyPanel" ? (
              <Tooltip title="Drag Toolbar">
                <span className="custom-drag-handle">
                  <DragHandleOutlined />
                </span>
              </Tooltip>
            ) : (
              <span></span>
            )}
          </div>
          <div style={labelStyle}>
            {nodeSelectorNode?.type === "stickyPanel" ? (
              <Tooltip title="Unpin From Canvas">
                <IconButton onClick={handleToggleNodeType}>
                  <LocationOffOutlined sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Pin To Canvas">
                <IconButton onClick={handleToggleNodeType}>
                  <LocationOnOutlined sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Box>

        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          sx={{ ml: 2, mr: 2, p: 0, width: "80%" }}
        />
        <Box
          mt={2}
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {categories.map((category) => (
            <Accordion key={category.id}>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: "red" }} />}
              >
                {/* Use category.name instead of category */}
                <Typography>{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {schemas
                    // Compare category.id instead of categoryID
                    .filter((schema) => schema.categoryId === category.id)
                    .map((schemaItem) => (
                      <FlowRepresentativeNodeWrapper
                        key={schemaItem.schemaId}
                        node={schemaItem}
                      />
                    ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </>
  );
};
