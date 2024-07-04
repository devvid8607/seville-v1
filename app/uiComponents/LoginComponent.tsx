"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

interface Organisation {
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

const LoginComponent = () => {
  const { status, data } = useSession();
  console.log("data", data);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetOrganisations = async () => {
    if (status === "unauthenticated") {
      signIn("Credentials", { callbackUrl: "/" });
      return;
    }
    try {
      const response = await fetch("/api/organisations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("result", result);
        setOrganisations(result);
      } else {
        setError(result.message);
        console.error("Failed to fetch organizations:", result);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };
  console.log("organisations", organisations);
  return (
    <div>
      {status === "unauthenticated" && (
        // <Link href="/api/auth/signin">Login</Link>
        <button onClick={() => signIn("Credentials", { callbackUrl: "/" })}>
          Login
        </button>
      )}
      {status === "authenticated" && (
        <div>
          <div>
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
            <p>Email: {data.user.email}</p>
            <p>First Name: {data.user.firstName}</p>
            <p>Last Name: {data.user.lastName}</p>
            <p>Username: {data.user.userName}</p>
            <p>Phone Number: {data.user.phoneNumber}</p>
          </div>
          <div>
            <span>
              <button onClick={handleGetOrganisations}>
                Get Organisations
              </button>
              <Link href="/api/auth/signout">SignOut</Link>
            </span>
          </div>
          <div>
            {error && <p>Error: {error}</p>}
            {organisations &&
              organisations !== undefined &&
              organisations.length > 0 && (
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
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
