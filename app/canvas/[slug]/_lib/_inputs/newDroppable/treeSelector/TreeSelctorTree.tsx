import * as Icons from "@mui/icons-material";
import { Box, Checkbox, Icon, Typography } from "@mui/material";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import React, { useState, useEffect } from "react";

import { TreeDataType } from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";

import { NodeStructureInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { testfn } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/CanvasValidation";
import { iconLookup } from "@/app/canvas/[slug]/_lib/_constants/IconConstants";

interface TestComponentsProps {
  data: TreeDataType;
  input: NodeStructureInput;
  nodeId: string;
  // onDataUpdate: (expanded: string[], selected: string[]) => void;
}

export const TreeSelectorTree: React.FC<TestComponentsProps> = ({
  data,
  input,
  nodeId,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (
      input.values &&
      input.values.length === 1 &&
      input.values[0].selector
      // input.values[0].dropType === DropTypes.Model
    ) {
      console.log("in tree useeffect", input);
      setExpanded(input.values[0].selector.expanded);
      setSelected(input.values[0].selector.selected);
    }
  }, []);

  useEffect(() => {
    testfn(nodeId, input.id, input.values[0].id, {
      expanded: expanded,
      selected: selected,
      gridata: [],
    });
  }, [expanded, selected]);

  console.log("selected", selected);
  console.log("expanded", expanded);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds); // Only manage expansion state here
  };

  // const renderIcon = (iconName?: keyof typeof Icons) => {
  //   if (!iconName) return null;
  //   const Icon = Icons[iconName];
  //   return Icon ? <Icon style={{ marginRight: 8 }} /> : null;
  // };

  const renderIcon = (dataType: string | string[]) => {
    type IconLookupKey = keyof typeof iconLookup;
    const iconName = iconLookup[dataType as IconLookupKey];
    const Icon = iconName ? (Icons as any)[iconName] : null;
    return Icon ? <Icon color="primary" sx={{ fontSize: "1" }} /> : null;
  };

  const getAllDescendantIds = (node: TreeDataType): string[] => {
    const descendants: string[] = [];
    const findDescendants = (node: TreeDataType) => {
      descendants.push(node.dropDetails?.droppedId ?? node.id);
      if (node.children) {
        node.children.forEach((child) => findDescendants(child));
      }
    };
    findDescendants(node); // Start directly with the node
    return descendants;
  };

  const findNodeById = (
    node: TreeDataType,
    id: string
  ): TreeDataType | null => {
    if (node.dropDetails?.droppedId === id) return node;
    for (const child of node.children ?? []) {
      const result = findNodeById(child, id);
      if (result) return result;
    }
    return null;
  };

  const handleSelectChange = (nodeId: string) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.includes(nodeId);
      const newSelected = new Set(prevSelected); // Using a Set for unique IDs
      const nodeData = findNodeById(data, nodeId);
      if (isSelected && nodeData) {
        // If the node is currently selected, deselect it and all its descendants
        const descendants = getAllDescendantIds(nodeData);
        descendants.forEach((id) => newSelected.delete(id));
      } else if (!isSelected && nodeData) {
        // If the node is not currently selected, select it and all its descendants
        const descendants = getAllDescendantIds(nodeData);
        descendants.forEach((id) => newSelected.add(id));
      }

      // Propagate changes up to the root
      let currentNode = findNodeById(data, nodeId);
      while (currentNode && currentNode.id !== "root") {
        const parentNode = findParentNode(data, currentNode.id);
        if (!parentNode) break;

        const children = parentNode.children || [];
        const allSelected = children.every((child) =>
          newSelected.has(child.id)
        );
        const anySelected = children.some((child) => newSelected.has(child.id));

        if (allSelected) {
          newSelected.add(parentNode.id); // All children selected, parent should be selected
        } else {
          newSelected.delete(parentNode.id); // Not all children selected, ensure parent is not selected
          if (anySelected) {
            // If any child is still selected, parent should be indeterminate; this will be handled by UI logic
          }
        }

        currentNode = parentNode; // Move up to the next parent
      }

      return Array.from(newSelected);
    });
  };

  const findParentNode = (
    node: TreeDataType,
    childId: string
  ): TreeDataType | null => {
    // This function recursively finds the parent node
    if (!node.children) return null;
    if (node.children.some((child) => child.id === childId)) {
      return node;
    }
    for (let child of node.children) {
      const possibleParent = findParentNode(child, childId);
      if (possibleParent) return possibleParent;
    }
    return null;
  };

  const isIndeterminate = (nodeId: string): boolean => {
    const nodeData = findNodeById(data, nodeId);
    if (nodeData) {
      const descendants = getAllDescendantIds(nodeData);
      const isSelectedSome = descendants.some(
        (id) => selected && selected.includes(id)
      );
      const isSelectedAll = descendants.every(
        (id) => selected && selected.includes(id)
      );
      return isSelectedSome && !isSelectedAll; // True if some but not all are selected
    }
    return false;
  };

  const renderTree = (nodes: TreeDataType) => {
    return (
      <TreeItem
        key={nodes.dropDetails?.droppedId}
        nodeId={nodes.dropDetails?.droppedId ?? nodes.id}
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* {renderIcon(nodes.icon as keyof typeof Icons)} */}

            {renderIcon(
              nodes.dropDetails?.typeCheck ? nodes.dropDetails?.typeCheck : ""
            )}
            <Checkbox
              size="small"
              checked={
                selected &&
                selected.includes(nodes.dropDetails?.droppedId ?? nodes.id)
              }
              onClick={(e) => e.stopPropagation()}
              onChange={() =>
                handleSelectChange(nodes.dropDetails?.droppedId ?? nodes.id)
              }
              indeterminate={isIndeterminate(
                nodes.dropDetails?.droppedId ?? nodes.id
              )}
              indeterminateIcon={
                <Icons.IndeterminateCheckBoxOutlined fontSize="small" />
              }
            />
            <Typography variant="body2">{nodes.title}</Typography>
          </Box>
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      aria-label="multi-select"
      defaultCollapseIcon={<span>-</span>}
      defaultExpandIcon={<span>+</span>}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      multiSelect
    >
      {renderTree(data)}
    </TreeView>
  );
};

