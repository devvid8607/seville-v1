import { queryClient } from "@/app/providers/QueryClientProvider";
import useModelStore from "../_store/modelStore/ModelDetailsFromBackendStore";
import { apiGet } from "@/app/helpers/apiClient";

const fetchAttributeProperties = async (attributeId: string): Promise<any> => {
  return apiGet<any>(`/attributes/${attributeId}`);
};

export const fetchAndSetAttributeProperties = async (
  modelId: string,
  attributeId: string
) => {
  if (!attributeId) {
    return null;
  }
  try {
    const attribute = await queryClient.fetchQuery({
      queryKey: ["attributeProperties", attributeId],
      queryFn: () => fetchAttributeProperties(attributeId),
    });

    if (attribute) {
      console.log("atrribute from api", attribute);
      useModelStore
        .getState()
        .updateProperties("123", "emp_sal", attribute.properties);
    }
  } catch (error) {
    console.error("Error fetching attribute:", error);
  }
};
