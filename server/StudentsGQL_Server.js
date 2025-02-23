// StudentGQL_server.js
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let db;
(async () => {
  db = await open({
    filename: "./studentsinfo.sqlite",
    driver: sqlite3.Database,
  });
})();

const typeDefs = gql`
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
    departments: [Department]
  }

  type Mutation {
    addStudent(
      first_name: String!
      last_name: String!
      address: String!
      departmentId: ID!
      student_id: String!
    ): Student
  }
`;

const resolvers = {
  Query: {
    studentsByDepartment: async (_, { departmentId }) => {
      return await db.all(
        `SELECT students.*,
                departments.name AS department_name,
                departments.address AS department_address,
                departments.id AS department_id
         FROM students
         JOIN departments ON students.department_id = departments.id
         WHERE departments.id = ?`,
        [departmentId]
      );
    },
    departments: async () => {
      return await db.all(`SELECT * FROM departments`);
    },
  },
  Mutation: {
    addStudent: async (_, { first_name, last_name, address, departmentId, student_id }) => {
      // Move the ID processing logic here on the server
      let processedId = student_id.trim();
      if (processedId[0]?.toUpperCase() === "S") {
        processedId = processedId.substring(1);
      }
      processedId = processedId.replace(/^0+/, "");

      try {
        const result = await db.run(
          `INSERT INTO students (first_name, last_name, address, department_id, student_id)
           VALUES (?, ?, ?, ?, ?)`,
          [first_name, last_name, address, departmentId, processedId]
        );

        const insertedStudent = await db.get(
          `SELECT students.*,
                  departments.name AS department_name,
                  departments.address AS department_address,
                  departments.id AS department_id
           FROM students
           JOIN departments ON students.department_id = departments.id
           WHERE students.id = ?`,
          [result.lastID]
        );

        return insertedStudent;
      } catch (err) {
        console.error("SQL Insert Error:", err);
        throw new Error("Error inserting student");
      }
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