// export const TreeSelectorTree: React.FC<TestComponentsProps> = ({ data }) => {
//   const [expanded, setExpanded] = useState<string[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);

//   console.log("selected", selected);
//   console.log("expanded", expanded);

//   const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
//     setExpanded(nodeIds); // Only manage expansion state here
//   };

//   const renderIcon = (iconName?: keyof typeof Icons) => {
//     if (!iconName) return null;
//     const Icon = Icons[iconName];
//     return Icon ? <Icon style={{ marginRight: 8 }} /> : null;
//   };

//   const getAllDescendantIds = (node: TreeDataType): string[] => {
//     const descendants: string[] = [];
//     const findDescendants = (node: TreeDataType) => {
//       descendants.push(node.id);
//       if (node.children) {
//         node.children.forEach((child) => findDescendants(child));
//       }
//     };
//     findDescendants(node); // Start directly with the node
//     return descendants;
//   };

//   const findNodeById = (
//     node: TreeDataType,
//     id: string
//   ): TreeDataType | null => {
//     if (node.id === id) return node;
//     for (const child of node.children ?? []) {
//       const result = findNodeById(child, id);
//       if (result) return result;
//     }
//     return null;
//   };

//   const handleSelectChange = (nodeId: string) => {
//     setSelected((prevSelected) => {
//       const isSelected = prevSelected.includes(nodeId);
//       const newSelected = new Set(prevSelected); // Using a Set for unique IDs
//       const nodeData = findNodeById(data, nodeId);
//       if (isSelected && nodeData) {
//         // If the node is currently selected, deselect it and all its descendants
//         const descendants = getAllDescendantIds(nodeData);
//         descendants.forEach((id) => newSelected.delete(id));
//       } else if (!isSelected && nodeData) {
//         // If the node is not currently selected, select it and all its descendants
//         const descendants = getAllDescendantIds(nodeData);
//         descendants.forEach((id) => newSelected.add(id));
//       }

//       // Propagate changes up to the root
//       let currentNode = findNodeById(data, nodeId);
//       while (currentNode && currentNode.id !== "root") {
//         const parentNode = findParentNode(data, currentNode.id);
//         if (!parentNode) break;

//         const children = parentNode.children || [];
//         const allSelected = children.every((child) =>
//           newSelected.has(child.id)
//         );
//         const anySelected = children.some((child) => newSelected.has(child.id));

//         if (allSelected) {
//           newSelected.add(parentNode.id); // All children selected, parent should be selected
//         } else {
//           newSelected.delete(parentNode.id); // Not all children selected, ensure parent is not selected
//           if (anySelected) {
//             // If any child is still selected, parent should be indeterminate; this will be handled by UI logic
//           }
//         }

//         currentNode = parentNode; // Move up to the next parent
//       }

//       return Array.from(newSelected);
//     });
//   };

//   const findParentNode = (
//     node: TreeDataType,
//     childId: string
//   ): TreeDataType | null => {
//     // This function recursively finds the parent node
//     if (!node.children) return null;
//     if (node.children.some((child) => child.id === childId)) {
//       return node;
//     }
//     for (let child of node.children) {
//       const possibleParent = findParentNode(child, childId);
//       if (possibleParent) return possibleParent;
//     }
//     return null;
//   };

//   const isIndeterminate = (nodeId: string): boolean => {
//     const nodeData = findNodeById(data, nodeId);
//     if (nodeData) {
//       const descendants = getAllDescendantIds(nodeData);
//       const isSelectedSome = descendants.some((id) => selected.includes(id));
//       const isSelectedAll = descendants.every((id) => selected.includes(id));
//       return isSelectedSome && !isSelectedAll; // True if some but not all are selected
//     }
//     return false;
//   };

//   const renderTree = (nodes: TreeDataType) => (
//     <TreeItem
//       key={nodes.id}
//       nodeId={nodes.id}
//       label={
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {renderIcon(nodes.icon as keyof typeof Icons)}
//           <Checkbox
//             size="small"
//             checked={selected.includes(nodes.id)}
//             onClick={(e) => e.stopPropagation()} // Prevent TreeItem from toggling
//             onChange={() => handleSelectChange(nodes.id)}
//             indeterminate={isIndeterminate(nodes.id)}
//             indeterminateIcon={
//               <Icons.IndeterminateCheckBoxOutlined fontSize="small" />
//             }
//           />
//           <Typography variant="body2">{nodes.name}</Typography>
//         </Box>
//       }
//     >
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => renderTree(node))
//         : null}
//     </TreeItem>
//   );

//   return (
//     <TreeView
//       aria-label="multi-select"
//       defaultCollapseIcon={<span>-</span>}
//       defaultExpandIcon={<span>+</span>}
//       expanded={expanded}
//       selected={selected}
//       onNodeToggle={handleToggle}
//       multiSelect
//     >
//       {renderTree(data)}
//     </TreeView>
//   );
// };
