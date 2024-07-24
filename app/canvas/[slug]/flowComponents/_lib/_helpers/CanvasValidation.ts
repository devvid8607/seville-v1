import { Node, getIncomers, getOutgoers } from "reactflow";
import { useFlowNodeStore } from "../_store/FlowNodeStore";
import { useNodeStructureStore } from "../_store/FlowNodeStructureStore";
import { NodeStructureInput } from "../_types/SevilleSchema";
import {
  AnyValueModelType,
  ComplexValueType,
  isComplexValueType,
} from "../_types/ValueTypes";

import { checkTypeOfInputItems } from "../../../_lib/_inputs/newDroppable/SevilleNewDroppableInput";

export const updatePathOfAllNodes = () => {
  const nodes = useFlowNodeStore.getState().nodes; //gets a current snapshot
  const edges = useFlowNodeStore.getState().edges;
  const nodesStructures = useNodeStructureStore.getState().nodeStructures;

  console.log("nodestruc after clearing", nodesStructures);

  nodesStructures.forEach((nodeStruct) => {
    useNodeStructureStore.getState().updateNodeStructure(nodeStruct.nodeId, {
      path: [[nodeStruct.nodeId]],
    });
  });

  const nodesWithNoIncomers = nodes.filter((node) => {
    const incomers = getIncomers(node, nodes, edges);
    console.log("incomers");
    console.log(incomers);
    return incomers.length === 0;
  });

  console.log("nodes with no incoming edge", nodesWithNoIncomers);

  //so this will be once the no incomers
  nodesWithNoIncomers.forEach((nodeFromFlowStore) => {
    if (nodeFromFlowStore) updatePathRecursively(nodeFromFlowStore);
  });
  validateAllNodes();
};

const updatePathRecursively = (nodeFromFlowStore: Node) => {
  const nodes = useFlowNodeStore.getState().nodes; //gets a current snapshot
  const edges = useFlowNodeStore.getState().edges;
  console.log("incoming node :", nodeFromFlowStore.id);
  const outgoers = getOutgoers(nodeFromFlowStore, nodes, edges);
  console.log("outgoers of :", nodeFromFlowStore.id, " found ", outgoers);
  const nodesStructures = useNodeStructureStore.getState().nodeStructures;

  const currentNodeStruct = nodesStructures.find(
    (ns) => ns.nodeId === nodeFromFlowStore.id
  );
  //if there are outgoers
  if (outgoers && outgoers.length > 0 && currentNodeStruct) {
    console.log("inital path of incoming node ", currentNodeStruct.path);
    outgoers.forEach((outgoer) => {
      const outgoerStruct = nodesStructures.find(
        (ns) => ns.nodeId === outgoer.id
      );

      if (outgoerStruct) {
        let newPath: string[][] = [];
        currentNodeStruct.path.forEach((pathObj) => {
          console.log("pathObj", pathObj);
          const updatedPathObj = [...pathObj, outgoer.id];
          newPath.push(updatedPathObj);
          console.log("Updated pathObj:", updatedPathObj);
        });
        console.log(outgoerStruct.path);
        const existingPaths =
          outgoerStruct && outgoerStruct.path
            ? outgoerStruct.path.filter(
                (p) => !(p.length === 1 && p[0] === outgoer.id)
              )
            : [];

        const uniqueNewPaths = newPath.filter(
          (newPath) =>
            !existingPaths.some(
              (existingPath) =>
                existingPath.length === newPath.length &&
                existingPath.every((value, index) => value === newPath[index])
            )
        );
        const updatedPaths = [...existingPaths, ...uniqueNewPaths];
        useNodeStructureStore
          .getState()
          .updateNodeStructure(outgoerStruct.nodeId, {
            path: updatedPaths,
          });
        console.log("final path of outgoer node ", updatedPaths);
      }
      updatePathRecursively(outgoer);
    });
  } else {
    //this node has no outgoer
    //if this node has no incomer as well which means its a node with no edges and reset it to initial value
    const incomers = getIncomers(nodeFromFlowStore, nodes, edges);
    if (incomers.length === 0 && currentNodeStruct) {
      useNodeStructureStore
        .getState()
        .updateNodeStructure(currentNodeStruct.nodeId, {
          path: [[currentNodeStruct.nodeId]],
        });
    }
  }
};

export const validateAllNodes = () => {
  const nodesStructures = useNodeStructureStore.getState().nodeStructures;
  console.log("nodesstruct in validate", nodesStructures);
  if (nodesStructures && nodesStructures.length > 0) {
    nodesStructures.forEach((nodesStructure) => {
      validateNode(nodesStructure.nodeId);
    });
  }
};

