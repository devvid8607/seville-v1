import {
  CategoryOutlined,
  DataObjectOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  OutputOutlined,
  RedoOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingsInputHdmiOutlined,
  UndoOutlined,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import { Box, IconButton, Tooltip } from "@mui/material";
// import { NODE_TYPES, useFlowNodeStore } from "../FlowStore/FlowNodeStore";

import { memo } from "react";
// import { useLocation } from "react-router-dom";

// import useFlowBackendStore from "../FlowStore/FlowBackEndStore";
// import { useNodeStructureStore } from "../FlowStore/FlowNodeStructureStore";
// import { useCreateSavedInitialUserNodesFromJSON } from "./Helpers/Canvas/createSaveInitialUserNodesFromJSON";
// import { saveCanvasNodes, saveEdges } from "./Helpers/Canvas/saveCanvas";

import { useHelpStore } from "../../components/helpDrawer/store/HelpDrawerStore";
// import { useMapStore } from "./Node/FlowMappingModelNode/Store/NewMappingModelStore";

import { useTabStore } from "../../store/TabStateManagmentStore";
// import useRulesStore from "./Node/RuleNode/Store/RuleStore";

interface ToolbarNodeProps {
  onSave: () => void;
  onReset: () => void;
  showHideInputOption: boolean;
  showHideOutputOption: boolean;
  showHideContextDataOption: boolean;
  showHideItemsOption: boolean;
}

const SevilleToolbarNode: React.FC<ToolbarNodeProps> = memo(
  ({
    onSave,
    showHideInputOption,
    showHideOutputOption,
    showHideContextDataOption,
    showHideItemsOption,
    onReset,
  }) => {
    // const {
    //   nodes,
    //   resetToInitialNodes,
    //   toggleNodeVisibility,
    //   getNodeByType,
    //   addNode,
    // } = useFlowNodeStore();
    // const { initialSchemaItems, savedModelNodes } =
    //   useFlowBackendStore.getState();

    // const { resetNodeStructures } = useNodeStructureStore();
    // const { header } = useFlowBackendStore();

    // const { maps } = useMapStore();

    // const location = useLocation();

    const { setIsHelpDrawerOpen, isHelpDrawerOpen } = useHelpStore((state) => ({
      setIsHelpDrawerOpen: state.setIsHelpDrawerOpen,
      isHelpDrawerOpen: state.isHelpDrawerOpen,
    }));

    const { setShowMiniMap, showMiniMap } = useTabStore((state) => ({
      setShowMiniMap: state.setShowMiniMap,
      showMiniMap: state.showMiniMap,
    }));

    // const {
    //   rules,
    //   getActiveRule,
    //   setEdgesDataForRule,
    //   setNodesDataForRule,
    //   setIsUpdated,
    // } = useRulesStore((state) => ({
    //   rules: state.rules,
    //   addOrUpdateRule: state.addOrUpdateRule,
    //   getActiveRule: state.getActiveRule,
    //   setIsDeleted: state.setIsDeleted,
    //   setEdgesDataForRule: state.setEdgesDataForRule,

    //   setNodesDataForRule: state.setNodesDataForRule,

    //   getRuleById: state.getRuleById,
    //   setActiveRule: state.setActiveRule,
    //   setIsUpdated: state.setIsUpdated,
    // }));

    const handleCanvasReset = () => {
      onReset();
      //if (location.pathname === "/test/Index/ModelCreator") {
      // const loadSchema = async () => {
      //   // await fetchModels();
      //   await fetchInitialSchema();
      // };
      // clearAllEdgedDataInStore();
      // clearAllNodesDataInStore();
      // // clearModels();
      // loadSchema();
      // console.log("savedmodelitems", savedModelItems);
      // useCreateSavedModelNodesFromJSON(savedModelItems);
      // } else {
      //   resetToInitialNodes();
      //   resetNodeStructures();
      //   initialSchemaItems.forEach((systemNode) => {
      //     addNode(systemNode);
      //   });
      //   useCreateSavedInitialUserNodesFromJSON(savedModelNodes);
      // }
    };

    // const clearNodesAndEdgesOfRule = (ruleId: string) => {
    //   //remove nodes from node store
    //   //remove edges from node store
    //   //clear node structure store
    //   const ruleToClear = getRuleById(ruleId);
    //   if (ruleToClear && ruleToClear.isActiveRule) {
    //     ruleToClear.nodesData.forEach((node) => removeNode(node.id));
    //     ruleToClear.edgesData.forEach((edge) => removeEdge(edge.id));
    //     resetNodeStructures();
    //   }
    // };

    const handleSave = () => {
      onSave();
      // if (location.pathname === "/test/Index/ModelCreator") {
      // const savedNodes = saveModelCanvasNodes();
      // const savedEdges = saveModelEdges();
      // console.log("Combined Nodes Data Model:", savedNodes);
      // console.log("Combined Edges Data Model:", savedEdges);
      // console.log(
      //   "models data:",
      //   models.filter((model) => model.isUpdated)
      // );
      // } else {
      //   const savedNodes = saveCanvasNodes();
      //   const savedEdges = saveEdges();
      //   console.log("Combined Nodes Data:", savedNodes);
      //   console.log("Combined Edges Data:", savedEdges);
      //   const prevRule = getActiveRule();

      //   if (prevRule) {
      //     setNodesDataForRule(prevRule.id, savedNodes.nodes);
      //     setEdgesDataForRule(prevRule.id, savedEdges);
      //     // clearNodesAndEdgesOfRule(prevRule.id);
      //     setIsUpdated(prevRule.id, true);

      //     //call api tp save this rule
      //   }

      //   console.log("Rules Data:", rules);
      //   console.log("header data", header);
      //   console.log("map data", maps);
      // }
    };

    const showHideNode = (nodeType: string) => {
      console.log("node type", nodeType);

      // const node = getNodeByType(nodeType);
      // if (node) toggleNodeVisibility(node?.id, { x, y, zoom });
    };

    // const showHideOutputNode = () => {
    //   if (location.pathname === "/test/LogicCreator")
    //     showHideNode(NODE_TYPES.LOGICOUTPUTNODE);
    //   else if (location.pathname === "/test/ValidationSet")
    //     showHideNode(NODE_TYPES.VALIDATIONOUTPUTNODE);
    // };

    return (
      <Box
        display="flex"
        flexDirection="row"
        bgcolor="#FAF9F6"
        borderRadius="4px"
      >
        <Tooltip title="Search">
          <span>
            <IconButton size="small" sx={{ color: "black" }} disabled>
              <SearchOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Filter">
          <span>
            <IconButton size="small" sx={{ color: "black" }} disabled>
              <FilterListIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Help">
          <IconButton
            size="small"
            sx={{ color: "black" }}
            onClick={() => setIsHelpDrawerOpen(!isHelpDrawerOpen)}
          >
            <HelpOutlineOutlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Undo">
          <span>
            <IconButton
              //  disabled={canUndo}
              size="small"
              sx={{ color: "black" }}
              //  onClick={undo}
              disabled
            >
              <UndoOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Redo">
          <span>
            <IconButton
              //   disabled={canRedo}
              size="small"
              sx={{ color: "black" }}
              //   onClick={redo}
              disabled
            >
              <RedoOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Reset Canvas">
          <IconButton size="small" color="error" onClick={handleCanvasReset}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Save">
          <IconButton size="small" sx={{ color: "black" }} onClick={handleSave}>
            <SaveOutlined />
          </IconButton>
        </Tooltip>

        {showHideInputOption && (
          <Tooltip title="Show/Hide Input Node">
            <IconButton
              size="small"
              sx={{ color: "black" }}
              // onClick={() => showHideNode(NODE_TYPES.INPUTNODE)}
            >
              <SettingsInputHdmiOutlined />
            </IconButton>
          </Tooltip>
        )}

        {showHideOutputOption && (
          <Tooltip title="Show/Hide Output Node">
            <IconButton
              size="small"
              sx={{ color: "black" }}
              // onClick={showHideOutputNode}
            >
              <OutputOutlined />
            </IconButton>
          </Tooltip>
        )}

        {showHideContextDataOption && (
          <Tooltip title="Show/Hide Context Node">
            <IconButton
              size="small"
              sx={{ color: "black" }}
              // onClick={() => showHideNode(NODE_TYPES.CONTEXTDATANODE)}
            >
              <DataObjectOutlined />
            </IconButton>
          </Tooltip>
        )}

        {showHideItemsOption && (
          <Tooltip title="Show/Hide Items Node">
            <IconButton
              size="small"
              sx={{ color: "black" }}
              // onClick={() => showHideNode(NODE_TYPES.FLOWNODESELECTORNODE)}
            >
              <CategoryOutlined />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Show/Hide Mini Map">
          <IconButton
            size="small"
            sx={{ color: "black" }}
            onClick={() => setShowMiniMap(!showMiniMap)}
          >
            <MapOutlined />
          </IconButton>
        </Tooltip>

        {/* {nodeSelectorNode?.type !== "stickyPanel" && (
        <Tooltip
          title={
            nodeSelectorNode?.hidden
              ? "Show Node Selector"
              : "Hide Node Selector"
          }
        >
          <IconButton
            size="small"
            sx={{ color: "black" }}
            onClick={handleToggleNodeVisibility} //() => toggleNodeVisibility("nodeSelector")}
          >
            {nodeSelectorNode?.hidden ? (
              <VisibilityOffOutlined />
            ) : (
              <VisibilityOutlined />
            )}
          </IconButton>
        </Tooltip>
      )}

      {sevilleToolbarNode?.type === "stickyPanel" ? (
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

      {sevilleToolbarNode?.type !== "stickyPanel" ? (
        <span className="custom-drag-handle">
          <Tooltip title="Drag Toolbar">
            <DragHandleOutlined sx={{ mt: 1 }} />
          </Tooltip>
        </span>
      ) : (
        <span></span>
      )} */}

        {/* <Tooltip title="Drag Toolbar">
        <IconButton size="small" sx={{ color: "black" }}>
          <DragHandleOutlined className="custom-drag-handle" />
        </IconButton>
      </Tooltip> */}
      </Box>
    );
  }
);

export default SevilleToolbarNode;
