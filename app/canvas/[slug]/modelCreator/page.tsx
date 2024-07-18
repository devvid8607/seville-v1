"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { NewModelCreator } from "./_lib/_components/model/NewModelCreator";
import useDataTypesStore from "../_lib/_store/DataTypesStore";
import useModelBackendStore from "./_lib/_store/modelStore/ModelBackEndStore";
import useModelStore from "./_lib/_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "./_lib/_store/modelStore/ModelNodesStore";
import { useRouter, useSearchParams } from "next/navigation";

// const DynamicNewModelCreator = dynamic(
//   () =>
//     import("./_lib/_components/model/NewModelCreator").then(
//       (mod) => mod.NewModelCreator
//     ),
//   {
//     loading: () => <p>Loading NewModelCreator...</p>,
//     ssr: false,
//   }
// );

const ModelFlowWrapper = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const param = searchParams.get("param");

  console.log("id:", id);
  console.log("param:", param);

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
