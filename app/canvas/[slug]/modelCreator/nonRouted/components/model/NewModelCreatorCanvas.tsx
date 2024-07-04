import { Box, Typography } from "@mui/material";
import React, { DragEvent, memo, useCallback, useEffect } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  XYPosition,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { DeleteForeverOutlined } from "@mui/icons-material";
import { EditableContent } from "../common/EditableContent";
import SevilleToolbarNode from "../nodes/FlowComponents/FlowToolbar";
import { createSavedModelEdgesFromJSON } from "../../helpers/createSavedModelEdgesFromJSON";
import { createSavedModelNodesfromJSON } from "../../helpers/createSavedModelNodesfromJSON";
import { HelpDrawer } from "../common/HelpDrawer/HelpDrawer";
// import { MappingDrawer } from "../FlowMappingDrawer/MappingDrawer";
import { CanvasFixedRightSideBar } from "../CanvasFixedRightSideBar/CanvasFixedRightSideBar";
import CustomEdge from "../Edges/ButtonEdge";
import { useCreateSavedModelNodesFromJSON } from "../../helpers/createSavedModelNodesFromJSONNodeFormat";
import { AddModelCodeContextMenu } from "./modelInputs/AddModelCodeContextMenu";
import useModelBackendStore from "../../store/modelStore/ModelBackEndStore";
import useModelStore from "../../store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../store/modelStore/ModelNodesStore";
import { useTabStore } from "../../store/TabStateManagmentStore";
import CustomBreadcrumbs from "@/app/nonRouted/components/Breadcrumbs";
import NextBreadcrumb from "@/app/nonRouted/components/Breadcrumbs";

interface ReactFlowBoxProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  onInit: (instance: any) => void;
  nodeTypes: NodeTypes;
  rfInstance: ReactFlowInstance;
}

const edgeTypes = {
  buttonedge: CustomEdge,
};

export const NewModelCreatorCanvas = memo(
  ({ wrapperRef, onInit, rfInstance, nodeTypes }: ReactFlowBoxProps) => {
    const nodes = useModelNodesStore((state) => state.nodes);
    const edges = useModelNodesStore((state) => state.edges);
    const onNodesChange = useModelNodesStore((state) => state.onNodesChange);
    const onEdgesChange = useModelNodesStore((state) => state.onEdgesChange);
    const onConnect = useModelNodesStore((state) => state.onConnect);
    const onConnectEnd = useModelNodesStore((state) => state.onConnectEnd);
    const onConnectStart = useModelNodesStore((state) => state.onConnectStart);
    const setCurrentNode = useModelNodesStore((state) => state.setCurrentNode);

    const setActiveTabIndex = useTabStore((state) => state.setActiveTabIndex);
    const setSliderOpen = useTabStore((state) => state.setSliderOpen);
    const showMiniMap = useTabStore((state) => state.showMiniMap);

    const models = useModelStore((state) => state.models);
    const { setCenter, getNode } = useReactFlow();

    const savedModelNodes = useModelBackendStore(
      (state) => state.savedModelNodes
    );

    const savedNodes = useModelBackendStore((state) => state.savedNodes);

    const savedEdges = useModelBackendStore((state) => state.savedEdges);

    const handleOnDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    };
    console.log("models", models);
    console.log("nodes", nodes);
    console.log("edges", edges);

    const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
      console.log(node.type);
    }, []);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
      setCurrentNode(node);
    };

    const defaultViewport = { x: 0, y: 0, zoom: 0.2 };

    const handleShowProperties = (event: React.MouseEvent) => {
      event.stopPropagation();
      setActiveTabIndex(0);
      setSliderOpen(true);
    };
    const { header } = useModelBackendStore();

    const handleMiniMapNodeClick = (event: React.MouseEvent, node: Node) => {
      const clickedNode = getNode(node.id);
      if (clickedNode) {
        const { position } = clickedNode;
        const width = clickedNode.width || 0;
        const height = clickedNode.height || 0;
        const centerX = position.x + width / 2;
        const centerY = position.y + height / 2;
        setCenter(centerX, centerY, { zoom: 0.6 });
      }
    };

    const handleMiniMapClick = (
      event: React.MouseEvent,
      position: XYPosition
    ) => {
      setCenter(position.x, position.y, { zoom: 0.6 });
    };

    useEffect(() => {
      console.log("in initial user use effect");
      useCreateSavedModelNodesFromJSON(savedModelNodes);
    }, [savedModelNodes]);

    useEffect(() => {
      console.log("in initial user use effect");
      createSavedModelNodesfromJSON(savedNodes);

      // if (savedEdges) createSavedEdgesFromJSON(savedEdges);
    }, [savedNodes]);

    useEffect(() => {
      createSavedModelEdgesFromJSON(savedEdges);
    }, [savedEdges]);

    // useEffect(() => {
    //   console.log("in initial user use effect");
    //   useCreateSavedNodesFromJSON(savedNodes);
    // }, [savedNodes]);

    return (
      <Box ref={wrapperRef} style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onDragOver={handleOnDragOver}
          onNodeDrag={onNodeDrag}
          defaultViewport={defaultViewport}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
        >
          <Panel position="top-left">
            <Box display="flex" flexDirection="column" gap={2} mt={2} ml={2}>
              <NextBreadcrumb
                homeElement={<Typography>Home</Typography>}
                separator={<span> / </span>}
                capitalizeLinks={true}
              />
              <EditableContent
                onShowProperties={handleShowProperties}
                header={header}
              />
            </Box>
          </Panel>

          <Panel position="top-right">
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <DeleteForeverOutlined sx={{ mr: 3, mt: 2 }} />
            </Box>
          </Panel>
          <Panel position="top-center">
            <Box mt={8}>
              <SevilleToolbarNode
                showHideInputOption={false}
                showHideItemsOption={false}
                showHideOutputOption={false}
                showHideContextDataOption={false}
                onSave={() => alert("save")}
              />
            </Box>
          </Panel>

          <Panel position="bottom-left">
            <Controls
              style={{ right: 20, bottom: 20 }}
              position="bottom-left"
            ></Controls>
          </Panel>

          <Panel position="bottom-right" style={{ bottom: 100 }}>
            <CanvasFixedRightSideBar />
            <HelpDrawer />
          </Panel>
          {showMiniMap && (
            <MiniMap
              // style={{ left: 80, bottom: 20 }}
              nodeStrokeWidth={3}
              nodeColor="pink"
              onNodeClick={handleMiniMapNodeClick}
              onClick={handleMiniMapClick}
              pannable
              zoomable
            />
          )}

          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>

        <AddModelCodeContextMenu />
        {/* <MappingDrawer />  */}
      </Box>
    );
  }
);
