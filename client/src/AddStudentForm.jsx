// src/AddStudentForm.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`;

const GET_STUDENTS_BY_DEPARTMENT = gql`
  query GetStudentsByDepartment($departmentId: ID!) {
    studentsByDepartment(departmentId: $departmentId) {
      id
      first_name
      last_name
      student_id
      address
      department {
        id
        name
      }
    }
  }
`;

const ADD_STUDENT = gql`
  mutation AddStudent(
    $first_name: String!
    $last_name: String!
    $address: String!
    $departmentId: ID!
    $student_id: String!
  ) {
    addStudent(
      first_name: $first_name
      last_name: $last_name
      address: $address
      departmentId: $departmentId
      student_id: $student_id
    ) {
      id
      first_name
      last_name
      student_id
      address
      department {
        id
        name
      }
    }
  }
`;

function AddStudentForm() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);
  
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    address: '',
    departmentId: '',
    student_id: ''
  });

  const [addStudent, { error: mutationError }] = useMutation(ADD_STUDENT, {
    refetchQueries: [
      {
        query: GET_STUDENTS_BY_DEPARTMENT,
        variables: { departmentId: formState.departmentId },
      },
    ],
    awaitRefetchQueries: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.departmentId) {
      alert('Please select a department');
      return;
    }
    addStudent({
      variables: {
        first_name: formState.first_name,
        last_name: formState.last_name,
        address: formState.address,
        departmentId: formState.departmentId,
        student_id: formState.student_id,
      },
    })
      .then((res) => {
        console.log('Student added:', res.data);
        alert('Student added successfully!');
        setFormState({
          first_name: '',
          last_name: '',
          address: '',
          departmentId: '',
          student_id: '',
        });
      })
      .catch((err) => console.error('Error adding student:', err));
  };

  if (loading) return <p>Loading departments...</p>;
  if (error) return <p>Error loading departments.</p>;

  return (
    <div>
      <h2>Add a New Student</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            name="first_name"
            value={formState.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="last_name"
            value={formState.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="address"
            value={formState.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="student_id"
            value={formState.student_id}
            onChange={handleChange}
            placeholder="Student ID"
          />
          <select
            name="departmentId"
            value={formState.departmentId}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {data.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Student</button>
        </div>
      </form>
      {mutationError && <p style={{ color: 'red' }}>Error adding student.</p>}
    </div>
  );
}

export default AddStudentForm;