export const validateNode = (nodeIdToBeValidated: string) => {
  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  if (
    nodeToBeValidatedStructure &&
    nodeToBeValidatedStructure.inputs.length > 0
  ) {
    console.log("node to be validated: ", nodeToBeValidatedStructure);
    const inputsToBeValidated = nodeToBeValidatedStructure.inputs;

    inputsToBeValidated.forEach((input) => {
      validateInput(nodeIdToBeValidated, input);
    });
  }
};

const validateInput = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput
  // pathToBeValidatedAgainst: string[][]
) => {
  // if (input.type !== "droppable") return;
  console.log("in validate input", input);

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  let pathToBeValidatedAgainst: string[][];
  if (nodeToBeValidatedStructure) {
    pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;
    console.log("in update inp on node del");
    console.log(input.values);

    if (Array.isArray(input.values)) {
      console.log("is array");
      const hasRequiredStructure = input.values.every(
        (item) =>
          item.hasOwnProperty("condition") && item.hasOwnProperty("logic")
      );

      const hasNestedValueArray = input.values.some(
        (item: ComplexValueType) =>
          item.hasOwnProperty("values") && Array.isArray(item.values)
      );

      if (hasRequiredStructure) {
        updateIfInputGroupValue(nodeIdToBeValidated, input);
      }
      if (hasNestedValueArray) {
        input.values.forEach((nestedValue: ComplexValueType) => {
          console.log("hasNestedValueArray", hasNestedValueArray);
          console.log("nestedValue", nestedValue);
          if (
            Array.isArray(nestedValue.values) &&
            nestedValue.values.length > 0
          )
            setItemError(nodeIdToBeValidated, input.id, nestedValue.values);
        });
      }
      {
        setItemError(nodeIdToBeValidated, input.id, input.values);
      }
    }

    if (
      input.type === "iteratorInputGroup" &&
      typeof input.values === "object"
    ) {
      console.log("is iteratorInputGroup");
      updateIteratorInputGroupValue(nodeIdToBeValidated, input);
    }
  }
};

const updateIteratorInputGroupValue = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput
) => {
  const valueArray = input.values;
  console.log("in iterator:", valueArray);
  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  if (!nodeToBeValidatedStructure || !valueArray) {
    console.log("No node structure found or value array is empty");
    return;
  }
  console.log("node to be validated in iterator", nodeToBeValidatedStructure);

  let pathToBeValidatedAgainst: string[][];
  let finalUpdatedInputs = nodeToBeValidatedStructure.inputs;

  console.log("in here", valueArray);
  valueArray.forEach((value) => {
    console.log(value);
    Object.keys(value).forEach((key) => {
      console.log("key:", key);
      const baseInputValueArray = value[key];
      console.log("val", baseInputValueArray);
      pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;
      if (
        Array.isArray(baseInputValueArray) &&
        baseInputValueArray.length > 0
      ) {
        baseInputValueArray.map((eachInputValue) => {
          if (eachInputValue.doPreviousOutputCheck) {
            // if (eachInputValue.source === "nodeOutputs") {
            console.log("hljljlk", pathToBeValidatedAgainst);

            const validatePathOfInputs = () => {
              return pathToBeValidatedAgainst.some((path) => {
                const inputIndex = path.indexOf(eachInputValue.id.toString());
                const nodeIndex = path.indexOf(nodeIdToBeValidated);
                console.log("inputIndex:", inputIndex);
                console.log("nodeIndex:", nodeIndex);

                if (
                  inputIndex !== -1 &&
                  nodeIndex !== -1 &&
                  inputIndex < nodeIndex
                )
                  return false;
                else return true;
              });
            };

            const isValidInput = validatePathOfInputs();
            console.log("iterator input valid:", isValidInput);

            const updateIteratorInputValueWithError = (errorVal: boolean) => {
              console.log("error value", errorVal);

              finalUpdatedInputs = finalUpdatedInputs.map((inp) => {
                if (inp.id === input.id) {
                  // Map over inp.values and update the necessary items
                  const updatedValues = inp.values.map((value) => {
                    // Object to hold the updated value properties
                    let updatedValue = {};

                    // Iterate over each key in the value object
                    Object.keys(value).forEach((key) => {
                      // Check if the property is an array and proceed
                      if (Array.isArray(value[key])) {
                        updatedValue[key] = value[key].map((innerItem) => {
                          // Check for a matching ID and update the error property if needed
                          if (innerItem.id === eachInputValue.id) {
                            return { ...innerItem, error: errorVal };
                          }
                          return innerItem;
                        });
                      } else {
                        // For non-array properties, just copy them over
                        updatedValue[key] = value[key];
                      }
                    });

                    return updatedValue;
                  });

                  return { ...inp, values: updatedValues };
                } else {
                  return inp; // Leave other inputs unchanged
                }
              });
              console.log("updated input", finalUpdatedInputs);
              return finalUpdatedInputs;
            };

            console.log("pls work");
            console.log(updateIteratorInputValueWithError(isValidInput));
            const finalValueToBeUpdated =
              updateIteratorInputValueWithError(isValidInput);
            if (finalValueToBeUpdated) {
              useNodeStructureStore
                .getState()
                .updateNodeStructure(nodeIdToBeValidated, {
                  inputs: finalValueToBeUpdated,
                });
            }
          }
        });
      }
    });
  });
};

