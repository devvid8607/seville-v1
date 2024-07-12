// components/Organisations.tsx
"use client";
import React, { useEffect } from "react";

import handleNetworkStatus from "../nonRouted/utils/handleAxiosStatus";
import useFetch from "../nonRouted/hooks/useFetch";
import { useRouter } from "next/navigation";

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

const Organisations: React.FC = () => {
  const router = useRouter();
  const {
    data: organisations,
    error: organisationsError,
    status: organisationStatus,
    loading: loadingOrganisations,
    sendRequest: fetchOrganisations,
  } = useFetch<Organisation[]>("/api/organisations");

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  useEffect(() => {
    if (
      organisationsError &&
      (organisationStatus === 401 || organisationStatus === 400)
    ) {
      router.push("/auth/signin");
    }
  }, [organisationsError, organisationStatus, router]);

  if (loadingOrganisations) {
    return <p>Loading organisations...</p>;
  }

  if (organisationsError && organisationStatus) {
    return handleNetworkStatus(organisationStatus);
  }

  return (
    <div>
      {organisations && organisations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Organisation ID</th>
              <th>Organisation Name</th>
              <th>Organisation Code</th>
              <th>Address 1</th>
              <th>Address 2</th>
              <th>Suburb</th>
              <th>City</th>
              <th>State</th>
              <th>Post Code</th>
              <th>Country</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {organisations.map((org) => (
              <tr key={org.organisationId}>
                <td>{org.organisationId}</td>
                <td>{org.organisationName}</td>
                <td>{org.organisationCode}</td>
                <td>{org.address1}</td>
                <td>{org.address2}</td>
                <td>{org.suburb}</td>
                <td>{org.city}</td>
                <td>{org.state}</td>
                <td>{org.postCode}</td>
                <td>{org.country}</td>
                <td>{org.phoneNumber}</td>
                <td>{org.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No organisations found.</p>
      )}
    </div>
  );
};

export default Organisations;

// "use client";

// import React, { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

// export interface Organisation {
//   organisationId: string;
//   organisationName: string;
//   organisationCode: string;
//   address1: string;
//   address2: string;
//   suburb: string;
//   city: string;
//   state: string;
//   postCode: string;
//   country: string;
//   phoneNumber: string;
//   email: string;
// }

// const fetchOrganisations = async (): Promise<Organisation[]> => {
//   const response = await fetch("/api/organisations");
//   if (!response.ok) {
//     if (response.status === 401 || response.status === 400) {
//       throw new Error(`AuthError: ${response.status}`);
//     }
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };

// const Organisations: React.FC = () => {
//   const router = useRouter();
//   const {
//     data: organisations,
//     error,
//     isLoading,
//     isError,
//     status,
//   } = useQuery({
//     queryKey: ["organisations"],
//     queryFn: fetchOrganisations,
//     refetchOnWindowFocus: false, // Optional: Adjust refetch behavior
//   });

//   useEffect(() => {
//     if (isError && error instanceof Error) {
//       const errorMessage = error.message;
//       if (errorMessage.startsWith("AuthError:")) {
//         router.push("/auth/signin");
//       }
//     }
//   }, [isError, error, router]);

//   if (isLoading) {
//     return <p>Loading organisations...</p>;
//   }

//   if (isError && error instanceof Error) {
//     return <p>Error fetching organisations: {error.message}</p>;
//   }

//   return (
//     <div>
//       {organisations && organisations.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Organisation ID</th>
//               <th>Organisation Name</th>
//               <th>Organisation Code</th>
//               <th>Address 1</th>
//               <th>Address 2</th>
//               <th>Suburb</th>
//               <th>City</th>
//               <th>State</th>
//               <th>Post Code</th>
//               <th>Country</th>
//               <th>Phone Number</th>
//               <th>Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {organisations.map((org) => (
//               <tr key={org.organisationId}>
//                 <td>{org.organisationId}</td>
//                 <td>{org.organisationName}</td>
//                 <td>{org.organisationCode}</td>
//                 <td>{org.address1}</td>
//                 <td>{org.address2}</td>
//                 <td>{org.suburb}</td>
//                 <td>{org.city}</td>
//                 <td>{org.state}</td>
//                 <td>{org.postCode}</td>
//                 <td>{org.country}</td>
//                 <td>{org.phoneNumber}</td>
//                 <td>{org.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No organisations found.</p>
//       )}
//     </div>
//   );
// };

// export default Organisations;
