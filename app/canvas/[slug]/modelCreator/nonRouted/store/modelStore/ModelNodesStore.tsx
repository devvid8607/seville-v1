import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnConnectStartParams,
  OnEdgesChange,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import useModelBackendStore from "./ModelBackEndStore";
import { useTabStore } from "../TabStateManagmentStore";
import { getAttributeIdFromHandle } from "../../helpers/createModelData";
import useModelStore from "./ModelDetailsFromBackendStore";
import useDataTypesStore from "../DataTypesStore";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectEnd: OnConnectEnd;
  onConnectStart: OnConnectStart;
  addNode: (node: Node) => void;

  setCurrentNode: (node: Node | null) => void;
  currentNode: Node | null;
  removeConnectedEdge: (fieldId: string) => void;
  addEdge: (edge: Edge) => void;
  removeNodeById: (nodeId: string) => void;
  getNodeById: (nodeId: string) => Node | undefined;
  toggleNodeVisibility: (nodeId: string) => void;
  toggleNodeVisibilityAndConnectedEdges: (
    nodeId: string,
    hidden: boolean
  ) => void;
  removeEdge: (edgeId: string) => void;
  isModelIdInNodes: (modelId: string, nodeId: string) => boolean;
  cloneNodeAndItsIncomingEdges: (
    originalNodeId: string,
    newModelId: string
  ) => string | undefined;
  getConnectedTargetNodeAndEdgeIdByHandle: (
    sourceNodeId: string,
    handleId: string
  ) => { targetNode: Node | undefined; edgeId: string | undefined };
  getSourceNodeAndHandleByTargetNodeId: (targetNodeId: string) => {
    sourceNode: Node | null;
    sourceHandleId: string | null;
    connectingEdge: Edge | null;
  };
  updateNode: (updatedNode: Node) => void;
  hideConnectedTargetNodeAndEdgeByHandle: (
    sourceNodeId: string,
    sourceHandleId: string
  ) => void;
  removeNodeAndDescendants: (nodeId: string) => void;
  removeIncomingEdgesByNodeId: (nodeId: string) => void;
  cloneNodeAndUpdateDataSource: (
    nodeId: string,
    newDataSourceId: string
  ) => string | undefined;
  countNodesWithoutIncomingEdges: () => number;
  removeOutgoingEdgesFromNodeAndDescendants: (nodeId: string) => void;
  clearAllNodesDataInStore: () => void;
  clearAllEdgedDataInStore: () => void;
  addEdges: (newEdges: Edge[]) => void;
};

