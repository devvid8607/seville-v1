// components/Organisations.tsx
import React, { useEffect } from "react";
import useOrganisations from "../nonRouted/hooks/useOrganisations";
import handleNetworkStatus from "../nonRouted/utils/handleAxiosStatus";

const Organisations: React.FC = () => {
  const {
    data: organisations,
    error: organisationsError,
    status: organisationStatus,
    loading: loadingOrganisations,
    sendRequest: fetchOrganisations,
  } = useOrganisations();

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  // Handle network errors
  if (
    organisationsError &&
    (organisationStatus === 401 || organisationStatus === 400)
  ) {
    return handleNetworkStatus(organisationStatus);
  }

  if (loadingOrganisations) {
    return <p>Loading organisations...</p>;
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
