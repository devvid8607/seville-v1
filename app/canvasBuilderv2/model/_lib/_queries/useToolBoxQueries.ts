import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/app/helpers/apiClient";
import { CanvasIndexItem } from "./useModelQueries";

export enum ToolboxCategory {
  Model = "model",
  CodeList = "codeList",
  DataType = "dataType",
  Category = "category",
  Attribute = "attribute",
}

export interface ToolBoxType {
  id: string;
  parentId: null | string;
  name: string;
  type: ToolboxCategory;
  hasChildren: boolean;
  children: null | ToolBoxType[];
  configuration: null | any;
}

export const fetchToolboxCategories = async () => {
  return apiGet<ToolBoxType[]>(`/toolbox`);
};

export const useFetchToolbox = () => {
  return useQuery<ToolBoxType[], Error>({
    queryKey: ["toolboxCategories"],
    queryFn: fetchToolboxCategories,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const fetchToolboxDataById = async (id: string): Promise<ToolBoxType[]> => {
  return apiGet<ToolBoxType[]>(`/toolbox/${id}`);
};

export const useGetToolboxDataById = (id: string) => {
  return useQuery<ToolBoxType[], Error>({
    queryKey: ["toolboxCategory", id],
    queryFn: () => fetchToolboxDataById(id),
    enabled: !!id,
  });
};
