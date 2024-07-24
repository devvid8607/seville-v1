import { useMapStore } from "../mapping/NewMappingModelStore";
import useModelStore, {
  MapDetail,
  MappingConfiguration,
  RootMap2,
} from "../../../modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import {
  checkTypeCompatibility,
  filterData,
  findMatches,
} from "./StringCompare";
import { useMappingStore } from "../mapping/MappingStore";
import { useFlowNodeStore } from "../_store/FlowNodeStore";
import {
  getModelTree,
  transformNodeStructure,
} from "../../../_lib/_components/sidebarTabComponents/dataTab/customTreeView/TransformToTreeData";

import { useContextDataStore } from "../../../_lib/_nodes/contextDataNode/store/ContextDataStore";
import { useCustomVariableStore } from "../../../_lib/_nodes/contextDataNode/store/CustomVariablesStore";
import { useGlobalVariableStore } from "../../../_lib/_nodes/contextDataNode/store/GlobalVariablesStore";
import { useNodeStructureStore } from "../_store/FlowNodeStructureStore";

export const useMatchData = () => {
  const { findContextDataById } = useContextDataStore((state) => ({
    findContextDataById: state.findContextDataById,
  }));

  const { findCustomVariableById } = useCustomVariableStore((state) => ({
    findCustomVariableById: state.findCustomVariableById,
  }));

  const { findGlobalVariableById } = useGlobalVariableStore((state) => ({
    findGlobalVariableById: state.findGlobalVariableById,
  }));

  const { updateChildMapById, findChildMapById, getMapByModelId } = useMapStore(
    (state) => ({
      updateChildMapById: state.updateChildMapById,
      findChildMapById: state.findChildMapById,
      getMapByModelId: state.getMapByModelId,
    })
  );

  // const { getNodeById } = useMappingModelNodesStore((state) => ({
  //   getNodeById: state.getNodeById,
  // }));

  const { getNodeById } = useFlowNodeStore((state) => ({
    getNodeById: state.getNodeById,
  }));

  const { mappingModelId, mappingNodeId } = useMappingStore((state) => ({
    mappingModelId: state.mappingModelId,
    mappingNodeId: state.mappingNodeId,
  }));
  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);

  const { getModelById } = useModelStore((state) => ({
    getModelById: state.getModelById,
  }));
  const { models } = useModelStore((state) => ({
    models: state.models,
  }));

  const { getAttributeById } = useModelStore((state) => ({
    getAttributeById: state.getAttributeById,
  }));

  //no longer used
  // const matchData = (
  //   mapRootId: string,
  //   maps: MapDetail[],
  //   droppedItemToBeMatched: string
  // ) => {
  //   const contextData = findContextDataById(droppedItemToBeMatched);
  //   console.log("context data ** ", contextData);
  //   if (contextData?.children) {
  //     console.log("matching ** ", maps, "with", contextData?.children);
  //     const matchData = findMatches(maps, contextData?.children);
  //     const filteredData = filterData(matchData);
  //     console.log("internal match data:", filteredData);

  //     filteredData.forEach((item: any) => {
  //       const isTypeCompatible = checkTypeCompatibility(
  //         item.sourceDataType,
  //         item.destDataType
  //       );
  //       const mapDetail = maps.find((map) => map.id === item.id);
  //       if (mapDetail) {
  //         const updatedMapDetail: MapDetail = {
  //           ...mapDetail,
  //           source: item.source,
  //           sourceName: item.sourceName,
  //           sourceDataType: item.sourceDataType,
  //           error: isTypeCompatible,
  //         };

  //         updateChildMapById(mapRootId, mapDetail.id, updatedMapDetail);
  //       }
  //     });
  //   }
  // };

  const updateMapsRecursively = (
    maps: MapDetail[],
    mapNodeId: string,
    rootMapId: string
  ) => {
    console.log("maps recursive", maps);
    maps.forEach((map: MapDetail) => {
      const childMapDetail1 = findChildMapById(rootMapId, mapNodeId, map.id);
      console.log("childMapsss", childMapDetail1);
      if (
        childMapDetail1 &&
        childMapDetail1.source &&
        // !childMapDetail1.error &&
        childMapDetail1.destDataType === "model"
      ) {
        console.log("mapping item", childMapDetail1);
        //const contextData = findContextDataById(childMapDetail1.source);
        const contextData = findDatSource(childMapDetail1);
        console.log("context data 2", contextData);
        const childMaps = childMapDetail1?.configuration?.maps;
        if (childMaps && contextData?.children) {
          const matchData = findMatches(childMaps, contextData.children);
          const filteredData = filterData(matchData);
          console.log("internal match data:", filteredData);
          filteredData.forEach((item: any) => {
            const isTypeCompatible = checkTypeCompatibility(
              item.sourceDataType,
              item.destDataType
            );
            const childMapDetail = findChildMapById(
              rootMapId,
              mapNodeId,
              item.id
            );
            console.log("childMapDetails", childMapDetail);
            if (
              childMapDetail &&
              !childMapDetail.source &&
              !childMapDetail.sourceName &&
              !childMapDetail.sourceDataType
            ) {
              const updatedMapDetail: MapDetail = {
                ...childMapDetail,
                source: item.source,
                sourceName: item.sourceName,
                sourceDataType: item.sourceDataType,
                sourceParentId: contextData.id,
                sourceParentName: contextData.name,
                error: !isTypeCompatible,
              };

              updateChildMapById(
                rootMapId,
                mapNodeId,
                childMapDetail.id,
                updatedMapDetail
              );
            }
          });
          // Recursive call to handle nested configurations
          if (childMapDetail1.configuration)
            updateMapsRecursively(
              childMapDetail1.configuration.maps,
              mapNodeId,
              rootMapId
            );
        }
      }
    });
  };

  const matchMap = () => {
    const rootMap = getMapByModelId(mappingModelId, mappingNodeId);

    if (rootMap && rootMap.configuration) {
      updateMapsRecursively(
        rootMap.configuration.maps,
        mappingNodeId,
        rootMap.id
      );
    }
  };

  const findDataSourceId = (sourcePath: string): string | undefined => {
    const pathSegments = sourcePath.split(".");
    let currentModelId = pathSegments[0];
    let currentAttributeId = pathSegments[1];

    for (let i = 1; i < pathSegments.length; i++) {
      const attribute = getAttributeById(currentModelId, currentAttributeId);
      if (
        !attribute ||
        attribute.dataType !== "model" ||
        !attribute.dataSourceId
      ) {
        return undefined;
      }

      if (i === pathSegments.length - 1) {
        return attribute.dataSourceId;
      }

      currentModelId = attribute.dataSourceId;
      currentAttributeId = pathSegments[i + 1];
    }

    return undefined;
  };

  const findDatSource = (rootMap: RootMap2 | MapDetail) => {
    let returnedData;
    console.log("rootMap 2", rootMap);
    returnedData = findContextDataById(rootMap.source);
    if (returnedData) {
      console.log("got conext data");
      return returnedData;
    }
    returnedData = findGlobalVariableById(rootMap.source);
    if (returnedData) {
      console.log("got global data");
      return returnedData;
    }
    returnedData = findCustomVariableById(rootMap.source);
    if (returnedData) {
      console.log("got customvar data");
      return returnedData;
    }
    if (rootMap.sourceParentId && rootMap.source) {
      const finalmodelid = findDataSourceId(rootMap.source);
      console.log("finalmodelid", finalmodelid);
      if (finalmodelid) {
        //checking if model
        console.log("looking for model");
        const modeltree = getModelTree(models, finalmodelid);
        console.log("modeltree", modeltree);
        if (modeltree && modeltree.length > 0) {
          console.log("got model data");
          return modeltree[0] as any;
        } else return null;
      } else {
        //checking if output
        const nodesWithOutputs = nodeStructures.filter(
          (node) => node.outputs.length > 0
        );
        const outputitem = nodesWithOutputs.filter((node) =>
          node.outputs.some(
            (output) =>
              output.parentNodeId === rootMap.sourceParentId &&
              output.id === rootMap.source
          )
        );
        console.log("outputItem", outputitem);
        const transformedNodes = transformNodeStructure(outputitem);
        console.log("got output data");
        return transformedNodes[0];
      }
    }
    return null;
  };

  const matchRootMap = (mapModelId: string, mapNodeId: string) => {
    console.log("in match", mapModelId, mapNodeId);
    const rootMap = getMapByModelId(mapModelId, mapNodeId);
    console.log("root map", rootMap);
    if (rootMap) {
      if (rootMap.source && rootMap.destDataType === "model") {
        console.log("mapping item", rootMap);

        const contextData = findDatSource(rootMap);
        // const contextData = findContextDataById(rootMap.source);
        if (contextData !== null) {
          const childMaps = rootMap?.configuration?.maps;
          console.log("context data 1", contextData.children, childMaps);
          if (childMaps && contextData && contextData?.children) {
            console.log("finding matches");
            const matchData = findMatches(childMaps, contextData.children);
            const filteredData = filterData(matchData);
            console.log("internal match data:", filteredData);
            filteredData.forEach((item: any) => {
              console.log("item checking", item);
              const isTypeCompatible = checkTypeCompatibility(
                item.sourceDataType,
                item.destDataType
              );
              const childMapDetail = findChildMapById(
                `Map.${mapModelId}`,
                mapNodeId,
                item.id
              );
              console.log("childMapDetails", childMapDetail);
              if (
                childMapDetail &&
                !childMapDetail.source &&
                !childMapDetail.sourceName &&
                !childMapDetail.sourceDataType
              ) {
                const updatedMapDetail: MapDetail = {
                  ...childMapDetail,
                  source: item.source,
                  sourceName: item.sourceName,
                  sourceDataType: item.sourceDataType,
                  sourceParentId: contextData.id,
                  sourceParentName: contextData.name,
                  error: !isTypeCompatible,
                };

                updateChildMapById(
                  `Map.${mapModelId}`,
                  mapNodeId,
                  childMapDetail.id,
                  updatedMapDetail
                );
              }
            });
            // Recursive call to handle nested configurations
            if (rootMap.configuration)
              updateMapsRecursively(
                rootMap.configuration.maps,
                mapNodeId,
                rootMap.id
              );
          }
        }
      } else {
        if (rootMap.configuration)
          updateMapsRecursively(
            rootMap.configuration.maps,
            mapNodeId,
            rootMap.id
          );
      }
    }
  };

  const findAllMapsByPath = (
    mapConfig: MappingConfiguration,
    path: string
  ): MapDetail[] => {
    let details: MapDetail[] = [];

    if (mapConfig.path === path) return mapConfig.maps;
    else {
      mapConfig.maps.forEach((mapDetail: MapDetail) => {
        if (mapDetail.configuration) {
          const childDetails = findAllMapsByPath(mapDetail.configuration, path);
          details = details.concat(childDetails);
        }
      });
    }

    return details;
  };

  const clearMap = (nodeId: string, mapModelId: string, mapNodeId: string) => {
    const currentNode = getNodeById(nodeId);
    const rootMap = getMapByModelId(mapModelId, mapNodeId);
    console.log(
      "in clear map",
      nodeId,
      mapModelId,
      mapNodeId,
      rootMap,
      rootMap?.configuration
    );
    if (currentNode && rootMap && rootMap.configuration) {
      const nodePath = currentNode.data.modelDetails.path;
      console.log("nodepath", nodePath);
      console.log("rootMap.configuration", rootMap.configuration);
      const mapsData = findAllMapsByPath(rootMap.configuration, nodePath);
      console.log("mapsData", mapsData);

      if (mapsData && mapsData.length > 0) {
        mapsData.forEach((mapDataDetail: MapDetail) => {
          const updatedMapDetail: MapDetail = {
            ...mapDataDetail,
            source: "",
            sourceName: "",
            sourceDataType: "",
            error: false,
          };

          updateChildMapById(
            `Map.${mapModelId}`,
            mapNodeId,
            mapDataDetail.id,
            updatedMapDetail
          );
        });
      }
    }
  };

  return { matchMap, clearMap, matchRootMap };
};
