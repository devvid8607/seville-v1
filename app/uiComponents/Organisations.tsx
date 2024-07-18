// components/Organisations.tsx
// "use client";
// import React, { useEffect } from "react";

// import handleNetworkStatus from "../lib/utils/handleAxiosStatus";
// import useFetch from "../lib/hooks/useFetch";
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

// const Organisations: React.FC = () => {
//   const router = useRouter();
//   const {
//     data: organisations,
//     error: organisationsError,
//     status: organisationStatus,
//     loading: loadingOrganisations,
//     sendRequest: fetchOrganisations,
//   } = useFetch<Organisation[]>("/api/organisations");

//   useEffect(() => {
//     fetchOrganisations();
//   }, [fetchOrganisations]);

//   useEffect(() => {
//     if (
//       organisationsError &&
//       (organisationStatus === 401 || organisationStatus === 400)
//     ) {
//       router.push("/auth/signin");
//     }
//   }, [organisationsError, organisationStatus, router]);

//   if (loadingOrganisations) {
//     return <p>Loading organisations...</p>;
//   }

//   if (organisationsError && organisationStatus) {
//     return handleNetworkStatus(organisationStatus);
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

// import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../helpers/apiClient";
import { useRouter } from "next/navigation";
import handleNetworkStatus from "../_lib/_utils/handleAxiosStatus";

const fetchOrganisations = async (): Promise<Organisation[]> => {
  return apiGet<Organisation[]>("/organisations");
};

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
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<Organisation[], Error>({
    queryKey: ["fetchorg"],
    queryFn: fetchOrganisations,
    refetchOnWindowFocus: true,
  });

  if (isLoading || isFetching) {
    return <p>Loading organisations...</p>;
  }

  if (isError) {
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
