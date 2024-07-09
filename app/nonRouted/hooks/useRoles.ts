// hooks/useRoles.ts
import useFetch from "./useFetch";

export interface Role {
  roleId: string;
  roleName: string;
  organisationId: string;
  organisationName: string;
  active: boolean;
}

const useRoles = () => {
  return useFetch<Role[]>("/api/roles");
};

export default useRoles;
