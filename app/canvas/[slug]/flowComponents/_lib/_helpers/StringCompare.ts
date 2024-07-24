import { Variable } from "../_types/CommonStoreType";
import { MapDetail } from "../../../modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";

export const levenshteinDistance = (s1: string, s2: string) => {
  const arr = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) arr[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) arr[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      arr[j][i] = Math.min(
        arr[j][i - 1] + 1, // deletion
        arr[j - 1][i] + 1, // insertion
        arr[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return arr[s2.length][s1.length];
};

export const findMatches = (maps: MapDetail[], mappedChildren: Variable[]) => {
  // const threshold = 3; // Determines how different the strings can be to still be considered a match
  const matches: any = [];

  console.log("maps:", maps);
  console.log("mappedChildren", mappedChildren);

  mappedChildren.forEach((child) => {
    maps.forEach((map) => {
      if (child.name === map.destName) {
        console.log("childname", child.name, "destname", map.destName);
        // Exact match
        if (child.dropDetails) {
          matches.push({
            sourceName: child.dropDetails.droppedName,
            source: child.dropDetails.droppedId,
            sourceDataType: child.dropDetails.typeCheck,
            destName: map.destName,
            id: map.id,
            destDataType: map.destDataType,
          });
        } else {
          matches.push({
            sourceName: child.name,
            source: child.id,
            sourceDataType: child.type,
            destName: map.destName,
            id: map.id,
            destDataType: map.destDataType,
          });
        }
      }
    });
  });

  return matches;
};

export const filterData = (data: any) => {
  const exactMatches = new Set();

  // Identify exact matches and similar matches that need to be removed
  data.forEach((item: any) => {
    if (item.type === "exact") {
      exactMatches.add(item.childId);
    }
  });

  // Filter out similar matches when an exact match is present
  return data.filter((item: any) => {
    if (item.type === "similar" && exactMatches.has(item.childId)) {
      return false;
    }
    return true;
  });
};

export const checkTypeCompatibility = (
  fieldDataType: string,
  droppedType: string
) => {
  console.log("type check", fieldDataType, droppedType);
  if (
    (fieldDataType === "text" || fieldDataType === "number") &&
    droppedType === "singleValue"
  ) {
    return true;
  } else if (
    (fieldDataType === "model" || fieldDataType === "code") &&
    droppedType === "complexValue"
  ) {
    return true;
  } else if (fieldDataType === "list" && droppedType === "listValue") {
    return true;
  }
  if (fieldDataType === "text" && droppedType === "text") {
    return true;
  }
  if (fieldDataType === "model" && droppedType === "model") {
    return true;
  }
  if (fieldDataType === "list" && droppedType === "list") {
    return true;
  }
  if (fieldDataType === "codeList" && droppedType === "codeList") {
    return true;
  }
  if (fieldDataType === "email" && droppedType === "email") {
    return true;
  } else if (fieldDataType === "complexValue" && droppedType === "model") {
    return true;
  } else if (
    fieldDataType === "singleValue" &&
    (droppedType === "text" || droppedType === "number")
  ) {
    return true;
  }

  return false;
};