const updateIfInputGroupValue = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput
) => {
  const valueArray = input.values;
  console.log("in if:", valueArray);

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  let pathToBeValidatedAgainst: string[][];
  let pathOfParents: string[][] = [];
  if (
    nodeToBeValidatedStructure?.parentIteratorNode &&
    nodeToBeValidatedStructure.parentIteratorNode !== ""
  ) {
    console.log("there is a parent");
    const parentNode = nodeStructures.find(
      (nodeStructure) =>
        nodeStructure.nodeId === nodeToBeValidatedStructure.parentIteratorNode
    );
    if (parentNode) pathOfParents = parentNode.path;
    else pathOfParents = [];
  }
  console.log("pathofParents", pathOfParents);

  if (nodeToBeValidatedStructure && valueArray.length > 0) {
    //pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;
    // console.log("path:", pathToBeValidatedAgainst);
    const pathChildren = nodeToBeValidatedStructure.path;
    console.log("pathchildren", pathChildren);

    const combinedPaths = pathOfParents.flatMap((pathParent) =>
      pathChildren.map((pathChild) => pathParent.concat(pathChild))
    );

    console.log("path after:", combinedPaths);
    if (Array.isArray(combinedPaths) && combinedPaths.length > 0)
      pathToBeValidatedAgainst = combinedPaths;
    else pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;

    console.log("final path to be checked:", pathToBeValidatedAgainst);

    let isInputValueValidValue1: boolean = true;
    let isInputValueValidValue2: boolean = true;

    valueArray.map((conditionObj: any) => {
      console.log("evaluating condition", conditionObj);

      if (conditionObj) {
        // conditionObj.conditions.map((condition: any) => {
        console.log("condition ", conditionObj);

        const validatePathOfInputs = (valueID: string) => {
          console.log("validating valueid:", valueID);
          return pathToBeValidatedAgainst.some((path) => {
            const inputIndex = path.indexOf(valueID);
            const nodeIndex = path.indexOf(nodeIdToBeValidated);
            console.log("inputIndex:", inputIndex);
            console.log("nodeIndex:", nodeIndex);

            if (inputIndex !== -1 && nodeIndex !== -1 && inputIndex < nodeIndex)
              return true;
            else return false;
          });
        };

        if (Array.isArray(conditionObj.valueOne)) {
          conditionObj.valueOne.map((valueOneObj: any) => {
            if (valueOneObj.doPreviousOutputCheck)
              isInputValueValidValue1 = validatePathOfInputs(valueOneObj.id);
            else isInputValueValidValue1 = !valueOneObj.error;
          });

          console.log("isInputValueValidValue1 is ", isInputValueValidValue1);
        }

        if (Array.isArray(conditionObj.valueTwo)) {
          conditionObj.valueTwo.map((valueTwoObj: any) => {
            if (valueTwoObj.doPreviousOutputCheck)
              isInputValueValidValue2 = validatePathOfInputs(valueTwoObj.id);
            else isInputValueValidValue2 = !valueTwoObj.error;
          });
          console.log("isInputValueValidValue2 is ", isInputValueValidValue2);
        }

        const updateIfInputValueWithError = (
          errorVal: boolean,
          conditionValueItem: string
        ) => {
          const updatedInputs = nodeToBeValidatedStructure.inputs.map((inp) => {
            if (inp.id === input.id) {
              console.log("input is ok");
              const updatedValue = inp.values.map((valueItem: any) => {
                if (valueItem.id === conditionObj.id) {
                  console.log("condition ok");
                  if (
                    valueItem.hasOwnProperty("valueOne") &&
                    valueItem.hasOwnProperty("valueTwo")
                  ) {
                    console.log("condition 2 ok", valueItem);

                    if (conditionValueItem === "valueOne") {
                      if (
                        Array.isArray(conditionObj.valueOne) &&
                        conditionObj.valueOne.length > 0
                      ) {
                        // Update the error property of the first element in value1
                        // conditionObj.valueOne = {
                        //   ...conditionObj.valueOne,
                        //   error: errorVal,
                        // };
                        conditionObj.valueOne = conditionObj.valueOne.map(
                          (item) => ({
                            ...item,
                            error: errorVal,
                          })
                        );
                      }
                    } else {
                      if (
                        Array.isArray(conditionObj.valueTwo) &&
                        conditionObj.valueTwo.length > 0
                      ) {
                        // Update the error property of the first element in value1

                        conditionObj.valueTwo = conditionObj.valueTwo.map(
                          (item) => ({
                            ...item,
                            error: errorVal,
                          })
                        );
                      }
                    }

                    return valueItem;
                  } else {
                    return valueItem;
                  }
                } else {
                  return valueItem;
                }
              });
              return { ...inp, value: updatedValue };
            } else return inp;
          });
          return updatedInputs;
        };
        let finalInputValueToBeUpdated1;
        if (isInputValueValidValue1) {
          finalInputValueToBeUpdated1 = updateIfInputValueWithError(
            false,
            "valueOne"
          );
        } else {
          finalInputValueToBeUpdated1 = updateIfInputValueWithError(
            true,
            "valueOne"
          );
        }

        let finalInputValueToBeUpdated2;
        if (isInputValueValidValue2) {
          finalInputValueToBeUpdated2 = updateIfInputValueWithError(
            false,
            "valueTwo"
          );
        } else {
          finalInputValueToBeUpdated2 = updateIfInputValueWithError(
            true,
            "valueTwo"
          );
        }
        console.log("final if values");
        console.log(finalInputValueToBeUpdated1);
        console.log(finalInputValueToBeUpdated2);
        if (finalInputValueToBeUpdated1) {
          useNodeStructureStore
            .getState()
            .updateNodeStructure(nodeIdToBeValidated, {
              inputs: finalInputValueToBeUpdated1,
            });
        }
        if (finalInputValueToBeUpdated2) {
          useNodeStructureStore
            .getState()
            .updateNodeStructure(nodeIdToBeValidated, {
              inputs: finalInputValueToBeUpdated2,
            });
        }
        // });
      }
    });
  }
};

