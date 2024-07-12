// #region Imports
import { Box, CircularProgress, Typography } from "@mui/material";
import React, {
  DragEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeTypes,
  MiniMap,
  Node,
  NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowActions,
  ReactFlowInstance,
  Viewport,
  XYPosition,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { DeleteForeverOutlined } from "@mui/icons-material";
import { EditableContent } from "../../../../nonRouted/components/EditableContent";
import SevilleToolbarNode from "../../../../nonRouted/nodes/flowComponents/FlowToolbar";
import { createSavedModelEdgesFromJSON } from "../../helpers/createSavedModelEdgesFromJSON";
import {
  createSavedModelNodefromJSON,
  createSavedModelNodesfromJSON,
} from "../../helpers/createSavedModelNodesfromJSON";
import { HelpDrawer } from "../../../../nonRouted/components/helpDrawer/HelpDrawer";
import { CanvasFixedRightSideBar } from "../canvasFixedRightSideBar/CanvasFixedRightSideBar";

import { useCreateSavedModelNodesFromJSON } from "../../helpers/createSavedModelNodesFromJSONNodeFormat";
import { AddModelCodeContextMenu } from "./modelInputs/AddModelCodeContextMenu";
import useModelBackendStore from "../../store/modelStore/ModelBackEndStore";
import useModelStore from "../../store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../store/modelStore/ModelNodesStore";
import { useTabStore } from "../../../../nonRouted/store/TabStateManagmentStore";
import NextBreadcrumb from "@/app/nonRouted/components/Breadcrumbs";
import {
  saveModelCanvasNodes,
  saveModelEdges,
} from "../../helpers/saveModelCanvas";
import { ModelNode } from "./ModelNode";
// #endregion

// #region types
interface ReactFlowBoxProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  onInit: (instance: any) => void;
  nodeTypes: NodeTypes;
  rfInstance: ReactFlowInstance;
  edgeTypes: EdgeTypes;
}

type CanvasHeader = {
  canvasName: string;
};
// #endregion

