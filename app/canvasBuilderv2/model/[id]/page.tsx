"use client";
import NextBreadcrumb from "@/app/_lib/_components/Breadcrumbs";
import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";
import { NewModelCreator } from "@/app/canvas/[slug]/modelCreator/_lib/_components/model/NewModelCreator";
import { useCanvasData } from "@/app/canvas/[slug]/modelCreator/_lib/_queries/useCanvasQueries";
import { useFetchDatatypes } from "@/app/canvas/[slug]/modelCreator/_lib/_queries/useDatatypesQueries";
import useModelBackendStore from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelBackEndStore";
import useModelStore from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelNodesStore";
import { Typography } from "@mui/material";
import React, { useEffect } from "react";
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

  useEffect(() => {
    if (canvasData) {
      console.log("Canvas Data:", canvasData);
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
  return (
    <div>
      <NextBreadcrumb
        homeElement={<Typography>Home</Typography>}
        separator={<span> / </span>}
        capitalizeLinks={true}
      />

      <NewModelCreator />
    </div>
  );
};

export default ModelCanvas;
