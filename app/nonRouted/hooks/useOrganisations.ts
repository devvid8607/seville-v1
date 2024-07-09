// hooks/useOrganisations.ts
import useFetch from "./useFetch";

export interface Organisation {
  organisationId: string;
  organisationName: string;
  organisationCode: string;
  address1: string;
  address2: string;
  suburb: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
  phoneNumber: string;
  email: string;
}

const useOrganisations = () => {
  return useFetch<Organisation[]>("/api/organisations");
};

export default useOrganisations;
