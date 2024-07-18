// "use client";
// import React, { useEffect, useState } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import useOrganisations from "../lib/hooks/useOrganisations";
// import useRoles from "../lib/hooks/useRoles";
// import handleNetworkStatus from "../lib/utils/handleAxiosStatus";

// const LoginComponent = () => {
//   const { status, data } = useSession();
//   const router = useRouter();

//   // Fetch data hooks
//   const {
//     data: organisations,
//     error: organisationsError,
//     status: organisationStatus,
//     loading: loadingOrganisations,
//     sendRequest: fetchOrganisations,
//   } = useOrganisations();

//   const {
//     data: roles,
//     error: rolesError,
//     status: rolesStatus,
//     loading: loadingRoles,
//     sendRequest: fetchRoles,
//   } = useRoles();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin");
//     }
//   }, [status, router]);

//   // Handle network errors within the component
//   useEffect(() => {
//     if (
//       organisationsError &&
//       (organisationStatus === 401 || organisationStatus === 400)
//     ) {
//       router.push("/auth/signin");
//     }
//   }, [organisationsError, organisationStatus, router]);

//   useEffect(() => {
//     if (rolesError && (rolesStatus === 401 || rolesStatus === 400)) {
//       router.push("/auth/signin");
//     }
//   }, [rolesError, rolesStatus, router]);

//   // Combine network statuses for error handling
//   const combinedStatus = organisationsError ? organisationStatus : rolesStatus;

//   if (
//     combinedStatus &&
//     combinedStatus !== 200 &&
//     combinedStatus !== 401 &&
//     combinedStatus !== 400
//   ) {
//     const errorComponent = handleNetworkStatus(combinedStatus);
//     return errorComponent;
//   }

//   if (status === "unauthenticated") {
//     return (
//       <button onClick={() => signIn("Credentials", { callbackUrl: "/" })}>
//         Login
//       </button>
//     );
//   }

//   return (
//     <div>
//       <div>
//         <Link href="/dashboard">DashBoard - Plain Glide Grid</Link>
//       </div>

//       <div style={{ marginTop: 15 }}>
//         <Link href="/sevilleGrid">Seville Glide Grid</Link>
//       </div>

//       <div style={{ marginTop: 15 }}>
//         <Link href="/gqlTest">GQL Test using apollo</Link>
//       </div>

//       <div style={{ marginTop: 15 }}>
//         <Link href="/gqlAxiosTest">GQL Test using Axios</Link>
//       </div>

//       <div style={{ marginTop: 15 }}>
//         <Link href="/testImports">GQL Test using Axios & Parameters</Link>
//       </div>

//       <div style={{ marginTop: 15 }}>
//         <Link href="/canvas">Canvas</Link>
//       </div>
//       <div>
//         <p>Email: {data?.user.email}</p>
//         <p>First Name: {data?.user.firstName}</p>
//         <p>Last Name: {data?.user.lastName}</p>
//         <p>Username: {data?.user.userName}</p>
//         <p>Phone Number: {data?.user.phoneNumber}</p>
//       </div>
//       <div style={{ marginTop: 15 }}>
//         <span>
//           <button onClick={() => fetchOrganisations()}>
//             Get Organisations
//           </button>
//         </span>
//       </div>
//       <div style={{ marginTop: 15 }}>
//         <span>
//           <button onClick={() => fetchRoles()}>Get Available Roles</button>
//         </span>
//       </div>
//       <div style={{ marginTop: 15 }}>
//         <Link href="/api/auth/signout">SignOut</Link>
//       </div>
//       <div>
//         {organisationsError && (
//           <p>
//             Error: {organisationsError}-{organisationStatus}
//           </p>
//         )}
//         {loadingOrganisations && <p>Loading org...</p>}
//         {organisations && organisations.length > 0 && (
//           <table>
//             <thead>
//               <tr>
//                 <th>Organisation ID</th>
//                 <th>Organisation Name</th>
//                 <th>Organisation Code</th>
//                 <th>Address 1</th>
//                 <th>Address 2</th>
//                 <th>Suburb</th>
//                 <th>City</th>
//                 <th>State</th>
//                 <th>Post Code</th>
//                 <th>Country</th>
//                 <th>Phone Number</th>
//                 <th>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {organisations.map((org) => (
//                 <tr key={org.organisationId}>
//                   <td>{org.organisationId}</td>
//                   <td>{org.organisationName}</td>
//                   <td>{org.organisationCode}</td>
//                   <td>{org.address1}</td>
//                   <td>{org.address2}</td>
//                   <td>{org.suburb}</td>
//                   <td>{org.city}</td>
//                   <td>{org.state}</td>
//                   <td>{org.postCode}</td>
//                   <td>{org.country}</td>
//                   <td>{org.phoneNumber}</td>
//                   <td>{org.email}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//       <div>
//         {rolesError && (
//           <p>
//             Error: {rolesError}-{rolesStatus}
//           </p>
//         )}
//         {loadingRoles && <p>Loading roles...</p>}
//       </div>
//       {roles && roles.length > 0 && (
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
//       )}
//     </div>
//   );
// };

// export default LoginComponent;

import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Organisations from "./Organisations";
import Roles from "./Roles";
const LoginComponent = () => {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return (
      <button onClick={() => signIn("Credentials", { callbackUrl: "/" })}>
        Login
      </button>
    );
  }

  return (
    <div>
      <div>
        <Link href="/testCanvas">Test Canvas</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/dashboard">DashBoard - Plain Glide Grid</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/sevilleGrid">Seville Glide Grid</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/gqlTest">GQL Test using apollo</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/gqlAxiosTest">GQL Test using Axios</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/testImports">GQL Test using Axios & Parameters</Link>
      </div>

      <div style={{ marginTop: 15 }}>
        <Link href="/canvas">Canvas</Link>
      </div>
      <div>
        <p>Email: {data?.user.email}</p>
        <p>First Name: {data?.user.firstName}</p>
        <p>Last Name: {data?.user.lastName}</p>
        <p>Username: {data?.user.userName}</p>
        <p>Phone Number: {data?.user.phoneNumber}</p>
      </div>
      <div style={{ marginTop: 15 }}>
        <Organisations />
      </div>
      <div style={{ marginTop: 15 }}>
        <Roles />
      </div>
      <div style={{ marginTop: 15 }}>
        <Link href="/api/auth/signout">SignOut</Link>
      </div>
    </div>
  );
};

export default LoginComponent;