const setItemError = (
  nodeIdToBeValidated: string,
  inputId: number,
  valuesArray: AnyValueModelType[]
) => {
  console.log(" in set item fn", valuesArray);

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  let pathToBeValidatedAgainst: string[][];
  let pathOfParents: string[][] = [];
  if (
    nodeToBeValidatedStructure?.parentIteratorNode &&
    nodeToBeValidatedStructure.parentIteratorNode !== ""
  ) {
    console.log("there is a parent");
    const parentNode = nodeStructures.find(
      (nodeStructure) =>
        nodeStructure.nodeId === nodeToBeValidatedStructure.parentIteratorNode
    );
    if (parentNode) pathOfParents = parentNode.path;
    else pathOfParents = [];
  }

  console.log("pathofParents", pathOfParents);

  if (nodeToBeValidatedStructure) {
    // pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;
    const pathChildren = nodeToBeValidatedStructure.path;
    console.log("pathchildren", pathChildren);

    const combinedPaths = pathOfParents.flatMap((pathParent) =>
      pathChildren.map((pathChild) => pathParent.concat(pathChild))
    );

    console.log("path after:", combinedPaths);
    if (Array.isArray(combinedPaths) && combinedPaths.length > 0)
      pathToBeValidatedAgainst = combinedPaths;
    else pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;

    console.log("final path to be checked:", pathToBeValidatedAgainst);

    console.log("valuearray:", valuesArray);

    const resultOfTypeCheck = checkTypeOfInputItems(valuesArray);

    if (resultOfTypeCheck.isComplexType) {
      valuesArray.forEach((eachInputValue: AnyValueModelType) => {
        // if (
        //   "source" in eachInputValue &&
        //   eachInputValue.source === "nodeOutputs"
        // ) {
        if (
          isComplexValueType(eachInputValue) &&
          !eachInputValue.doPreviousOutputCheck
        )
          return;

        console.log("in setItemError");
        console.log(eachInputValue);
        console.log(pathToBeValidatedAgainst);

        const validatePathOfInputs = () => {
          return pathToBeValidatedAgainst.some((path) => {
            let inputIndex;
            if (eachInputValue.id)
              inputIndex = path.indexOf(eachInputValue.id.toString());
            const nodeIndex = path.indexOf(nodeIdToBeValidated);
            console.log("inputIndex:", inputIndex);
            console.log("nodeIndex:", nodeIndex);

            if (
              inputIndex !== -1 &&
              nodeIndex !== -1 &&
              inputIndex !== undefined &&
              inputIndex < nodeIndex
            )
              return false;
            else return true;
          });
        };

        const isInputValueValid = validatePathOfInputs();
        console.log("is input valid ", isInputValueValid);

        const finalInputValueToBeUpdated = updateNodeInputsWithErrorValue(
          nodeIdToBeValidated,
          inputId,
          eachInputValue.id,
          isInputValueValid
        );

        console.log("final value", finalInputValueToBeUpdated);
        if (finalInputValueToBeUpdated) {
          useNodeStructureStore
            .getState()
            .updateNodeStructure(nodeIdToBeValidated, {
              inputs: finalInputValueToBeUpdated,
            });
        }
        // }
      });
    }
  }
};

