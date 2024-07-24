import { DataObjectOutlined, DragHandleOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { useTabStore } from "../../NewModelCreatorNode/Store/TabStateManagmentStore";

export const ContextDataNodeHeader = () => {
  const {
    setActiveTabIndex,

    setIsSystemNodeHeaderPropertyShowing,
  } = useTabStore((state) => ({
    setActiveTabIndex: state.setActiveTabIndex,

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
      <Box onClick={handleHeaderSingleClick}>
        <Box
          sx={{
            backgroundColor: "#F0F3FF",
            borderBottom: "1px solid #aaa",
            height: "auto",
            pt: 2,
            pb: 2,
            gap: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              paddingLeft: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 4,
                height: 4,
                mr: 2,
                ml: 1,
              }}
            >
              <DataObjectOutlined />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                m: 0,
                whiteSpace: "nowrap",
              }}
            >
              Data Node
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <span className="custom-drag-handle">
                <Tooltip title="Drag Node">
                  <DragHandleOutlined />
                </Tooltip>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
