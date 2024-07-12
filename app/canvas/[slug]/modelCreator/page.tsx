"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { NewModelCreator } from "./nonRouted/components/model/NewModelCreator";
import useDataTypesStore from "../nonRouted/store/DataTypesStore";
import useModelBackendStore from "./nonRouted/store/modelStore/ModelBackEndStore";
import useModelStore from "./nonRouted/store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "./nonRouted/store/modelStore/ModelNodesStore";

// const DynamicNewModelCreator = dynamic(
//   () =>
//     import("./nonRouted/components/model/NewModelCreator").then(
//       (mod) => mod.NewModelCreator
//     ),
//   {
//     loading: () => <p>Loading NewModelCreator...</p>,
//     ssr: false,
//   }
// );

const ModelFlowWrapper = () => {
  const [loading, setLoading] = useState(true);

  const clearAllNodesDataInStore = useModelNodesStore(
    (state) => state.clearAllNodesDataInStore
  );
  const clearAllEdgedDataInStore = useModelNodesStore(
    (state) => state.clearAllEdgedDataInStore
  );
  const clearModels = useModelStore((state) => state.clearModels);
  const fetchModels = useModelStore((state) => state.fetchModels);
  const fetchInitialSchema = useModelBackendStore(
    (state) => state.fetchInitialSchema
  );
  const { fetchDataTypes } = useDataTypesStore((state) => ({
    fetchDataTypes: state.fetchData,
  }));

  useEffect(() => {
    const loadSchema = async () => {
      setLoading(true);
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      clearModels();

      await fetchInitialSchema();
      await fetchModels();
      await fetchDataTypes();
      setLoading(false);
    };

    loadSchema();
  }, []);

  if (loading) {
    return <div>Model Loading...</div>;
  }

  // return <div>model creator</div>;
  return <NewModelCreator />;
  // return <DynamicNewModelCreator />;
};

export default ModelFlowWrapper;