const updateNodeInputsWithErrorValue = (
  nodeIdToBeValidated: string,
  inputId: number,
  inputValueId: string | number | undefined,
  isInputValueValid: boolean
) => {
  console.log("in updateNodeInputsWithErrorValue");

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  if (nodeToBeValidatedStructure) {
    const updatedInputs = nodeToBeValidatedStructure.inputs.map((inp) => {
      if (inp.id === inputId) {
        // Assuming inp.value is an array of objects
        const updatedValue = inp.values.map((valueItem: ComplexValueType) => {
          if (valueItem.values === null && valueItem.id === inputValueId) {
            console.log("id mapped", valueItem);
            return {
              ...valueItem,
              error: isInputValueValid, // Set the error property
            };
          } else if (valueItem.values !== null) {
            console.log("values not null", valueItem.values);
            return {
              ...valueItem,
              values: valueItem.values.map((nestedValueItem) => {
                if (nestedValueItem.id && nestedValueItem.id === inputValueId) {
                  console.log("nestedValueItem updated with error");
                  return {
                    ...nestedValueItem,
                    error: isInputValueValid, // Set the error property
                  };
                } else {
                  return nestedValueItem;
                }
              }),
            };
          } else {
            return valueItem; // Leave other value items unchanged
          }
        });
        return {
          ...inp,
          values: updatedValue,
        };
      } else {
        return inp; // Leave other inputs unchanged
      }
    });
    return updatedInputs;
  }
};

export const testfn = (
  nodeIdToBeValidated: string,
  inputId: number,
  inputValueId: string | number | undefined,
  isInputValueValid: any
) => {
  const finalInputValueToBeUpdated = updateNodeInputsWithSelectorValue(
    nodeIdToBeValidated,
    inputId,
    inputValueId,
    isInputValueValid
  );
  if (finalInputValueToBeUpdated) {
    useNodeStructureStore.getState().updateNodeStructure(nodeIdToBeValidated, {
      inputs: finalInputValueToBeUpdated,
    });
  }
};

export const updateNodeInputsWithSelectorValue = (
  nodeIdToBeValidated: string,
  inputId: number,
  inputValueId: string | number | undefined,
  isInputValueValid: any
) => {
  console.log(
    "in updateNodeInputsWithSelectorValue",
    nodeIdToBeValidated,
    inputId,
    inputValueId,
    isInputValueValid
  );

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  if (nodeToBeValidatedStructure) {
    const updatedInputs = nodeToBeValidatedStructure.inputs.map((inp) => {
      if (inp.id === inputId) {
        // Assuming inp.value is an array of objects
        const updatedValue = inp.values.map((valueItem: ComplexValueType) => {
          if (valueItem.values === null && valueItem.id === inputValueId) {
            console.log("id mapped", valueItem);
            return {
              ...valueItem,
              selector: isInputValueValid, // Set the error property
            };
          } else if (valueItem.values !== null) {
            console.log("values not null", valueItem.values);
            return {
              ...valueItem,
              values: valueItem.values.map((nestedValueItem) => {
                if (nestedValueItem.id && nestedValueItem.id === inputValueId) {
                  console.log("nestedValueItem updated with error");
                  return {
                    ...nestedValueItem,
                    selector: isInputValueValid, // Set the error property
                  };
                } else {
                  return nestedValueItem;
                }
              }),
            };
          } else {
            return valueItem; // Leave other value items unchanged
          }
        });
        return {
          ...inp,
          values: updatedValue,
        };
      } else {
        return inp; // Leave other inputs unchanged
      }
    });
    return updatedInputs;
  }
};

