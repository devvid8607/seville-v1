import React from "react";

interface GenericErrorProps {
  message: string;
}

const GenericError: React.FC<GenericErrorProps> = ({ message }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
};

export default GenericError;
