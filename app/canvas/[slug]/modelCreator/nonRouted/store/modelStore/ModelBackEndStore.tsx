import { ModelNodeType, ModelType } from "../../types/ModelTypes";
import { canvasHeader } from "../../types/SevilleSchema";
import initialSchema from "../../dummyData/SevilleModelSchema.json";
import { create } from "zustand";
import { Edge, Node } from "reactflow";

type Store = {
  header: canvasHeader;
  initialSchemaItems: Node[];
  modelNodeSchemas: ModelNodeType;
  savedModelNodes: ModelType[];
  savedNodes: Node[];
  savedEdges: Edge[];
  updateHeader: (updatedValues: Partial<canvasHeader>) => void;
  updateHeaderDescription: (description: Partial<canvasHeader>) => void;
  fetchInitialSchema: () => Promise<void>;
};

const useModelBackendStore = create<Store>((set) => ({
  header: initialSchema.header as canvasHeader,
  initialSchemaItems: initialSchema.initialSystemNodes,
  modelNodeSchemas: initialSchema.modelNodeSchemas,
  savedModelNodes: initialSchema.modelNodes,
  savedNodes: initialSchema.savedNodes,
  savedEdges: initialSchema.savedEdges,
  updateHeader: (updatedValues) =>
    set((state) => ({
      header: {
        ...state.header,
        ...updatedValues,
      },
    })),
  updateHeaderDescription: (description) =>
    set((state) => ({
      header: {
        ...state.header,
        ...description,
      },
    })),
  fetchInitialSchema: async () => {
    // Simulate a fetch operation with a timeout
    const fetchedSchema = await new Promise<typeof initialSchema>((resolve) =>
      setTimeout(() => resolve(initialSchema), 10)
    );

    // Update the state with the fetched schema
    set({
      header: fetchedSchema.header as canvasHeader,
      initialSchemaItems: fetchedSchema.initialSystemNodes,
      modelNodeSchemas: fetchedSchema.modelNodeSchemas,
      savedModelNodes: fetchedSchema.modelNodes,
    });
  },
}));

export default useModelBackendStore;
