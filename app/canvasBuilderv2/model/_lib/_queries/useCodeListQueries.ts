import { apiGet } from "@/app/helpers/apiClient";
import { useQuery } from "@tanstack/react-query";
import { CodeList } from "../../../_lib/_nodes/codeListNode/store/CodeListStore";

//#region fetch a codelist based on id
export const fetchCodeById = async (codeId: string) => {
  return apiGet<CodeList>(`/codelists/${codeId}`);
};

export const useFetchCodeById = (codeId: string | null) => {
  return useQuery<CodeList, Error>({
    queryKey: ["codes", codeId],
    queryFn: () => fetchCodeById(codeId as string),
    enabled: !!codeId,
  });
};

//#endregion
