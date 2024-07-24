import {
  MapDetail,
  RootMap,
  RootMap2,
  TransformationProperties,
} from "../../../modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
// import {
//   FlareTransformationProperties,
//   MapDetail,
//   MappingConfiguration,
//   RootMap,
//   RootMap2,
//   TransformationProperties,
// } from "../../NewModelCreatorNode/Store/ModelDetailsFromBackendStore";
import { create } from "zustand";

interface MapData {
  id: string; // Assuming this is the model ID
  map: RootMap2; // The map data type defined previously
}

interface MapStoreState {
  maps: MapData[];
  addOrUpdateMap: (modelId: string, nodeId: string, mapData: RootMap2) => void;
  getMapByModelId: (modelId: string, nodeId: string) => RootMap2 | undefined;
  findChildMapById: (
    rootMapId: string,
    nodeId: string,
    childMapId: string
  ) => MapDetail | undefined;
  updateChildMapById: (
    rootMapId: string,
    nodeId: string,
    childMapId: string,
    newValues: Partial<MapDetail>
  ) => void;
  updateTransformationsById: (
    rootMapId: string,
    nodeId: string,
    childMapId: string,
    newTransformations: TransformationProperties
  ) => void;
  updateRootMapTransformationsById: (
    rootMapId: string,
    nodeId: string,
    newTransformations: TransformationProperties
  ) => void;
  updateRootMapById: (
    rootMapId: string,
    nodeId: string,
    newValues: Partial<RootMap>
  ) => void;
  getMapByMapId: (mapId: string, nodeId: string) => RootMap2 | undefined;
  removeMapByModelId: (modelId: string, nodeId: string) => void;
}

