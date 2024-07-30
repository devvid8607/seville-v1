// #region Imports
import { Box, CircularProgress, Typography } from "@mui/material";
import React, {
  DragEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
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

import SevilleToolbarNode from "@/app/canvas/[slug]/_lib/_nodes/flowComponents/FlowToolbar";
import { createSavedModelEdgesFromJSON } from "../../_helpers/createSavedModelEdgesFromJSON";
import {
  createSavedModelNodefromJSON,
  createSavedModelNodesfromJSON,
} from "../../_helpers/createSavedModelNodesfromJSON";
import { HelpDrawer } from "@/app/canvas/[slug]/_lib/_components/helpDrawer/HelpDrawer";
import { CanvasFixedRightSideBar } from "../canvasFixedRightSideBar/CanvasFixedRightSideBar";

import {
  CreateSavedModelNode,
  useCreateSavedModelNodesFromJSON,
} from "../../_helpers/createSavedModelNodesFromJSONNodeFormat";
import { AddModelCodeContextMenu } from "./modelInputs/AddModelCodeContextMenu";
import useModelBackendStore from "../../_store/modelStore/ModelBackEndStore";
import useModelStore from "../../_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../_store/modelStore/ModelNodesStore";
import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";

import {
  saveModelCanvasNodes,
  saveModelEdges,
} from "../../_helpers/saveModelCanvas";
import { ModelNode } from "./ModelNode";
import { useViewport } from "reactflow";
import { useSearchParams } from "next/navigation";
import { EditableContent } from "@/app/canvas/[slug]/_lib/_components/EditableContent";
import { useSaveModels } from "../../_queries/useModelQueries";
import { useCanvasData } from "../../_queries/useCanvasQueries";
import { queryClient } from "@/app/providers/QueryClientProvider";
// #endregion

// #region types
interface ReactFlowBoxProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  onInit: (instance: any) => void;
  nodeTypes: NodeTypes;
  rfInstance: ReactFlowInstance;
  edgeTypes: EdgeTypes;
  refetchCanvasData: () => void;
  parentloading: boolean;
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
    refetchCanvasData,
    parentloading,
  }: // refetchCanvasData,
  ReactFlowBoxProps) => {
    // const searchParams = useSearchParams();
    // const id = searchParams.get("id");
    // console.log("id::", id);
    const saveModelsMutation = useSaveModels();

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
    const initialSchemaItems = useModelBackendStore(
      (state) => state.initialSchemaItems
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

    console.log("parent loading", parentloading);

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
      saveModelsMutation.mutate(models.filter((model) => model.isUpdated));
    };

    const handleReset = () => {
      //setLoading(true);
      refetchCanvasData();
      // setLoading(false);
      // queryClient.invalidateQueries({ queryKey: ["canvasData"] });
      // refetchCanvasData();
      // const loadSchema = async () => {
      //   await fetchInitialSchema();
      // };
      // clearAllEdgedDataInStore();
      // clearAllNodesDataInStore();
      // // clearModels();
      // loadSchema();
      // console.log("savedmodelitems", savedModelNodes);
      // useCreateSavedModelNodesFromJSON(savedModelNodes);
    };

    const updateOtherNodes = async () => {
      console.log("in update other nodes");
      await createSavedModelNodesfromJSON(savedNodes);
    };

    const updateOtherEdges = async () => {
      console.log("in update other nodes");
      await createSavedModelEdgesFromJSON(savedEdges);
    };
    // #endregion

    // #region useEffects

    useEffect(() => {
      console.log("saved nodes", savedNodes);
      if (useModelNodesStore.getState().nodes.length === 0)
        createSavedModelNodesfromJSON(savedNodes);
    }, [
      useModelBackendStore.getState().savedNodes,
      useModelNodesStore.getState().nodes,
    ]);

    useEffect(() => {
      // if (useModelNodesStore.getState().nodes.length === 0)
      createSavedModelEdgesFromJSON(savedEdges);
    }, [
      useModelBackendStore.getState().savedEdges,
      useModelNodesStore.getState().nodes,
    ]);

    useEffect(() => {
      //if (useModelNodesStore.getState().nodes.length === 0)
      createSavedModelNodesfromJSON(initialSchemaItems);
    }, [
      useModelBackendStore.getState().initialSchemaItems,
      useModelNodesStore.getState().nodes,
    ]);

    // useEffect(() => {
    //   setLoading(true);
    //   const loadInitialNodesAndEdges = async () => {
    //     await createSavedModelNodesfromJSON(savedNodes);
    //     //await createSavedModelEdgesFromJSON(savedEdges);
    //     setLoading(false);
    //   };
    //   loadInitialNodesAndEdges();
    // }, [savedNodes, savedEdges]);

    const { x, y, zoom } = useViewport();
    // const [viewport, setViewportState] = useState<Viewport>({
    //   x: 0,
    //   y: 0,
    //   zoom: 0.5,
    // });
    // const [visibleNodes, setVisibleNodes] = useState<Node[]>([]);
    // const [visibleEdges, setVisibleEdges] = useState<Edge[]>([]);
    // const [initialRenderComplete, setInitialRenderComplete] = useState(false);
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //   if (id === "newModel") {
    //     console.log("in initial user use effect 1");
    //     useCreateSavedModelNodesFromJSON(savedModelNodes);
    //   }
    // }, [savedModelNodes, id]);

    // useEffect(() => {
    //   console.log("nodes changing", useModelNodesStore.getState().nodes);
    //   setVisibleNodes(useModelNodesStore.getState().nodes);
    // }, [useModelNodesStore.getState().nodes]);

    // useEffect(() => {
    //   console.log("edges changing");
    //   setVisibleEdges(edges);
    // }, [useModelNodesStore.getState().edges]);

    // useEffect(() => {
    //   const updateVisibleNodes = () => {
    //     if (!wrapperRef.current) return;

    //     const boundingRect = wrapperRef.current.getBoundingClientRect();
    //     console.log("calling update visible nodes", boundingRect);
    //     const visibleNodes =
    //       savedNodes &&
    //       savedNodes.filter((node) => {
    //         const nodeX = node.position.x * zoom;
    //         const nodeY = node.position.y * zoom;
    //         if (
    //           nodeX >= x &&
    //           nodeX <= x + boundingRect.width &&
    //           nodeY >= y &&
    //           nodeY <= y + boundingRect.height
    //         ) {
    //           const nodeExists = getNodeById(node.id);
    //           if (!nodeExists) {
    //             console.log("creating node", node.id);
    //             createSavedModelNodefromJSON(node);
    //             return node;
    //           }
    //         }
    //       });

    //     setVisibleNodes((prevVisibleNodes) => [
    //       ...prevVisibleNodes,
    //       ...visibleNodes.filter(
    //         (node) => !prevVisibleNodes.some((n) => n.id === node.id)
    //       ),
    //     ]);

    //     const visibleEdges2 = savedEdges?.filter((edge) => {
    //       const sourceNode = getNodeById(edge.source);
    //       const targetNode = getNodeById(edge.target);

    //       if (sourceNode && targetNode) {
    //         const sourceNodeX = sourceNode.position.x * zoom;
    //         const sourceNodeY = sourceNode.position.y * zoom;
    //         const targetNodeX = targetNode.position.x * zoom;
    //         const targetNodeY = targetNode.position.y * zoom;

    //         if (
    //           sourceNodeX >= x &&
    //           sourceNodeX <= x + boundingRect.width &&
    //           sourceNodeY >= y &&
    //           sourceNodeY <= y + boundingRect.height &&
    //           targetNodeX >= x &&
    //           targetNodeX <= x + boundingRect.width &&
    //           targetNodeY >= y &&
    //           targetNodeY <= y + boundingRect.height
    //         ) {
    //           console.log("Edge is within viewport:", edge.id);
    //           if (!getEdgeById(edge.id)) {
    //             console.log("Creating edge", edge.id);
    //             createSavedModelEdgesFromJSON([edge]);
    //           }
    //           return true; // Edge is within viewport
    //         }
    //       }
    //       return false; // Edge is not within viewport
    //     });

    //     setVisibleEdges((prevVisibleEdges) => [
    //       ...prevVisibleEdges,
    //       ...visibleEdges2.filter(
    //         (edge) => !prevVisibleEdges.some((n) => n.id === edge.id)
    //       ),
    //     ]);

    //     setInitialRenderComplete(true);
    //     // updateOtherNodes();
    //   };

    //   if (id !== "newModel") {
    //     updateVisibleNodes();
    //   }
    // }, [id]);

    // useEffect(() => {
    //   // if (initialRenderComplete) {
    //   //   setLoading(true);
    //   //   // const timer = setTimeout(() => {
    //   //   //   updateOtherNodes();
    //   //   //   updateOtherEdges();
    //   //   //   setLoading(false);
    //   //   // }, 1000);

    //   //   // return () => clearTimeout(timer);
    //   //   const updateAll = async () => {
    //   //     await Promise.all([updateOtherNodes(), updateOtherEdges()]);
    //   //     setLoading(false);
    //   //   };

    //   //   updateAll();
    //   // }
    //   if (initialRenderComplete) {
    //     setLoading(true);

    //     const updateAll = async () => {
    //       await Promise.all([updateOtherNodes(), updateOtherEdges()]);
    //       setLoading(false);
    //     };

    //     const timer = setTimeout(updateAll, 5000);

    //     return () => clearTimeout(timer);
    //   }
    // }, [initialRenderComplete]);
    // #endregion
    // const handleMoveEnd = () => {
    //   if (!wrapperRef.current) return;

    //   const boundingRect = wrapperRef.current.getBoundingClientRect();
    //   console.log("bounding rect", boundingRect);
    // };

    // useEffect(() => {
    //   console.log("in initial user use effect");
    //   useCreateSavedModelNodesFromJSON(savedModelNodes);
    // }, [savedModelNodes]);

    // useEffect(() => {
    //   console.log("in initial user use effect");
    //   createSavedModelNodesfromJSON(savedNodes);
    // }, [savedNodes]);

    // useEffect(() => {
    //   createSavedModelEdgesFromJSON(savedEdges);
    // }, [savedEdges]);

    const handleCanvasClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      // Getting the bounding rectangle of the canvas
      const boundingRect = event.currentTarget.getBoundingClientRect();

      // Calculating the coordinates relative to the canvas
      const x = event.clientX - boundingRect.left;
      const y = event.clientY - boundingRect.top;

      console.log("Click coordinates:", { x, y });
    };

    // if (loading) {
    //   return (
    //     <Box
    //       position="absolute"
    //       top={0}
    //       left={0}
    //       right={0}
    //       bottom={0}
    //       display="flex"
    //       alignItems="center"
    //       justifyContent="center"
    //       bgcolor="rgba(255, 255, 255, 0.8)"
    //       zIndex={10}
    //     >
    //       <CircularProgress />
    //     </Box>
    //   );
    // }

    return (
      <Box
        ref={wrapperRef}
        style={{
          height: "100vh",
          width: "100vw",
          filter: parentloading ? "blur(2px)" : "none",
          pointerEvents: parentloading ? "none" : "auto",
        }}
      >
        {parentloading && (
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {/* <div style={{ marginLeft: "20px" }}>
          <p>
            The viewport is currently at ({x}, {y}) and zoomed to {zoom}.
          </p>
        </div> */}
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
          onClick={handleCanvasClick}
        >
          <Panel position="top-left">
            <Box display="flex" flexDirection="column" gap={2} mt={2} ml={2}>
              {/* <NextBreadcrumb
                homeElement={<Typography>Home</Typography>}
                separator={<span> / </span>}
                capitalizeLinks={true}
              /> */}
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
