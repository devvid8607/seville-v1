import { create } from "zustand";
import initialCategories from "../dummyData/FlowCategories.json";

//if validation set then intial schema is from sevilleschema
//import initialSchema from "../FlowData/SevilleSchema.json";

//logic creator schema
import initialSchema from "../dummyData/LogicCreator.json";

import { Edge, Node } from "reactflow";
import { ModelType } from "../../../modelCreator/_lib/_types/ModelTypes";
import { Category } from "../_types/FlowCategory";
import { canvasHeader } from "../../../_lib/_types/canvasHeader";
import { Schema } from "../_types/SevilleSchema";

type Store = {
  categories: Category[];
  header: canvasHeader;
  schemas: Schema[];
  initialSchemaItems: Node[];
  savedModelNodes: ModelType[];
  propertiesConfig: any;

  savedEdges: Edge[];
  setCategories: (categories: Category[]) => void;
  setSchemas: (schemas: Schema[]) => void;
  savedNodes: any[];
  updateHeader: (updatedValues: Partial<canvasHeader>) => void;
  updateHeaderDescription: (description: Partial<canvasHeader>) => void;
  setSavedNodes: (nodes: any[]) => void;
  setSavedEdges: (edges: Edge[]) => void;
  fetchSchema: (path: string | null) => Promise<void>;
};

const useFlowBackendStore = create<Store>((set) => {
  // const { initialSchema } = useTabStore((state) => ({
  //   initialSchema: state.initialSchema,
  // }));
  // const initialSchema = useTabStore.getState().initialSchema;
  return {
    categories: initialCategories,
    header: initialSchema.header as canvasHeader,
    schemas: initialSchema.schemas as Schema[],
    savedNodes: initialSchema.savedNodes,
    savedEdges: initialSchema.saveEdges as Edge[],
    initialSchemaItems: initialSchema.initialSystemNodes,
    savedModelNodes: initialSchema.initialUserNodes,
    propertiesConfig: initialSchema.propertiesConfig,

    setCategories: (categories: Category[]) => set({ categories }),
    setSchemas: (schemas: Schema[]) => set({ schemas }),
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
    setSavedNodes: (nodes) => set({ savedNodes: nodes }), // Method to update saved nodes
    setSavedEdges: (edges) => set({ savedEdges: edges }),
    fetchSchema: async (path: string | null) => {
      if (!path) return;
      let schema;
      if (path === "validationSet") {
        schema = await import("../dummyData/ValidationSetSchema.json");
      } else if (path === "logicCreator") {
        schema = await import("../dummyData/LogicCreator.json");
      }

      if (schema) {
        set({
          header: schema.default.header as canvasHeader,
          schemas: schema.default.schemas as Schema[],
          savedNodes: schema.default.savedNodes,
          savedEdges: schema.default.saveEdges as Edge[],
          initialSchemaItems: schema.default.initialSystemNodes,
          savedModelNodes: schema.default.initialUserNodes,
          propertiesConfig: schema.default.propertiesConfig,
        });
      }
    },
  };
});

export default useFlowBackendStore;
