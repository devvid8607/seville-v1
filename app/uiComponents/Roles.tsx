// components/Roles.tsx
import React, { useEffect } from "react";
import handleNetworkStatus from "../nonRouted/utils/handleAxiosStatus";
import useFetch from "../nonRouted/hooks/useFetch";
import { useRouter } from "next/navigation";

export interface Role {
  roleId: string;
  roleName: string;
  organisationId: string;
  organisationName: string;
  active: boolean;
}

const Roles: React.FC = () => {
  const router = useRouter();
  const {
    data: roles,
    error: rolesError,
    status: rolesStatus,
    loading: loadingRoles,
    sendRequest: fetchRoles,
  } = useFetch<Role[]>("/api/roles");

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (rolesError && (rolesStatus === 401 || rolesStatus === 400)) {
      router.push("/auth/signin");
    }
  }, [rolesError, rolesStatus, router]);

  // Handle network errors
  // if (rolesError && (rolesStatus === 401 || rolesStatus === 400)) {
  //   return handleNetworkStatus(rolesStatus, router.push);
  // }

  if (loadingRoles) {
    return <p>Loading roles...</p>;
  }

  return (
    <div>
      {roles && roles.length > 0 ? (
        <table style={{ marginTop: 15 }}>
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Organisation ID</th>
              <th>Organisation Name</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>{role.organisationId}</td>
                <td>{role.organisationName}</td>
                <td>{role.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No roles found.</p>
      )}
    </div>
  );
};

export default Roles;