export const NewModelCreatorCanvas = memo(
  ({
    wrapperRef,
    onInit,
    rfInstance,
    nodeTypes,
    edgeTypes,
  }: ReactFlowBoxProps) => {
    const [loading, setLoading] = useState(false);
    // #region ModelNodesStore Imports
    const nodes = useModelNodesStore((state) => state.nodes);
    const edges = useModelNodesStore((state) => state.edges);
    const getInitialtNodes = useModelNodesStore(
      (state) => state.getInitialtNodes
    );
    // const nodes = useModelNodesStore((state) => state.nodes);
    const getNodeById = useModelNodesStore((state) => state.getNodeById);
    const getEdgeById = useModelNodesStore((state) => state.getEdgeById);
    const onNodesChange = useModelNodesStore((state) => state.onNodesChange);
    const onConnect = useModelNodesStore((state) => state.onConnect);
    const onConnectEnd = useModelNodesStore((state) => state.onConnectEnd);
    const onConnectStart = useModelNodesStore((state) => state.onConnectStart);
    const setCurrentNode = useModelNodesStore((state) => state.setCurrentNode);
    const clearAllNodesDataInStore = useModelNodesStore(
      (state) => state.clearAllNodesDataInStore
    );
    const clearAllEdgedDataInStore = useModelNodesStore(
      (state) => state.clearAllEdgedDataInStore
    );
    // #endregion

    // #region ModelModelBackend Imports
    const savedNodes = useModelBackendStore((state) => state.savedNodes);
    const updateHeader = useModelBackendStore((state) => state.updateHeader);
    const savedEdges = useModelBackendStore((state) => state.savedEdges);
    const savedModelNodes = useModelBackendStore(
      (state) => state.savedModelNodes
    );
    const fetchInitialSchema = useModelBackendStore(
      (state) => state.fetchInitialSchema
    );
    const { header } = useModelBackendStore();
    // #endregion

    // #region useTabStore Imports
    const setActiveTabIndex = useTabStore((state) => state.setActiveTabIndex);
    const setSliderOpen = useTabStore((state) => state.setSliderOpen);
    const showMiniMap = useTabStore((state) => state.showMiniMap);
    // #endregion

    // #region useModelStore Imports
    const models = useModelStore((state) => state.models);
    // #endregion

    const { setCenter, getNode } = useReactFlow();

    // #region event handlers
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

    const handleUpdateHeader = (newHeader: CanvasHeader) => {
      updateHeader(newHeader);
    };

    const handleSave = () => {
      const savedNodes = saveModelCanvasNodes();
      const savedEdges = saveModelEdges();
      console.log("Combined Nodes Data Model:", savedNodes);
      console.log("Combined Edges Data Model:", savedEdges);
      console.log(
        "models data:",
        models.filter((model) => model.isUpdated)
      );
    };

    const handleReset = () => {
      const loadSchema = async () => {
        await fetchInitialSchema();
      };
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      // clearModels();
      loadSchema();
      console.log("savedmodelitems", savedModelNodes);
      useCreateSavedModelNodesFromJSON(savedModelNodes);
    };
    // #endregion

    // #region useEffects

    useEffect(() => {
      console.log("in initial user use effect 1");
      useCreateSavedModelNodesFromJSON(savedModelNodes);
    }, [savedModelNodes]);

    // useEffect(() => {
    //   console.log("in initial user use effect 2");
    //   createSavedModelNodesfromJSON(savedNodes);
    // }, [savedNodes]);

    // useEffect(() => {
    //   createSavedModelEdgesFromJSON(savedEdges);
    // }, [savedEdges]);

    // useEffect(() => {
    //   setLoading(true);
    //   const loadInitialNodesAndEdges = async () => {
    //     await createSavedModelNodesfromJSON(savedNodes);
    //     //await createSavedModelEdgesFromJSON(savedEdges);
    //     setLoading(false);
    //   };
    //   loadInitialNodesAndEdges();
    // }, [savedNodes, savedEdges]);
    // #endregion

    const [viewport, setViewportState] = useState<Viewport>({
      x: 0,
      y: 0,
      zoom: 1,
    });
    const [visibleNodes, setVisibleNodes] = useState<Node[]>([]);
    const [visibleEdges, setVisibleEdges] = useState<Edge[]>([]);

    const handleViewportChange = useCallback(
      (vp: Viewport) => {
        console.log("Viewport changed:", vp);
        setViewportState(vp);
        setLoading(true);

        const visible =
          savedNodes &&
          savedNodes.filter((node) => {
            if (
              node.position.x >= vp.x &&
              node.position.x <= vp.x + window.innerWidth / vp.zoom &&
              node.position.y >= vp.y &&
              node.position.y <= vp.y + window.innerHeight / vp.zoom
            ) {
              const nodeExists = getNodeById(node.id);
              if (!nodeExists) {
                console.log("creating node", node.id);
                createSavedModelNodefromJSON(node);

                return node;
              }
            }
          });

        setVisibleNodes((prevVisibleNodes) => [
          ...prevVisibleNodes,
          ...visible,
        ]);

        //for edges
        const visibleEdges =
          savedEdges &&
          savedEdges.filter((edge) => {
            const sourceNode = getNodeById(edge.source);
            const targetNode = getNodeById(edge.target);

            if (
              sourceNode &&
              targetNode &&
              sourceNode.position.x >= vp.x &&
              sourceNode.position.x <= vp.x + window.innerWidth / vp.zoom &&
              sourceNode.position.y >= vp.y &&
              sourceNode.position.y <= vp.y + window.innerHeight / vp.zoom &&
              targetNode.position.x >= vp.x &&
              targetNode.position.x <= vp.x + window.innerWidth / vp.zoom &&
              targetNode.position.y >= vp.y &&
              targetNode.position.y <= vp.y + window.innerHeight / vp.zoom
            ) {
              const edgeExists = getEdgeById(edge.id);
              if (!edgeExists) {
                console.log("creating edge", edge.id);
                createSavedModelEdgesFromJSON([edge]);

                return edge;
              }
            }
          });

        setVisibleEdges((prevVisibleEdges) => [
          ...prevVisibleEdges,
          ...visibleEdges,
        ]);

        setLoading(false);
      },
      [nodes]
    );

    const handleOnMove = useCallback(
      (event, viewport: Viewport) => {
        handleViewportChange(viewport);
      },
      [handleViewportChange]
    );

    useEffect(() => {
      handleViewportChange(viewport);
    }, []);

    useEffect(() => {
      console.log("nodes changing");
      setVisibleNodes(nodes);
    }, [nodes]);

    useEffect(() => {
      console.log("nodes changing");
      setVisibleEdges(edges);
    }, [edges]);

    if (loading) {
      return (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.8)"
          zIndex={10}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box ref={wrapperRef} style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={visibleNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onDragOver={handleOnDragOver}
          onNodeDrag={onNodeDrag}
          defaultViewport={viewport}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
          onMove={handleOnMove}
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
                onUpdateHeader={handleUpdateHeader}
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
                onSave={handleSave}
                onReset={handleReset}
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
      </Box>
    );
  }
);
