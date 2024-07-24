import { useMemo } from "react";
import { XYPosition } from "reactflow";
import useFlowBackendStore from "../../flowComponents/_lib/_store/FlowBackEndStore";
import { Input, Schema } from "../../flowComponents/_lib/_types/SevilleSchema";

export const useNodeConstructor = (
  schemaId: string,
  newNodeId: string,
  position: XYPosition,
  incomingInputs: any[],
  incomingOutputs: any[],
  userProvidedName?: string,
  parentNode?: string
) => {
  //console.log(userProvidedName);
  const { schemas } = useFlowBackendStore((state) => state);
  const nodeStructure = useMemo(() => {
    const schema = schemas.find((s) => s.schemaId === schemaId);
    if (!schema) {
      console.error("Schema not found:", schemaId);
      return null;
    }

    const mergeInputs = (schemaInputs: Input[], incomingInputs: any[]) => {
      if (!schemaInputs || schemaInputs.length === 0) {
        return [];
      }
      return schemaInputs.map((inputSchema) => {
        const { config, ...restInputSchema } = inputSchema;
        const incomingInput = incomingInputs?.find(
          (input) => input.id === inputSchema.id
        );
        console.log(inputSchema);

        return {
          ...restInputSchema,
          ...config,
          parentNodeId: newNodeId,
          value: incomingInput ? incomingInput.value : [],
          values: incomingInput ? incomingInput.values : [],
        };
      });
    };

    const modifyOutputs = (schema: Schema, newNodeId: string) => {
      // Check if schema or schema.outputs is null, undefined, or empty
      if (!schema || !schema.outputs || schema.outputs.length === 0) {
        return [];
      }

      return schema.outputs.map((output) => ({
        ...output,
        parentNodeId: newNodeId, // Assuming newNodeId is a valid value
        name: output.name, // This line seems redundant as ...output already includes name
      }));
    };

    return {
      nodeId: newNodeId,
      path: [[newNodeId]],
      schemaId: schema.schemaId,
      helpText: schema.helpText,
      description: schema.description,
      icon: schema.icon,
      name: schema.name,
      headerColor: schema.headerColor,
      subType: schema.subType ? schema.subType : null,
      userProvidedName: userProvidedName || schema.userProvidedName,
      position: position,
      options: schema.options ? schema.options : null,
      parentIteratorNode: parentNode ? parentNode : null,
      defaultNodes: schema.defaultNodes,
      inputs: mergeInputs(schema.inputs, incomingInputs),
      outputs: modifyOutputs(schema, newNodeId),
    };
  }, [schemaId, newNodeId, schemas]);
  return nodeStructure;
};

// export default useNodeConstructor;
