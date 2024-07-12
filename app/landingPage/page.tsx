"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginComponent from "../uiComponents/LoginComponent";
const LandingPage = () => {
  const { status, data } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") router.push("/auth/signin");
  //   else return router.push("/dashboard");
  return (
    <div>
      <LoginComponent />
    </div>
  );
};

export default LandingPage;
