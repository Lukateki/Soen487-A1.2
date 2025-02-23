// src/DepartmentSelector.jsx
import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';

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
      first_name
      last_name
      student_id
      department {
        name
      }
    }
  }
`;

function DepartmentSelector() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);
  const [fetchStudents, { data: studentData, loading: studentLoading, error: studentError }] = useLazyQuery(GET_STUDENTS_BY_DEPARTMENT);
  const [selectedDept, setSelectedDept] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDept) {
      fetchStudents({ variables: { departmentId: selectedDept } });
    }
  };

  const formatStudentId = (id) => {
    return `S${String(id).padStart(5, "0")}`;
  };

  return (
    <div>
      <h2>Select a Department</h2>
      {loading && <p>Loading departments...</p>}
      {error && <p>Error loading departments.</p>}
      {data && (
        <form onSubmit={handleSubmit}>
          {data.departments.map((dept) => (
            <div key={dept.id}>
              <input 
                type="radio" 
                name="department" 
                value={dept.id} 
                checked={selectedDept === dept.id}
                onChange={(e) => setSelectedDept(e.target.value)}
              />
              <label>{dept.name}</label>
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
      {studentLoading && <p>Loading students...</p>}
      {studentError && <p>Error loading students.</p>}
      {studentData && studentData.studentsByDepartment && (
        <div>
          <h3>Students in Department</h3>
          <table border="1">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Student ID</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {studentData.studentsByDepartment.map((student, index) => (
                <tr key={index}>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{formatStudentId(student.student_id)}</td>
                  <td>{student.department.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DepartmentSelector;
