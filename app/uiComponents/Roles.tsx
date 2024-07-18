// components/Roles.tsx
// import React, { useEffect } from "react";
// import handleNetworkStatus from "../lib/utils/handleAxiosStatus";
// import useFetch from "../lib/hooks/useFetch";
// import { useRouter } from "next/navigation";

// export interface Role {
//   roleId: string;
//   roleName: string;
//   organisationId: string;
//   organisationName: string;
//   active: boolean;
// }

// const Roles: React.FC = () => {
//   const router = useRouter();
//   const {
//     data: roles,
//     error: rolesError,
//     status: rolesStatus,
//     loading: loadingRoles,
//     sendRequest: fetchRoles,
//   } = useFetch<Role[]>("/api/roles");

//   useEffect(() => {
//     fetchRoles();
//   }, [fetchRoles]);

//   useEffect(() => {
//     if (rolesError && (rolesStatus === 401 || rolesStatus === 400)) {
//       router.push("/auth/signin");
//     }
//   }, [rolesError, rolesStatus, router]);

//   if (loadingRoles) {
//     return <p>Loading roles...</p>;
//   }

//   return (
//     <div>
//       {roles && roles.length > 0 ? (
//         <table style={{ marginTop: 15 }}>
//           <thead>
//             <tr>
//               <th>Role ID</th>
//               <th>Role Name</th>
//               <th>Organisation ID</th>
//               <th>Organisation Name</th>
//               <th>Active</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((role) => (
//               <tr key={role.roleId}>
//                 <td>{role.roleId}</td>
//                 <td>{role.roleName}</td>
//                 <td>{role.organisationId}</td>
//                 <td>{role.organisationName}</td>
//                 <td>{role.active ? "Yes" : "No"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No roles found.</p>
//       )}
//     </div>
//   );
// };

// export default Roles;

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiGet } from "../helpers/apiClient";
import handleNetworkStatus from "../_lib/_utils/handleAxiosStatus";

export interface Role {
  roleId: string;
  roleName: string;
  organisationId: string;
  organisationName: string;
  active: boolean;
}

const fetchRoles = async (): Promise<Role[]> => {
  return apiGet<Role[]>("/roles");
};

const Roles: React.FC = () => {
  const router = useRouter();

  const {
    data: roles,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<Role[], Error>({
    queryKey: ["fetchroles"],
    queryFn: fetchRoles,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  if (isLoading || isFetching) {
    return <div>Loading roles...</div>;
  }

  if (isError && error instanceof Error) {
    const axiosError = error as any;
    console.log(axiosError);
    if (
      axiosError.response &&
      (axiosError.response.status === 400 || axiosError.response.status === 401)
    ) {
      router.push("/auth/signin");
      return null;
    }
    return handleNetworkStatus(axiosError.response.status);
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
