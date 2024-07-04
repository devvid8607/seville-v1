// import { ApolloClient, InMemoryCache } from "@apollo/client";
// const APIKEY = "2426f99ff0bb4f04a0454cbd7a5a2308";
// const client = new ApolloClient({
//   uri: "https://dev-gateway.seville.studio/graphql",
//   cache: new InMemoryCache(),
//   headers: {
//     "Ocp-Apim-Subscription-Key": APIKEY,
//   },
// });

// export default client;

// lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { signIn } from "next-auth/react";

const APIKEY = "2426f99ff0bb4f04a0454cbd7a5a2308";

const httpLink = new HttpLink({
  uri: "https://dev-gateway.seville.studio/graphql", // Replace with your GraphQL endpoint
});

const fetchToken = async () => {
  const response = await fetch("/api/auth/token");
  if (!response.ok) {
    // throw new Error("Failed to fetch token");
    signIn();
  }
  const data = await response.json();
  return data.access_token;
};

const authLink = setContext(async (_, { headers }) => {
  // Add your authentication headers here if needed
  //   const session = await getSession();
  const token = await fetchToken();
  console.log("token data", token);

  return {
    headers: {
      ...headers,
      "Ocp-Apim-Subscription-Key": APIKEY,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