export const useModelNodesStore = create<RFState>((set, get) => {
  const { initialSchemaItems } = useModelBackendStore.getState();
  const setShowContextMenu = useTabStore.getState().setShowContextMenu;
  const setMenuPosition = useTabStore.getState().setMenuPosition;
  const setHandleId = useTabStore.getState().setHandleId;

  const storeDataTypes = useDataTypesStore.getState().dataTypes;

  const updateAttributeValueOfAModel =
    useModelStore.getState().updateAttributeValueOfAModel;
  const updatePropertyCurrentValue =
    useModelStore.getState().updatePropertyCurrentValue;
  const updateProperties = useModelStore.getState().updateProperties;

  return {
    nodes: initialSchemaItems,
    edges: [],
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
      console.log("onConnect", connection);
      if (
        !connection.source ||
        !connection.target ||
        !connection.sourceHandle
      ) {
        console.error("Invalid connection: source or target is null");
        return;
      }
      const newEdge = {
        id: uuidv4(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: "smoothstep",
      };

      const attributeId = getAttributeIdFromHandle(connection.sourceHandle);
      const currentNode = get().getNodeById(connection.source);

      const targetNode = get().getNodeById(connection.target);

      if (currentNode && attributeId && targetNode) {
        const currentDataSource = currentNode.data.modelDetails.dataSourceId;
        const targetDataSource = targetNode.data.modelDetails.dataSourceId;
        const targetDataSourceName = targetNode.data.modelDetails.friendlyName;
        if (currentDataSource && targetDataSource) {
          updateAttributeValueOfAModel(
            currentDataSource,
            attributeId,
            "dataSourceId",
            targetDataSource
          );
          updateAttributeValueOfAModel(
            currentDataSource,
            attributeId,
            "dataSourceFriendlyName",
            targetDataSourceName
          );
          updateAttributeValueOfAModel(
            currentDataSource,
            attributeId,
            "dataType",
            "model"
          );
          const selectedTypeData = storeDataTypes.find(
            (type) => type.code === "model"
          );
          const properties = selectedTypeData?.properties || [];
          updateProperties(currentDataSource, attributeId, properties);
          updatePropertyCurrentValue(
            currentDataSource,
            attributeId,
            "1",
            targetDataSource
          );
        }
      }

      get().addEdge(newEdge);
    },

    onConnectStart: (
      event: React.MouseEvent | React.TouchEvent,
      handle: OnConnectStartParams
    ) => {
      console.log("Connection start event:", event);
      console.log("Starting node ID:", handle.nodeId);
      console.log("Starting handle ID:", handle.handleId);
      console.log("Handle type:", handle.handleType);
      setHandleId(handle.handleId);
    },
    onConnectEnd: (event: MouseEvent | TouchEvent) => {
      // console.log("on connect end", handleId);
      event = event as MouseEvent;
      const target = event.target as Element | SVGTextPathElement;
      // Assuming you want to show a context menu at the position of the mouse when the connection ends
      const menuPosition = { x: event.pageX, y: event.pageY };
      const isStoppedOnPane = target.classList.contains("react-flow__pane");

      if (isStoppedOnPane) {
        setShowContextMenu(true);
        setMenuPosition(menuPosition);
      } else setShowContextMenu(false);
    },
    // addNode: (node) =>
    //   set((state) => ({
    //     nodes: [...state.nodes, node],
    //   })),
    addNode: (node) =>
      set((state) => {
        // Check if the node with the same id already exists
        const nodeExists = state.nodes.some(
          (existingNode) => existingNode.id === node.id
        );

        if (nodeExists) {
          console.warn(`Node with id ${node.id} already exists.`);
          return state; // Return the current state without changes
        }

        // If the node does not exist, add it to the nodes array
        return {
          nodes: [...state.nodes, node],
        };
      }),

    currentNode: null,
    setCurrentNode: (node) => set({ currentNode: node }),
    removeConnectedEdge: (fieldId) => {
      const edges = get().edges;
      const updatedEdges = edges.filter((edge) => {
        // Assuming that the sourceHandle or targetHandle contains the fieldId in its ID
        const sourceHandleContainsFieldId =
          edge.sourceHandle && edge.sourceHandle.includes(fieldId);
        const targetHandleContainsFieldId =
          edge.targetHandle && edge.targetHandle.includes(fieldId);

        // Return false (filter out) if either handle ID contains the fieldId
        return !sourceHandleContainsFieldId && !targetHandleContainsFieldId;
      });

      set({ edges: updatedEdges });
    },
    addEdge: (newEdge) =>
      set((state) => {
        // Prevent duplicate edges from the same sourceHandle
        const edges = state.edges.filter(
          (edge) => edge.sourceHandle !== newEdge.sourceHandle
        );
        return { edges: [...edges, newEdge] };
      }),
    removeNodeById: (nodeId) => {
      set((state) => {
        // Filter out the node with the specified id
        const updatedNodes = state.nodes.filter((node) => node.id !== nodeId);

        // Also, remove edges connected to this node
        const updatedEdges = state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        );

        return {
          ...state,
          nodes: updatedNodes,
          edges: updatedEdges,
        };
      });
    },
    getNodeById: (nodeId) => {
      // Search for the node with the given nodeId
      const node = get().nodes.find((node) => node.id === nodeId);
      return node; // This will return the node if found, or undefined if not
    },
    toggleNodeVisibility: (nodeId: string) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === nodeId) {
            // Toggle the hidden property of the node with the given nodeId
            return { ...node, hidden: !node.hidden };
          }
          return node;
        }),
      }));
    },
    toggleNodeVisibilityAndConnectedEdges: (nodeId: string, hide: boolean) => {
      set((state) => {
        console.log(`Toggling visibility for nodeId: ${nodeId}, hide: ${hide}`);

        let updatedNodes = [...state.nodes];
        let updatedEdges = [...state.edges];

        const toggleVisibilityRecursively = (
          currentNodeId: string,
          isInitialNode = true
        ) => {
          console.log(
            `Processing nodeId: ${currentNodeId}, isInitialNode: ${isInitialNode}`
          );

          updatedNodes = updatedNodes.map((node) => {
            if (node.id === currentNodeId) {
              console.log(
                `Toggling node visibility. NodeId: ${node.id}, New Hidden State: ${hide}`
              );
              return { ...node, hidden: hide };
            }
            return node;
          });

          updatedEdges = updatedEdges.map((edge) => {
            if (
              edge.source === currentNodeId ||
              edge.target === currentNodeId
            ) {
              console.log(
                `Toggling edge visibility. EdgeId: ${edge.id}, New Hidden State: ${hide}`
              );
              return { ...edge, hidden: hide };
            }
            return edge;
          });

          if (!isInitialNode) {
            return; // Stop recursion if not the initial node to avoid unintended hiding
          }

          // For the initial node, recursively toggle visibility for child nodes
          const outgoingEdges = updatedEdges.filter(
            (edge) => edge.source === currentNodeId
          );
          outgoingEdges.forEach((edge) => {
            const targetNode = updatedNodes.find(
              (node) => node.id === edge.target
            );
            if (targetNode && targetNode.hidden !== hide) {
              // Corrected condition for clarity
              console.log(
                `Recursively toggling visibility for child node. Child NodeId: ${targetNode.id}`
              );
              toggleVisibilityRecursively(targetNode.id, false);
            }
          });
        };

        toggleVisibilityRecursively(nodeId, true);

        console.log(`Finished toggling visibility for nodeId: ${nodeId}`);

        return { nodes: updatedNodes, edges: updatedEdges };
      });
    },
    removeEdge: (edgeId: string) => {
      set((state) => {
        const edgeToRemove = state.edges.find((e) => e.id === edgeId);
        if (!edgeToRemove) return state;

        // Remove the edge
        const updatedEdges = state.edges.filter((e) => e.id !== edgeId);
        return {
          ...state,
          edges: updatedEdges,
        };
      });
    },
    isModelIdInNodes: (modelId, nodeId) => {
      const state = get(); // Get the current state
      // Find if any node other than the one with nodeId has data.modelDataId equal to modelId
      const found = state.nodes.some(
        (node) => node.id !== nodeId && node.data.modelDataId === modelId
      );
      console.log("found ", found);
      return found;
    },
    cloneNodeAndItsIncomingEdges: (originalNodeId, newModelId) => {
      const state = get();
      const originalNode = state.getNodeById(originalNodeId);

      if (!originalNode) {
        console.error("Original node not found");
        return;
      }

      // Generate a new nodeId for the clone.
      const newNodeId = uuidv4();

      // Clone the node with a new nodeId and set the new modelDataId in its data
      const clonedNode = {
        ...originalNode,
        id: newNodeId,
        data: {
          ...originalNode.data,
          nodeId: newNodeId,
          modelDataId: newModelId,
          // originalNodeId: originalNodeId,
        },
      };

      state.addNode(clonedNode);

      //Clone only incoming edges (where the node is the target) and update their target to the new nodeId
      const clonedEdges = state.edges
        .filter((edge) => edge.target === originalNodeId)
        .map((edge) => ({
          ...edge,
          target: newNodeId,
          id: uuidv4(), // Generate a new edge ID
        }));

      clonedEdges.forEach((clonedEdge) => state.addEdge(clonedEdge));
      // state.toggleNodeVisibility(originalNodeId);

      // Add the cloned node and its incoming edges to the store
      // set((prevState) => ({
      //   nodes: prevState.nodes
      //     .filter((node) => node.id !== originalNodeId) // Remove the original node.
      //     .concat(clonedNode), // Add the cloned node.
      //   edges: prevState.edges
      //     .filter(
      //       (edge) =>
      //         edge.source !== originalNodeId && edge.target !== originalNodeId
      //     ) // Remove edges connected to the original node.
      //     .concat(clonedEdges), // Add cloned incoming edges.
      // }));
      return newNodeId;
    },
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
    updateNode: (updatedNode: Node) => {
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === updatedNode.id ? updatedNode : node
        ),
      }));
    },
    hideConnectedTargetNodeAndEdgeByHandle: (sourceNodeId, sourceHandleId) => {
      set((state) => {
        const edges = state.edges;
        const nodes = state.nodes;

        // Find the edge that matches the sourceNodeId and sourceHandleId
        const edgeToHide = edges.find(
          (edge) =>
            edge.source === sourceNodeId && edge.sourceHandle === sourceHandleId
        );
        if (!edgeToHide) {
          return state; // Edge not found, return current state
        }

        // Hide the edge
        const updatedEdges = edges.map((edge) => {
          if (edge.id === edgeToHide.id) {
            return { ...edge, hidden: true };
          }
          return edge;
        });

        // Find and hide the target node connected by the edge
        const updatedNodes = nodes.map((node) => {
          if (node.id === edgeToHide.target) {
            return { ...node, hidden: true };
          }
          return node;
        });

        return {
          ...state,
          nodes: updatedNodes,
          edges: updatedEdges,
        };
      });
    },
    //removes node its children and the edges
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
    //removes any edges connected to a node as a source
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
    cloneNodeAndUpdateDataSource: (nodeId: string, newDataSourceId: string) => {
      const state = get();
      const originalNode = state.nodes.find((node) => node.id === nodeId);
      if (!originalNode) {
        console.error("Node not found:", nodeId);
        return undefined;
      }

      const newModelId = uuidv4();
      const newModelNameSuffix = newModelId.substring(0, 5); // Get up to first 5 characters of the new model ID
      const originalModelName =
        originalNode.data.modelDetails?.modelName || "Model";

      // Clone the node
      const clonedNode: Node = {
        ...JSON.parse(JSON.stringify(originalNode)),
        id: newModelId, // Ensure the cloned node has a new ID
        data: {
          ...originalNode.data,
          modelDetails: {
            ...originalNode.data.modelDetails,
            nodeId: newModelId,
            url: "",
            dataSourceId: newDataSourceId, // Update the dataSourceId in the cloned node
            friendlyName: `${originalModelName}-clone-${newModelNameSuffix}`,
          },
        },
      };

      // Clone connected edges (both incoming and outgoing)
      const clonedEdges = state.edges
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .map((edge) => ({
          ...edge,
          id: uuidv4(), // Ensure cloned edges have new IDs
          source: edge.source === nodeId ? clonedNode.id : edge.source,
          target: edge.target === nodeId ? clonedNode.id : edge.target,
        }));

      // Add the cloned node and edges to the store
      set((state) => ({
        nodes: [...state.nodes, clonedNode],
        edges: [...state.edges, ...clonedEdges],
      }));

      return clonedNode.id; // Return the ID of the newly cloned node
    },
    countNodesWithoutIncomingEdges: () => {
      const state = get(); // Get the current state
      const targetNodeIds = new Set(state.edges.map((edge) => edge.target));
      const nodesWithoutIncomingEdges = state.nodes.filter(
        (node) => !targetNodeIds.has(node.id)
      );
      return nodesWithoutIncomingEdges.length;
    },
    removeOutgoingEdgesFromNodeAndDescendants: (nodeId: string) => {
      set((state) => {
        // Helper function to recursively collect all descendant node IDs
        const collectDescendantNodeIds = (
          currentNodeId: string,
          nodes: Node[],
          edges: Edge[],
          collectedIds: Set<string> = new Set()
        ) => {
          collectedIds.add(currentNodeId);
          const outgoingEdges = edges.filter(
            (edge) => edge.source === currentNodeId
          );
          outgoingEdges.forEach((edge) => {
            if (!collectedIds.has(edge.target)) {
              collectDescendantNodeIds(edge.target, nodes, edges, collectedIds);
            }
          });
          return collectedIds;
        };

        // Collect all descendant node IDs of the given node
        const descendantNodeIds = collectDescendantNodeIds(
          nodeId,
          state.nodes,
          state.edges
        );

        // Filter out edges that have their source in the set of descendant node IDs
        const updatedEdges = state.edges.filter(
          (edge) => !descendantNodeIds.has(edge.source)
        );

        // Return updated state
        return { ...state, edges: updatedEdges };
      });
    },
    clearAllNodesDataInStore: () => {
      set({ nodes: [] });
    },
    clearAllEdgedDataInStore: () => {
      set({ edges: [] });
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
  };
});
