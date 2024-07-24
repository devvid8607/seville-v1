import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnConnectEnd,
  OnEdgesChange,
  OnNodesChange,
  Viewport,
  XYPosition,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";
import { updatePathOfAllNodes } from "../_helpers/CanvasValidation";
import { SEVILLEEDGETYPE } from "../../../_lib/_edges/EdgeTypes";
import useFlowBackendStore from "./FlowBackEndStore";
// import initialEdges from "./edges";
// import { useCreateSavedInitialUserNodesFromJSON } from "../FlowComponents/Helpers/Canvas/createSaveInitialUserNodesFromJSON";

export enum NODE_TYPES {
  RULENODE = "ruleNode",
  INPUTNODE = "inputNode",
  VALIDATIONOUTPUTNODE = "validationOutputNode",
  CONTEXTDATANODE = "contextDataNode",
  FLOWNODESELECTORNODE = "flowNodeSelectorNode",
  FLOWNODE = "flowNode",
  FLOWITERATORNODE = "flowIteratorNode",
  FLOWSTARTNODE = "flowStartNode",
  FLOWENDNODE = "FlowEndNode",
  FLOWVALIDNODE = "flowValidNode",
  FLOWINVALIDNODE = "flowInValidNode",
  MAPPINGNODE = "mappingModelNode",
  // VALIDATIONNODE = "validationNode",
  LOGICOUTPUTNODE = "logicOutputNode",
}

export type RFState = {
  nodes: Node[];
  edges: Edge[];

  clearAllNodesDataInStore: () => void;
  clearAllEdgedDataInStore: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectEnd: OnConnectEnd;
  addNode: (newNode: Node) => void;
  addEdges: (newEdges: Edge[]) => void;
  removeEdge: (edgeId: string) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (updatedNode: Node) => void;
  connectionError: string;
  setConnectionError: (errorMessage: string) => void;
  toggleNodeType: (nodeId: string) => void;
  resetToInitialNodes: () => void;
  toggleNodeVisibility: (nodeId: string, viewPort: Viewport) => void;
  connectedNodeIdsArray: string[];
  nodesChain: string[][];
  setCurrentNode: (node: Node | null) => void;
  currentNode: Node | null;
  getNodeById: (nodeId: string) => Node | undefined;
  getNodeByType: (type: string) => Node | undefined;
  setCurrentNodeType: (nodetype: string | null) => void;
  currentNodeType: string | null;
  removeEdges: (edges: string[]) => void;
  removeNodes: (nodes: string[]) => void;

  addEdge: (edge: Edge) => void;
  getConnectedTargetNodeAndEdgeIdByHandle: (
    sourceNodeId: string,
    handleId: string
  ) => { targetNode: Node | undefined; edgeId: string | undefined };
  removeNodeAndDescendants: (nodeId: string) => void;
  removeIncomingEdgesByNodeId: (nodeId: string) => void;
  getSourceNodeAndHandleByTargetNodeId: (targetNodeId: string) => {
    sourceNode: Node | null;
    sourceHandleId: string | null;
    connectingEdge: Edge | null;
  };
};

const willCreateCycle = (
  source: string,
  target: string,
  edges: Edge[]
): boolean => {
  let visited = new Set<string>();
  let stack: string[] = [target];

  while (stack.length) {
    let current = stack.pop()!;
    if (current === source) {
      return true; // Cycle detected
    }
    visited.add(current);

    const connectedNodes = edges
      .filter((e) => e.source === current)
      .map((e) => e.target);
    stack.push(...connectedNodes.filter((n) => !visited.has(n)));
  }

  return false;
};

interface ValidConnections {
  [key: string]: string[];
}

