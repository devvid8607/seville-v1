"use client";
import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";

import { useEffect, useState } from "react";
import { useCanvasData } from "../_lib/_queries/useCanvasQueries";
import { useModelNodesStore } from "../_lib/_store/modelStore/ModelNodesStore";
import useModelStore from "../_lib/_store/modelStore/ModelDetailsFromBackendStore";
import useModelBackendStore from "../_lib/_store/modelStore/ModelBackEndStore";
import { useFetchDatatypes } from "../_lib/_queries/useDatatypesQueries";
import { NewModelCreator } from "../_lib/_components/model/NewModelCreator";
interface ModelCreatorPageProps {
  params: {
    id: string;
  };
}

const ModelCanvas = ({ params }: ModelCreatorPageProps) => {
  const {
    data: canvasData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCanvasData("dummyuser", params.id);
  const { clearAllEdgedDataInStore, clearAllNodesDataInStore } =
    useModelNodesStore((state) => ({
      clearAllEdgedDataInStore: state.clearAllEdgedDataInStore,
      clearAllNodesDataInStore: state.clearAllNodesDataInStore,
    }));
  const clearModels = useModelStore((state) => state.clearModels);
  const setAllValues = useModelBackendStore((state) => state.setAllValues);
  const setDataTypes = useDataTypesStore((state) => state.setDataTypes);
  const [loading, setLoading] = useState(false);

  const {
    data: datatypes,
    error: fetchDatatypeError,
    isLoading: isFetchDatatypeLoading,
    isError: isfetchDatatypeError,
  } = useFetchDatatypes();

  useEffect(() => {
    if (datatypes) {
      console.log("fetched datatypes", datatypes);
      setDataTypes(datatypes);
    }
  }, [datatypes]);
  console.log("Canvas Data:", canvasData);
  useEffect(() => {
    if (canvasData) {
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      clearModels();
      setAllValues({
        header: canvasData.canvasData.header,
        savedNodes: canvasData.canvasData.visibleNodes,
        savedEdges: canvasData.canvasData.visibleEdges,
        initialSchemaItems: canvasData.canvasData.systemNodes,
      });
    }
  }, [canvasData]);

  const handleRefetch = async () => {
    setLoading(true);
    console.log("refetching data");
    await refetch();
    console.log("finished refetching data", canvasData);
    if (canvasData) {
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      clearModels();
      setAllValues({
        header: canvasData.canvasData.header,
        savedNodes: canvasData.canvasData.visibleNodes,
        savedEdges: canvasData.canvasData.visibleEdges,
        initialSchemaItems: canvasData.canvasData.systemNodes,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <NewModelCreator refetchCanvasData={handleRefetch} loading={loading} />
    </div>
  );
};

export default ModelCanvas;
