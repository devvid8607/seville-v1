import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { Box, IconButton, Slide, Tab, Tabs, Typography } from "@mui/material";

import React from "react";
import useFlowModelBackendStore from "../../store/modelStore/ModelBackEndStore";
import { ModelPropertiesTab } from "../sidebarTabComponents/propertiesTab/ModelPropertiesTab";
import { ModelDataTab } from "../sidebarTabComponents/DataTab/ModelDataTab";
import { useTabStore } from "../../store/TabStateManagmentStore";
import { TabOption, TabPanelProps } from "./Types/SideBarTypes";
import { CanvasLevelPropertiesTab } from "../sidebarTabComponents/CanvasLevelPropertiesTab";

export const CanvasFixedRightSideBar: React.FC = () => {
  const {
    activeTabIndex,
    setActiveTabIndex,
    sliderOpen,
    setSliderOpen,
    showNodeContextMenu,
  } = useTabStore((state) => ({
    setActiveTabIndex: state.setActiveTabIndex,
    setSliderOpen: state.setSliderOpen,
    activeTabIndex: state.activeTabIndex,
    sliderOpen: state.sliderOpen,
    showNodeContextMenu: state.showNodeContextMenu,
  }));

  const { modelNodeSchemas } = useFlowModelBackendStore();

  let sidebarTabOptions;

  sidebarTabOptions = modelNodeSchemas.config.sidebarTabOptions;

  const tabComponentsLookup: Record<TabOption, () => JSX.Element> = {
    properties: ModelPropertiesTab,
    data: ModelDataTab,
    home: CanvasLevelPropertiesTab,
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleDrawerOpen = () => {
    setSliderOpen(true);
  };

  const handleDrawerClose = () => {
    setSliderOpen(false);
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2, pr: 0, width: "18rem" }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 120,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.paper",
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <Slide
        direction="left"
        in={sliderOpen && !showNodeContextMenu}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            width: "100%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            maxHeight: "60vh",
            overflow: "auto",
          }}
        >
          <Tabs
            value={activeTabIndex}
            onChange={handleChange}
            orientation="horizontal"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {sidebarTabOptions.map((option: string, index: number) => (
              <Tab key={index} label={option} />
            ))}
          </Tabs>
          {sidebarTabOptions.map((option: string, index: number) => {
            const Component = tabComponentsLookup[option as TabOption];
            return (
              <TabPanel key={index} value={activeTabIndex} index={index}>
                {Component ? (
                  <Component />
                ) : (
                  <div>Component not found for {option}</div>
                )}
              </TabPanel>
            );
          })}
        </Box>
      </Slide>
      <IconButton onClick={sliderOpen ? handleDrawerClose : handleDrawerOpen}>
        {sliderOpen ? (
          <ChevronRightOutlined sx={{ color: "red" }} />
        ) : (
          <ChevronLeftOutlined sx={{ color: "red" }} />
        )}
      </IconButton>
    </Box>
  );
};
