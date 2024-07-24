import { ModelNodeType, ModelType } from "../../_types/ModelTypes";
import { canvasHeader } from "@/app/canvas/[slug]/_lib/_types/canvasHeader";
//import initialSchema from "../../dummyData/SevilleModelSchema.json";
import { create } from "zustand";
import { Edge, Node } from "reactflow";

type Store = {
  header: canvasHeader | null;
  initialSchemaItems: Node[];
  modelNodeSchemas: ModelNodeType;
  savedModelNodes: ModelType[];
  savedNodes: Node[];
  savedEdges: Edge[];
  updateHeader: (updatedValues: Partial<canvasHeader>) => void;
  updateHeaderDescription: (description: Partial<canvasHeader>) => void;
  fetchInitialSchema: () => Promise<void>;
  setAllValues: (values: Partial<Store>) => void;
};

const initialSchema = {
  header: null as canvasHeader | null,
  initialSystemNodes: [] as Node[],
  modelNodeSchemas: {} as ModelNodeType,
  modelNodes: [] as ModelType[],
  savedNodes: [] as Node[],
  savedEdges: [] as Edge[],
};

const useModelBackendStore = create<Store>((set) => ({
  header: initialSchema.header,
  initialSchemaItems: initialSchema.initialSystemNodes,
  modelNodeSchemas: initialSchema.modelNodeSchemas,
  savedModelNodes: initialSchema.modelNodes,
  savedNodes: initialSchema.savedNodes,
  savedEdges: initialSchema.savedEdges,
  updateHeader: (updatedValues) =>
    set((state) => ({
      header: state.header
        ? { ...state.header, ...updatedValues }
        : ({ ...updatedValues } as canvasHeader),
    })),
  updateHeaderDescription: (description) =>
    set((state) => ({
      header: state.header
        ? { ...state.header, ...description }
        : ({ ...description } as canvasHeader),
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
  setAllValues: (values) =>
    set((state) => ({
      ...state,
      ...values,
    })),
}));

export default useModelBackendStore;
