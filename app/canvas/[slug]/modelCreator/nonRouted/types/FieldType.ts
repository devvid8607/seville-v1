import { Model } from "../store/modelStore/ModelDetailsFromBackendStore";

export type FieldType = {
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  key: boolean;
  locked: boolean;
  notNull: boolean;
  isRemovable: boolean;
  enabled: boolean;
  dataType: string;
  icon?: string;
  properties?: any[];
  hasHandle?: boolean;
  showModel?: boolean;
  isConnectedToNodeId?: string;
  dataSourceId?: string | null;
  dataSourceFriendlyName?: string | null;
  childDataType?: string | null;
  // mappedTo?: MappedItemDetails | {};
  childModel?: Model;
};
