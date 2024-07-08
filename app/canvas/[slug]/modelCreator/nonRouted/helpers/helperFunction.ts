import { ListItem } from "../components/sidebarTabComponents/propertiesTab/components/RecursiveDropdownv3";

export function findLastChildWithProperties(data: ListItem[]): any[] | null {
  let lastProperties = null;

  for (const item of data) {
    if (item.properties && item.properties.length > 0) {
      lastProperties = item.properties; // Update last found properties
    }
    if (item.children.length > 0) {
      const childProperties = findLastChildWithProperties(item.children);
      if (childProperties) {
        lastProperties = childProperties; // Update with deeper nested properties
      }
    }
  }

  return lastProperties;
}
