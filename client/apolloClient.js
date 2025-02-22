const fetch = require("node-fetch");

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

// GraphQL query
const query = `
    query GetHello {
        hello
    }
`;

// Function to send a request to the GraphQL server
async function fetchData() {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });
        
        const data = await response.json();
        console.log("Response:", data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to fetch data
fetchData();
