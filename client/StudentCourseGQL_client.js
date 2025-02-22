const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
const fetch = require('cross-fetch');

// Initialize Apollo Client
const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql', // GraphQL API endpoint
    cache: new InMemoryCache(),
    fetch
});

// GraphQL query to fetch courses for a student
const GET_STUDENT_COURSES = gql`
    query GetStudentCourses($studentId: ID!) {
        studentCourses(studentId: $studentId) {
            id
            name
            course_number
        }
    }
`;

// Function to fetch student courses
async function fetchStudentCourses(studentId) {
    try {
        const { data } = await client.query({
            query: GET_STUDENT_COURSES,
            variables: { studentId }
        });
        console.log('Courses:', data.studentCourses);
    } catch (error) {
        console.error('Error fetching student courses:', error);
    }
}

// Example usage
fetchStudentCourses("1");