export const validateAllNodesModelInputs = (inputModelId: string) => {
  const nodesStructures = useNodeStructureStore.getState().nodeStructures;
  console.log("nodesstruct in validate", nodesStructures);
  if (nodesStructures && nodesStructures.length > 0) {
    nodesStructures.forEach((nodesStructure) => {
      validateAllNodesModelInput(nodesStructure.nodeId, inputModelId);
    });
  }
};

export const validateAllNodesModelInput = (
  nodeIdToBeValidated: string,
  inputModelId: string
) => {
  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  if (
    nodeToBeValidatedStructure &&
    nodeToBeValidatedStructure.inputs.length > 0
  ) {
    console.log("node to be validated: ", nodeToBeValidatedStructure);
    const inputsToBeValidated = nodeToBeValidatedStructure.inputs;

    inputsToBeValidated.forEach((input) => {
      validateModelInput(nodeIdToBeValidated, input, inputModelId);
    });
  }
};

const validateModelInput = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput,
  inputModelId: string
) => {
  console.log("in validate model input", input);

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  if (nodeToBeValidatedStructure) {
    // pathToBeValidatedAgainst = nodeToBeValidatedStructure.path;
    console.log("in update inp on node del");
    console.log(input.values);

    if (Array.isArray(input.values)) {
      console.log("is array");
      const hasRequiredStructure = input.values.every(
        (item) =>
          item.hasOwnProperty("condition") && item.hasOwnProperty("logic")
      );

      const hasNestedValueArray = input.values.some(
        (item: ComplexValueType) =>
          item.hasOwnProperty("values") && Array.isArray(item.values)
      );

      if (hasRequiredStructure) {
        console.log("has required struct");
        //need to change this fn
        updateIfInputGroupValueForModelInput(
          nodeIdToBeValidated,
          input,
          inputModelId
        );
      }
      if (hasNestedValueArray) {
        input.values.forEach((nestedValue: ComplexValueType) => {
          console.log("hasNestedValueArray", hasNestedValueArray);
          console.log("nestedValue", nestedValue);
          if (
            Array.isArray(nestedValue.values) &&
            nestedValue.values.length > 0
          )
            setModelInputError(
              nodeIdToBeValidated,
              input.id,
              nestedValue.values,
              inputModelId
            );
        });
      }
      {
        setModelInputError(
          nodeIdToBeValidated,
          input.id,
          input.values,
          inputModelId
        );
      }
    }

    if (
      input.type === "iteratorInputGroup" &&
      typeof input.values === "object"
    ) {
      console.log("is iteratorInputGroup");
      //need to change this
      updateIteratorInputGroupValueForModelInput(
        nodeIdToBeValidated,
        input,
        inputModelId
      );
    }
  }
};

const updateIteratorInputGroupValueForModelInput = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput,
  inputModelId: string
) => {
  const valueArray = input.values;
  console.log("in iterator:-model", valueArray);
  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  if (!nodeToBeValidatedStructure || !valueArray) {
    console.log("No node structure found or value array is empty");
    return;
  }
  console.log(
    "node to be validated in iterator-model",
    nodeToBeValidatedStructure
  );

  let finalUpdatedInputs = nodeToBeValidatedStructure.inputs;

  console.log("in here-model", valueArray);
  valueArray.forEach((value) => {
    console.log(value);
    Object.keys(value).forEach((key) => {
      console.log("key:", key);
      const baseInputValueArray = value[key];
      console.log("val", baseInputValueArray);

      if (
        Array.isArray(baseInputValueArray) &&
        baseInputValueArray.length > 0
      ) {
        baseInputValueArray.map((eachInputValue) => {
          // if (eachInputValue.source === "nodeOutputs") {

          if (eachInputValue.doInputModelCheck) {
            const isValidInput =
              !eachInputValue.droppedId.startsWith(inputModelId);
            console.log("iterator input valid:-model", isValidInput);

            const updateIteratorInputValueWithError = (errorVal: boolean) => {
              console.log("error value", errorVal);

              finalUpdatedInputs = finalUpdatedInputs.map((inp) => {
                if (inp.id === input.id) {
                  // Map over inp.values and update the necessary items
                  const updatedValues = inp.values.map((value) => {
                    // Object to hold the updated value properties
                    let updatedValue = {};

                    // Iterate over each key in the value object
                    Object.keys(value).forEach((key) => {
                      // Check if the property is an array and proceed
                      if (Array.isArray(value[key])) {
                        updatedValue[key] = value[key].map((innerItem) => {
                          // Check for a matching ID and update the error property if needed
                          if (innerItem.id === eachInputValue.id) {
                            return { ...innerItem, error: errorVal };
                          }
                          return innerItem;
                        });
                      } else {
                        // For non-array properties, just copy them over
                        updatedValue[key] = value[key];
                      }
                    });

                    return updatedValue;
                  });

                  return { ...inp, values: updatedValues };
                } else {
                  return inp; // Leave other inputs unchanged
                }
              });
              console.log("updated input", finalUpdatedInputs);
              return finalUpdatedInputs;
            };

            console.log("pls work");
            console.log(updateIteratorInputValueWithError(isValidInput));
            const finalValueToBeUpdated =
              updateIteratorInputValueWithError(isValidInput);
            if (finalValueToBeUpdated) {
              useNodeStructureStore
                .getState()
                .updateNodeStructure(nodeIdToBeValidated, {
                  inputs: finalValueToBeUpdated,
                });
            }
          }
        });
      }
    });
  });
};

