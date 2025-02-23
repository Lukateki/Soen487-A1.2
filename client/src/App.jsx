// src/App.jsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import DepartmentSelector from './DepartmentSelector';
import AddStudentForm from './AddStudentForm';

function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ marginLeft: 50, marginTop: 50 }}>
        <h1>Student Information System</h1>
        <DepartmentSelector />
        <hr />
        <AddStudentForm />
      </div>
    </ApolloProvider>
  );
}

export default App;
