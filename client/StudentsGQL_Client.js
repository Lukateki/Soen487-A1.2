const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");
const fetch = require("cross-fetch");

// Create Apollo Client
const client = new ApolloClient({
    uri: "http://localhost:4000/graphql", // GraphQL server endpoint
    cache: new InMemoryCache(),
    fetch
});

// GraphQL Query to fetch students by department ID
const GET_STUDENTS_BY_DEPARTMENT = gql`
    query GetStudentsByDepartment($departmentId: ID!) {
        studentsByDepartment(departmentId: $departmentId) {
            id
            first_name
            last_name
            address
            department {
                id
                name
                address               
            }
        }
    }
`;

/*
id
            first_name
            last_name
            student_id
            address
            department {
                id
                name
                address               
            }*/

// Function to fetch and display students
async function fetchStudents(departmentId) {
    try {
        const response = await client.query({
            query: GET_STUDENTS_BY_DEPARTMENT,
            variables: { departmentId }
        });
        console.log("Students:", response.data.studentsByDepartment);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// Example usage
fetchStudents("1"); // Replace "1" with the actual department ID