const updateNodeModelInputsWithErrorValue = (
  nodeIdToBeValidated: string,
  inputId: number,
  inputValueId: string | number | undefined,
  isInputValueValid: boolean
) => {
  console.log("in updateNodeModelInputsWithErrorValue");

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );
  if (nodeToBeValidatedStructure) {
    const updatedInputs = nodeToBeValidatedStructure.inputs.map((inp) => {
      if (inp.id === inputId) {
        // Assuming inp.value is an array of objects
        const updatedValue = inp.values.map((valueItem: ComplexValueType) => {
          if (valueItem.values === null && valueItem.id === inputValueId) {
            console.log("id mapped", valueItem);
            return {
              ...valueItem,
              error: isInputValueValid, // Set the error property
            };
          } else if (valueItem.values !== null) {
            console.log("values not null", valueItem.values);
            return {
              ...valueItem,
              values: valueItem.values.map((nestedValueItem) => {
                if (nestedValueItem.id && nestedValueItem.id === inputValueId) {
                  console.log("nestedValueItem updated with error");
                  return {
                    ...nestedValueItem,
                    error: isInputValueValid, // Set the error property
                  };
                } else {
                  return nestedValueItem;
                }
              }),
            };
          } else {
            return valueItem; // Leave other value items unchanged
          }
        });
        return {
          ...inp,
          values: updatedValue,
        };
      } else {
        return inp; // Leave other inputs unchanged
      }
    });
    return updatedInputs;
  }
};

const setModelInputError = (
  nodeIdToBeValidated: string,
  inputId: number,
  valuesArray: AnyValueModelType[],
  inputModelId: string
) => {
  console.log(" in set model input item fn", valuesArray, inputModelId);

  // const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  // const nodeToBeValidatedStructure = nodeStructures.find(
  //   (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  // );

  valuesArray.forEach((eachInputValue: AnyValueModelType) => {
    console.log("each value in model input", eachInputValue);

    if (
      isComplexValueType(eachInputValue) &&
      eachInputValue.doInputModelCheck &&
      eachInputValue.droppedId.startsWith(inputModelId)
    ) {
      const finalInputValueToBeUpdated = updateNodeModelInputsWithErrorValue(
        nodeIdToBeValidated,
        inputId,
        eachInputValue.id,
        false
      );
      console.log("final value", finalInputValueToBeUpdated);
      if (finalInputValueToBeUpdated) {
        useNodeStructureStore
          .getState()
          .updateNodeStructure(nodeIdToBeValidated, {
            inputs: finalInputValueToBeUpdated,
          });
      }
    } else if (
      isComplexValueType(eachInputValue) &&
      eachInputValue.doInputModelCheck &&
      !eachInputValue.droppedId.startsWith(inputModelId)
    ) {
      console.log(
        "Full ID does not start with " + inputModelId + ": ",
        eachInputValue
      );
      const finalInputValueToBeUpdated = updateNodeInputsWithErrorValue(
        nodeIdToBeValidated,
        inputId,
        eachInputValue.id,
        true
      );
      console.log("final value", finalInputValueToBeUpdated);
      if (finalInputValueToBeUpdated) {
        useNodeStructureStore
          .getState()
          .updateNodeStructure(nodeIdToBeValidated, {
            inputs: finalInputValueToBeUpdated,
          });
      }
    }
  });
};

