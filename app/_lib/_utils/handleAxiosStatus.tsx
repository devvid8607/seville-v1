// utils/handleNetworkStatus.tsx
import GenericError from "../_components/GenericError";
import networkStatusMessages from "./networkStatusMessages";

const handleNetworkStatus = (statusCode: number) => {
  // Get the error message from the mapping or use a default message
  const message =
    networkStatusMessages[statusCode] ||
    "An unexpected error occurred. Please try again later.";

  // Render the GenericError component with the appropriate message
  console.log("rendering generic error");
  return <GenericError message={message} />;
};

export default handleNetworkStatus;
