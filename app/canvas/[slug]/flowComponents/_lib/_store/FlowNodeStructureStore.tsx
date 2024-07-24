import { create } from "zustand";

import {
  NodeStructureInput,
  NodeStructureOutput,
} from "../_types/SevilleSchema";
import { XYPosition } from "reactflow";

import { ComplexValueType } from "../_types/ValueTypes";

export type PathObject = {
  key: string;
  paths: string[][];
};

export type NodeStructure = {
  nodeId: string;
  schemaId: string;
  path: string[][];
  inputs: NodeStructureInput[];
  outputs: NodeStructureOutput[];
  helpText: string;
  description: string;
  icon: string;
  headerColor: string;
  name: string;
  userProvidedName: string;
  isPinned: boolean;
  position: XYPosition;
  parentIteratorNode: string;
  options: any[];
};

interface NodeStructureState {
  nodeStructures: NodeStructure[];
  addNodeStructure: (nodeStructure: NodeStructure) => void;
  updateNodeStructure: (
    nodeId: string,
    updates: Partial<NodeStructure>
  ) => void;
  getNodeStructure: (nodeId: string) => NodeStructure | undefined;
  removeNodeStructure: (nodeId: string) => void;
  resetNodeStructures: () => void;
  toggleNodeStructurePinned: (nodeId: string) => void;
  // updateNodeStructuresAfterEdgeRemoval: (sourceNodeId: string) => void;
  // updateNodeStructuresAfterEdgeRemoval2: (
  //   sourceNodeId: string,
  //   targetNodeId: string,
  //   errorValue: boolean
  // ) => void;
}

const updateNodeName = (item: any, nodeId: string, newName: string | null) => {
  console.log("in updateNodeName", newName);
  console.log("items", item);
  if (newName === null) return;

  if (item.parentId === nodeId) {
    const parts = item.name.split(".");
    if (parts.length > 1) {
      parts[0] = newName;
      item.name = parts.join(".");
    } else {
      item.name = newName;
    }
    // item.name = newName;
  } else if (Array.isArray(item.values) && item.values.length > 0) {
    console.log("item has a values array", item.values);
    item.values.forEach((value: ComplexValueType) => {
      updateNodeName(value, nodeId, newName);
    });
  } else if (typeof item === "object" && item !== null) {
    //for iterator value
    console.log("item has a values array 2", item);
    Object.keys(item).forEach((key) => {
      const value = item[key];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((item) => {
          // if ("source" in item) {
          updateNodeName(item, nodeId, newName);
          // }
        });
      }
    });
  }
};

export const useNodeStructureStore = create<NodeStructureState>((set, get) => ({
  nodeStructures: [],

  addNodeStructure: (nodeStructure: NodeStructure) =>
    set((state) => ({
      nodeStructures: [
        ...state.nodeStructures,
        { ...nodeStructure, isPinned: false },
      ],
    })),
  updateNodeStructure: (nodeId: string, updates: Partial<NodeStructure>) =>
    set((state) => {
      const updatedNodeStructures = state.nodeStructures.map((ns) =>
        ns.nodeId === nodeId ? { ...ns, ...updates } : ns
      );
      console.log("updates", updates);
      if ("userProvidedName" in updates) {
        console.log("user providd name in updates");
        console.log(updatedNodeStructures);
        const userProvidedName = updates.userProvidedName
          ? updates.userProvidedName
          : null;

        state.nodeStructures.forEach((ns) => {
          console.log("ns1 inputs", ns.inputs);

          ns.inputs.forEach((eachInput) => {
            console.log(eachInput);
            if (
              Array.isArray(eachInput.values) &&
              eachInput.values.length > 0
            ) {
              //case where input.values does not have values
              eachInput.values.forEach((eachInputValue) => {
                console.log("eachInputValue", eachInputValue);

                updateNodeName(eachInputValue, nodeId, userProvidedName);
              });
            }
          });
        });
      }
      console.log("updatedNodeStructures", updatedNodeStructures);
      return {
        nodeStructures: updatedNodeStructures,
      };
    }),
  getNodeStructure: (nodeId: string) =>
    get().nodeStructures.find((ns) => ns.nodeId === nodeId),
  removeNodeStructure: (nodeId: string) =>
    set((state) => ({
      nodeStructures: state.nodeStructures.filter(
        (ns) => ns.nodeId !== nodeId && ns.parentIteratorNode !== nodeId
      ),
      // nodeStructures: state.nodeStructures
      //   .filter(
      //     (ns) => ns.nodeId !== nodeId && ns.parentIteratorNode !== nodeId
      //   )
      //   .map((ns) => ({
      //     ...ns,
      //     inputs: ns.inputs.map((input) =>
      //       updateInputOnNodeDelete(input, nodeId, true)
      //     ),
      //   })),
    })),
  // updateNodeStructuresAfterEdgeRemoval: (nodeId: string) =>
  //   set((state) => ({
  //     nodeStructures: state.nodeStructures.map((ns) => ({
  //       ...ns,
  //       inputs: ns.inputs.map((input) =>
  //         updateInputOnNodeDelete(input, nodeId, true)
  //       ),
  //     })),
  //   })),
  // updateNodeStructuresAfterEdgeRemoval2: (
  //   nodeId: string,
  //   targetNodeId: string,
  //   errorValue: boolean
  // ) =>
  //   set((state) => ({
  //     nodeStructures: state.nodeStructures.map((ns) => {
  //       // Check if the current node structure is the one that needs to be updated
  //       if (ns.nodeId === targetNodeId) {
  //         // Apply updateInputOnNodeDelete to each input of the node structure
  //         return {
  //           ...ns,
  //           inputs: ns.inputs.map((input) =>
  //             updateInputOnNodeDelete(input, nodeId, errorValue)
  //           ),
  //         };
  //       }
  //       // If the current node structure is not the one to be updated, return it as is
  //       return ns;
  //     }),
  //   })),
  resetNodeStructures: () =>
    set(() => ({
      nodeStructures: [], // Resetting the nodeStructures array
    })),
  toggleNodeStructurePinned: (nodeId: string) =>
    set((state) => ({
      nodeStructures: state.nodeStructures.map((node) =>
        node.nodeId === nodeId ? { ...node, isPinned: !node.isPinned } : node
      ),
    })),
}));