const updateIfInputGroupValueForModelInput = (
  nodeIdToBeValidated: string,
  input: NodeStructureInput,
  inputModelId: string
) => {
  const valueArray = input.values;
  console.log("in if-model:", valueArray);

  const nodeStructures = useNodeStructureStore.getState().nodeStructures;

  const nodeToBeValidatedStructure = nodeStructures.find(
    (nodeStructure) => nodeStructure.nodeId === nodeIdToBeValidated
  );

  if (nodeToBeValidatedStructure && valueArray.length > 0) {
    let isInputValueValidValue1: boolean = true;
    let isInputValueValidValue2: boolean = true;

    valueArray.map((conditionObj: any) => {
      console.log("evaluating condition - model", conditionObj);

      if (conditionObj) {
        console.log("condition ", conditionObj);

        if (
          Array.isArray(conditionObj.valueOne) &&
          conditionObj.valueOne.length > 0
        ) {
          conditionObj.valueOne.map((valueOneObj: any) => {
            console.log(
              valueOneObj.doInputModelCheck,
              valueOneObj.droppedId,
              inputModelId
            );
            if (
              valueOneObj.doInputModelCheck &&
              valueOneObj.droppedId.startsWith(inputModelId)
            ) {
              console.log("flow one");
              isInputValueValidValue1 = true;
            } else if (
              valueOneObj.doInputModelCheck &&
              !valueOneObj.droppedId.startsWith(inputModelId)
            ) {
              console.log("flow two");
              isInputValueValidValue1 = false;
            }
          });

          console.log(
            "isInputValueValidValue1 is - model",
            isInputValueValidValue1
          );
        }

        if (
          Array.isArray(conditionObj.valueTwo) &&
          conditionObj.valueTwo.length > 0
        ) {
          conditionObj.valueTwo.map((valueTwoObj: any) => {
            if (
              valueTwoObj.doInputModelCheck &&
              valueTwoObj.droppedId.startsWith(inputModelId)
            ) {
              isInputValueValidValue2 = true;
            } else if (
              valueTwoObj.doInputModelCheck &&
              !valueTwoObj.droppedId.startsWith(inputModelId)
            ) {
              isInputValueValidValue2 = false;
            }
          });
          console.log(
            "isInputValueValidValue2 is - model",
            isInputValueValidValue2
          );
        }

        const updateIfInputValueWithError = (
          errorVal: boolean,
          conditionValueItem: string
        ) => {
          const updatedInputs = nodeToBeValidatedStructure.inputs.map((inp) => {
            if (inp.id === input.id) {
              console.log("input is ok");
              const updatedValue = inp.values.map((valueItem: any) => {
                if (valueItem.id === conditionObj.id) {
                  console.log("condition ok");
                  if (
                    valueItem.hasOwnProperty("valueOne") &&
                    valueItem.hasOwnProperty("valueTwo")
                  ) {
                    console.log("condition 2 ok", valueItem);

                    if (conditionValueItem === "valueOne") {
                      if (
                        Array.isArray(conditionObj.valueOne) &&
                        conditionObj.valueOne.length > 0
                      ) {
                        conditionObj.valueOne = conditionObj.valueOne.map(
                          (item) => ({
                            ...item,
                            error: errorVal,
                          })
                        );
                      }
                    } else {
                      if (
                        Array.isArray(conditionObj.valueTwo) &&
                        conditionObj.valueTwo.length > 0
                      ) {
                        // Update the error property of the first element in value1

                        conditionObj.valueTwo = conditionObj.valueTwo.map(
                          (item) => ({
                            ...item,
                            error: errorVal,
                          })
                        );
                      }
                    }

                    return valueItem;
                  } else {
                    return valueItem;
                  }
                } else {
                  return valueItem;
                }
              });
              return { ...inp, value: updatedValue };
            } else return inp;
          });
          return updatedInputs;
        };
        let finalInputValueToBeUpdated1;

        finalInputValueToBeUpdated1 = updateIfInputValueWithError(
          !isInputValueValidValue1,
          "valueOne"
        );

        let finalInputValueToBeUpdated2;

        finalInputValueToBeUpdated2 = updateIfInputValueWithError(
          !isInputValueValidValue2,
          "valueTwo"
        );

        console.log("final if values - model");
        console.log(finalInputValueToBeUpdated1);
        console.log(finalInputValueToBeUpdated2);
        if (finalInputValueToBeUpdated1) {
          useNodeStructureStore
            .getState()
            .updateNodeStructure(nodeIdToBeValidated, {
              inputs: finalInputValueToBeUpdated1,
            });
        }
        if (finalInputValueToBeUpdated2) {
          useNodeStructureStore
            .getState()
            .updateNodeStructure(nodeIdToBeValidated, {
              inputs: finalInputValueToBeUpdated2,
            });
        }
      }
    });
  }
};