export const useFlowNodeStore = create<RFState>((set, get) => {
  const { initialSchemaItems, savedModelNodes } =
    useFlowBackendStore.getState();

  // const  pageType  = usePagePropertiesStore.getState().pageType;

  // const { addNodeToRule } = useRulesStore.getState();
  // console.log("pagetype", pageType);s

  return {
    nodes: initialSchemaItems,
    edges: [],
    connectedNodeIdsArray: [],
    connectionError: "sfsdfs",
    nodesChain: [],

    clearAllNodesDataInStore: () => {
      set({ nodes: [] });
    },
    clearAllEdgedDataInStore: () => {
      set({ edges: [] });
    },
    setConnectionError: (errorMessage: string) => {
      set({ connectionError: errorMessage });
    },
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set((store) => {
        const { nodes, edges, setConnectionError } = store;

        if (!connection.source || !connection.target) {
          console.error("Invalid connection: source or target is null");
          return store;
        }

        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        //code starts- added to disallow connecting mapping handle with flow handle
        const validConnections: ValidConnections = {
          b: ["a"],
        };

        if (!connection.sourceHandle || !connection.targetHandle) {
          console.error(
            "Invalid connection: source handle or target handle is null"
          );
          setConnectionError(
            "Invalid connection: source handle or target handle is missing."
          );
          return store;
        }
        const isValidConnection = validConnections[
          connection.sourceHandle
        ]?.includes(connection.targetHandle);

        if (!isValidConnection) {
          console.error(
            "Invalid connection attempt between handles:",
            connection.sourceHandle,
            connection.targetHandle
          );
          setConnectionError(
            `Connection between handles ${connection.sourceHandle} and ${connection.targetHandle} is not allowed.`
          );
          return store;
        }
        //code ends - added to disallow connecting mapping handle with flow handle

        const canConnect =
          sourceNode?.parentNode === targetNode?.parentNode ||
          (!sourceNode?.parentNode && !targetNode?.parentNode);

        if (willCreateCycle(connection.source, connection.target, edges)) {
          setConnectionError("Connection would create a cycle. Not allowed.");
          console.log("Connection would create a cycle. Not allowed.");
          return store;
        }

        if (!canConnect) {
          setConnectionError(
            "Nodes have different parents. Connection not allowed."
          );
          console.log("Nodes have different parents. Connection not allowed.");
          return store;
        }

        return {
          ...store,
          edges: addEdge({ ...connection, type: SEVILLEEDGETYPE }, edges),
        };
      });
    },
    addNode: (newNode: Node) => {
      set((state) => ({
        nodes: state.nodes.some((node) => node.id === newNode.id)
          ? [...state.nodes]
          : [...state.nodes, newNode],
      }));
    },
    addEdges: (newEdges: Edge[]) => {
      set((state) => ({
        edges: [
          ...state.edges,
          ...newEdges.filter(
            (newEdge) => !state.edges.some((edge) => edge.id === newEdge.id)
          ),
        ],
      }));
    },
    removeEdge: (edgeId: string) => {
      set((state) => {
        const edgeToRemove = state.edges.find((e) => e.id === edgeId);
        if (!edgeToRemove) return state;

        // const { source, target } = edgeToRemove;

        // Remove the edge
        const updatedEdges = state.edges.filter((e) => e.id !== edgeId);

        return {
          ...state,
          edges: updatedEdges,
          // nodesChain: updatedNodesChain,
        };
      });
    },
    removeNode: (nodeId: string) => {
      set((state) => {
        console.log("outgoers");
        // const node = state.nodes.find((node) => node.id === nodeId);

        // if (node) {
        //   const outgoers = getOutgoers(node, state.nodes, state.edges);
        //   console.log(outgoers);
        //   const outgoerIds = outgoers.map((outgoer) => outgoer.id);
        //   updatePathsOnNodeRemoval(outgoerIds, nodeId);
        // } else {
        //   console.log("Node not found");
        // }

        // Filter out the node and any child nodes
        const filteredNodes = state.nodes.filter(
          (n) => n.id !== nodeId && n.parentNode !== nodeId
        );

        // Filter out the edges associated with the node and its children
        const filteredEdges = state.edges.filter((e) => {
          const isSourceOrTarget = e.source === nodeId || e.target === nodeId;
          const isChildNodeSourceOrTarget = state.nodes.some((node) => {
            return (
              node.parentNode === nodeId &&
              (e.source === node.id || e.target === node.id)
            );
          });
          return !isSourceOrTarget && !isChildNodeSourceOrTarget;
        });

        // const updatedNodesChain = updateNodesChainOnNodeRemoval(
        //   state.nodesChain,
        //   nodeId
        // );

        // console.log("nodes chain");
        // console.log(state.nodesChain);

        // const chainContainingNode = state.nodesChain.find((chain) =>
        //   chain.includes(nodeId)
        // );
        // if (chainContainingNode) {
        //   const nodeIndex = chainContainingNode.indexOf(nodeId);
        //   const sourceIndex = nodeIndex - 1;
        //   const targetIndex = nodeIndex + 1;
        //   const startToSourceChain = chainContainingNode.slice(
        //     0,
        //     sourceIndex + 1
        //   );
        //   const targetToEndChain = chainContainingNode.slice(targetIndex);
        //   console.log(startToSourceChain);
        //   console.log(targetToEndChain);
        //   startToSourceChain.forEach((nodeId) => {
        //     console.log("Updating node structure for nodeId:", nodeId);

        //     // Call a function that updates the node structures from the target to the end of the chain
        //     targetToEndChain.forEach((targetNodeId) => {
        //       updateNodeStructuresAfterEdgeRemoval2(nodeId, targetNodeId, true);
        //     });
        //   });
        // }

        // console.log("nodes chain");
        // console.log(updatedNodesChain);

        return {
          nodes: filteredNodes,
          edges: filteredEdges,
          // nodesChain: updatedNodesChain,
        };
      });
      updatePathOfAllNodes();
    },

    removeEdges: (edgeIds) => {
      set((state) => ({
        edges: state.edges.filter((edge) => !edgeIds.includes(edge.id)),
      }));
    },
    removeNodes: (nodeIds) => {
      set((state) => ({
        nodes: state.nodes.filter((node) => !nodeIds.includes(node.id)),
      }));
    },

    updateNode: (updatedNode: Node) => {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === updatedNode.id ? { ...n, ...updatedNode } : n
        ),
      }));
    },
    toggleNodeType: (nodeId: string) => {
      set((state) => {
        const updatedNodes = state.nodes.map((node) => {
          if (node.id === nodeId) {
            const newType =
              node.type === "stickyPanel" ? `${nodeId}Node` : "stickyPanel";
            return { ...node, type: newType };
          }
          return node;
        });

        return { ...state, nodes: updatedNodes };
      });
    },
    resetToInitialNodes: () => {
      set(() => ({
        nodes: [],
        edges: [],
      }));
    },
    toggleNodeVisibility: (nodeId: string, viewPort: Viewport) => {
      //to make show hide work based on viewport
      // const { x: translateX, y: translateY, zoom } = viewPort;
      // const calculateRelativePosition = (nodePosition: XYPosition) => {
      //   const { x, y } = nodePosition;
      //   const relativeX = (x - translateX) / zoom;
      //   const relativeY = (y - translateY) / zoom;
      //   return { x: relativeX, y: relativeY };
      // };
      // set((state) => ({
      //   nodes: state.nodes.map((node) => {
      //     if (node.id === nodeId) {
      //       if (node.hidden) {
      //         // Node is currently hidden, show it and restore its original position
      //         const originalPosition =
      //           node.originalPosition || node.positionAbsolute || node.position;
      //         const relativePosition =
      //           calculateRelativePosition(originalPosition);
      //         // Check if the node is within the viewport
      //         const isWithinViewport =
      //           relativePosition.x >= 0 &&
      //           relativePosition.x <= window.innerWidth &&
      //           relativePosition.y >= 0 &&
      //           relativePosition.y <= window.innerHeight;
      //         return {
      //           ...node,
      //           position: isWithinViewport ? node.position : relativePosition,
      //           hidden: false,
      //         };
      //       } else {
      //         // Node is currently visible, hide it and store its original position
      //         return {
      //           ...node,
      //           originalPosition: node.positionAbsolute || node.position,
      //           hidden: true,
      //         };
      //       }
      //     }
      //     return node;
      //   }),
      // }));
      ///////////////
      ///////////////////
      set((state) => ({
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? { ...node, hidden: !node.hidden } : node
        ),
      }));
    },
    onConnectEnd: () => {
      // event.preventDefault();
      // event.stopPropagation();
      updatePathOfAllNodes();
    },
    onEdgesDelete: () => {
      console.log("edge deleted");
    },
    currentNode: null,
    setCurrentNode: (node) => set({ currentNode: node }),
    getNodeById: (nodeId) => {
      // Search for the node with the given nodeId
      const node = get().nodes.find((node) => node.id === nodeId);
      return node; // This will return the node if found, or undefined if not
    },
    getNodeByType: (type) => {
      // Search for the node with the given nodeId
      const node = get().nodes.find((node) => node.type === type);
      return node; // This will return the node if found, or undefined if not
    },
    currentNodeType: null,
    setCurrentNodeType: (nodeType) => set({ currentNodeType: nodeType }),
    getConnectedTargetNodeAndEdgeIdByHandle: (sourceNodeId, handleId) => {
      const { edges, nodes } = get();

      // Find an edge where the source is the given node ID and the source handle matches the given handle ID
      const edge = edges.find(
        (edge) => edge.source === sourceNodeId && edge.sourceHandle === handleId
      );

      // If an edge is found, use the edge's target to find the connected target node
      const targetNode = edge
        ? nodes.find((node) => node.id === edge.target)
        : undefined;

      // Return both the target node and the edge ID
      return { targetNode, edgeId: edge?.id }; // edge?.id will be undefined if no edge is found
    },
    getSourceNodeAndHandleByTargetNodeId: (targetNodeId) => {
      const { edges, nodes } = get();

      // Find the edge where the current node is the target
      const connectingEdge = edges.find((edge) => edge.target === targetNodeId);

      if (!connectingEdge) {
        return { sourceNode: null, sourceHandleId: null, connectingEdge: null };
      }

      // Find the source node based on the edge's source property
      const sourceNode =
        nodes.find((node) => node.id === connectingEdge.source) || null;

      // Ensure sourceHandleId is not undefined by providing a fallback to null
      const sourceHandleId = connectingEdge.sourceHandle ?? null;

      return { sourceNode, sourceHandleId, connectingEdge };
    },
    removeNodeAndDescendants: (nodeId) => {
      set((state) => {
        const nodesToRemove = new Set<string>();
        const edgesToRemove = new Set<string>();

        // Helper function to recursively find all descendant nodes
        const findAllDescendants = (currentNodeId: string) => {
          nodesToRemove.add(currentNodeId);
          state.edges.forEach((edge) => {
            if (edge.source === currentNodeId) {
              console.log("removing edge target " + edge.target);
              nodesToRemove.add(edge.target);
              console.log("removing edge id " + edge.id);
              edgesToRemove.add(edge.id);
              findAllDescendants(edge.target); // Recursive call
            }
          });
        };

        // Start the recursive search from the provided nodeId
        findAllDescendants(nodeId);

        // Remove all identified nodes and edges
        const newNodes = state.nodes.filter(
          (node) => !nodesToRemove.has(node.id)
        );
        const newEdges = state.edges.filter(
          (edge) => !edgesToRemove.has(edge.id)
        );

        return {
          ...state,
          nodes: newNodes,
          edges: newEdges,
        };
      });
    },
    removeIncomingEdgesByNodeId: (nodeId) => {
      set((state) => {
        // Filter out edges where the nodeId is the source
        const filteredEdges = state.edges.filter(
          (edge) => edge.target !== nodeId
        );

        return {
          ...state,
          edges: filteredEdges,
        };
      });
    },
    addEdge: (newEdge) =>
      set((state) => {
        const edges = state.edges.filter(
          (edge) => edge.sourceHandle !== newEdge.sourceHandle
        );
        return { edges: [...edges, newEdge] };
      }),
  };
});
