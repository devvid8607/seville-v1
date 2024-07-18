const networkStatusMessages: { [key: number]: string } = {
  400: "Bad Request. Please try again.",
  401: "Unauthorized. Please login again.",
  404: "Not Found. The requested resource could not be found.",
  500: "Internal Server Error. Please try again later.",
  503: "Service Unavailable. Please try again later.",
};

export default networkStatusMessages;
