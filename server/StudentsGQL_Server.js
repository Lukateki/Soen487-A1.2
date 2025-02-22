const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

// Initialize SQLite database
let db;
(async () => {
    db = await open({
        filename: "./studentsinfo.sqlite",
        driver: sqlite3.Database,
    });
})();

// GraphQL Schema
typeDefs = gql`
    type Department {
        id: ID!
        name: String!
        address: String!
    }
    
    type Student {
        id: ID!
        first_name: String!
        last_name: String!
        student_id: String!
        address: String!
        department: Department!
    }

    type Query {
        studentsByDepartment(departmentId: ID!): [Student]
    }
`;

// Resolvers  students.department_id = ?
const resolvers = {
    Query: {
        studentsByDepartment: async (_, { departmentId }) => {
            return await db.all(
                `SELECT students.*, departments.name AS department_name, departments.address AS department_address 
                 FROM students 
                 JOIN departments ON students.department_id = departments.id 
                 WHERE departments.id = ?`, 
                [departmentId]
            );
        },
    },
    Student: {
        department: (student) => {
            return {
                id: student.department_id,
                name: student.department_name,
                address: student.department_address,
            };
        },
    },
};

//address: student.department_address,

// Initialize Apollo Server
async function startServer() {
    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log("Server ready at http://localhost:4000/graphql")
    );
}

startServer();
