// utils/handleNetworkStatus.tsx
import { useRouter } from "next/navigation";
import networkStatusMessages from "./networkStatusMessages";
import GenericError from "../components/GenericError";

const handleNetworkStatus = (statusCode: number) => {
  // const router = useRouter();

  // Check if the status code requires a redirect
  // if (statusCode === 401 || statusCode === 400) {
  //   redirect("/auth/signin");
  //   return null;
  // }

  // Get the error message from the mapping or use a default message
  const message =
    networkStatusMessages[statusCode] ||
    "An unexpected error occurred. Please try again later.";

  // Render the GenericError component with the appropriate message
  return <GenericError message={message} />;
};

export default handleNetworkStatus;
