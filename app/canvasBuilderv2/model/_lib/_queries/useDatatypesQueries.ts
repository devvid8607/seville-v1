import { apiGet } from "@/app/helpers/apiClient";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "../../../_lib/_store/DataTypesStore";

export const fetchDatatypes = async () => {
  return apiGet<DataType[]>(`/datatypes`);
};

export const useFetchDatatypes = () => {
  return useQuery<DataType[], Error>({
    queryKey: ["datatypes"],
    queryFn: fetchDatatypes,
  });
};