export const useMapStore = create<MapStoreState>((set, get) => ({
  maps: [],

  addOrUpdateMap: (modelId, nodeId, mapData) => {
    set((state) => {
      // Check if the mapData for the modelId already exists
      const existingIndex = state.maps.findIndex(
        (m) => m.id === modelId && m.map.nodeId === nodeId
      );

      if (existingIndex > -1) {
        // Map data exists, don't replace it, just return the current state
        console.log(
          `Map data for modelId ${modelId} already exists. No update performed.`
        );
        return state; // Return the unchanged state
      } else {
        // Map data doesn't exist, so add it
        const newMapData = { id: modelId, map: mapData };
        return { maps: [...state.maps, newMapData] };
      }
    });
  },
  getMapByModelId: (modelId, nodeId) => {
    const maps = get().maps;
    const mapData = maps.find(
      (m) => m.id === modelId && m.map.nodeId === nodeId
    );
    return mapData?.map;
  },
  findChildMapById: (rootMapId, nodeId, childMapId) => {
    const rootMap = get().maps.find(
      (map) => map.map.id === rootMapId && map.map.nodeId === nodeId
    )?.map;
    console.log("rootmap", rootMap);
    if (!rootMap || !rootMap.configuration) {
      console.error("Root map not found or has no configuration");
      return undefined;
    } else {
      console.log("root map found");
    }

    const searchMaps = (maps: MapDetail[]): MapDetail | undefined => {
      for (const map of maps) {
        if (map.id === childMapId) {
          return map; // Direct match
        }
        if (map.configuration) {
          // Recursively search in nested configurations
          // Explicitly annotate the found variable as well
          const found: MapDetail | undefined = searchMaps(
            map.configuration.maps
          );
          if (found) {
            return found; // Found in nested maps
          }
        }
      }
      return undefined; // Not found
    };

    return searchMaps(rootMap.configuration.maps);
  },
  updateChildMapById: (rootMapId, nodeId, childMapId, newValues) => {
    set((state) => {
      // Flag to check if the update was successful
      let isUpdated = false;

      // Function to recursively update the maps
      const updateMaps = (maps: MapDetail[]): MapDetail[] =>
        maps.map((map) => {
          // Direct match, update this map
          if (map.id === childMapId) {
            isUpdated = true;
            return { ...map, ...newValues };
          }
          // Recurse if this map has a nested configuration
          else if (map.configuration && map.configuration.maps) {
            const updatedNestedMaps = updateMaps(map.configuration.maps);
            // Only update configuration if nested maps were actually updated
            return {
              ...map,
              configuration: {
                ...map.configuration,
                maps: updatedNestedMaps,
              },
            };
          }
          // Return the map unmodified if no updates apply
          return map;
        });

      // Find the rootMap by rootMapId and clone the state to maintain immutability
      const rootMapIndex = state.maps.findIndex(
        (map) => map.map.id === rootMapId && map.map.nodeId === nodeId
      );
      if (rootMapIndex === -1) {
        console.error("Root map not found with ID:", rootMapId);
        return state; // Return the current state unchanged
      }

      // Clone the root map to ensure immutability
      const rootMapClone = { ...state.maps[rootMapIndex] };
      if (rootMapClone.map && rootMapClone.map.configuration) {
        // Update the nested maps within the cloned root map
        rootMapClone.map.configuration.maps = updateMaps(
          rootMapClone.map.configuration.maps
        );

        if (isUpdated) {
          // If updates were made, return the new state
          const updatedMaps = [...state.maps];
          updatedMaps[rootMapIndex] = rootMapClone;
          return { maps: updatedMaps };
        } else {
          // If no updates were made, return the current state unchanged
          return state;
        }
      }

      return state;
    });
  },
  updateTransformationsById: (
    rootMapId,
    nodeId,
    childMapId,
    newTransformations
  ) => {
    set((state) => {
      let isUpdated = false;

      const updateMaps = (maps: MapDetail[]): MapDetail[] =>
        maps.map((map) => {
          if (map.id === childMapId) {
            isUpdated = true;
            return { ...map, transformations: newTransformations };
          } else if (map.configuration && map.configuration.maps) {
            const updatedNestedMaps = updateMaps(map.configuration.maps);
            return {
              ...map,
              configuration: {
                ...map.configuration,
                maps: updatedNestedMaps,
              },
            };
          }
          return map;
        });

      const rootMapIndex = state.maps.findIndex(
        (map) => map.map.id === rootMapId && map.map.nodeId === nodeId
      );
      if (rootMapIndex === -1) {
        console.error("Root map not found with ID:", rootMapId);
        return state;
      }

      const rootMapClone = { ...state.maps[rootMapIndex] };
      if (rootMapClone.map && rootMapClone.map.configuration) {
        rootMapClone.map.configuration.maps = updateMaps(
          rootMapClone.map.configuration.maps
        );

        if (isUpdated) {
          const updatedMaps = [...state.maps];
          updatedMaps[rootMapIndex] = rootMapClone;
          return { maps: updatedMaps };
        } else {
          return state;
        }
      }

      return state;
    });
  },
  updateRootMapTransformationsById: (rootMapId, nodeId, newValues) => {
    // alert(rootMapId);
    set((state) => {
      const index = state.maps.findIndex(
        (map) => map.map.id === rootMapId && map.map.nodeId === nodeId
      );
      if (index === -1) {
        console.error("Root map not found with ID:", rootMapId);
        return state;
      }
      const maps = [...state.maps];
      const currentMap = maps[index];
      maps[index] = {
        ...currentMap,
        map: {
          ...currentMap.map,
          // ...newValues,
          // configuration: currentMap.map.configuration,
          // metadata: currentMap.map.metadata,
          // configurationProperties: currentMap.map.configurationProperties,
          transformations: newValues,
        },
      };
      return { maps };
    });
  },
  updateRootMapById: (rootMapId, nodeId, newValues) => {
    // alert(rootMapId);
    set((state) => {
      const index = state.maps.findIndex(
        (map) => map.map.id === rootMapId && map.map.nodeId === nodeId
      );
      if (index === -1) {
        console.error("Root map not found with ID:", rootMapId);
        return state;
      }
      const maps = [...state.maps];
      const currentMap = maps[index];
      maps[index] = {
        ...currentMap,
        map: {
          ...currentMap.map,
          ...newValues,
          // configuration: currentMap.map.configuration,
          // metadata: currentMap.map.metadata,
          // configurationProperties: currentMap.map.configurationProperties,
          // transformations: currentMap.map.transformations,
        },
      };
      return { maps };
    });
  },
  getMapByMapId: (mapId, nodeId) => {
    // Search for and return the RootMap2 object by the map's unique ID across all stored maps
    for (const mapData of get().maps) {
      if (mapData.map.id === mapId && mapData.map.nodeId === nodeId) {
        return mapData.map;
      }
    }
    return undefined; // Return undefined if no map with the specified ID is found
  },
  removeMapByModelId: (modelId, nodeId) => {
    console.log("remove", modelId, nodeId);
    set((state) => ({
      maps: state.maps.filter(
        (m) => !(m.id === modelId && m.map.nodeId === nodeId)
      ),
    }));
  },
}));
