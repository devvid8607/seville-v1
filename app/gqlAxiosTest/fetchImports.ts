import axios from "axios";

const fetchGraphQL = async <T>(query: string, variables = {}) => {
  console.log("query", query, "variables", variables);
  try {
    const response = await axios.post(
      "/api/gqlApis",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    return response.data.data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw new Error("Failed to fetch data");
  }
};

export default fetchGraphQL;
