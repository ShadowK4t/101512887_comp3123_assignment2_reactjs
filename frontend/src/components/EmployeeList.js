import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee, searchEmployees } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        alert('Error deleting employee');
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchDepartment && !searchPosition) {
      alert('Please enter a department or position to search');
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (searchDepartment) params.department = searchDepartment;
      if (searchPosition) params.position = searchPosition;

      const response = await searchEmployees(params);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error searching employees:', error);
      alert('Error searching employees');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchDepartment('');
    setSearchPosition('');
    fetchEmployees();
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee List</h2>
        <div>
          <Button variant="primary" className="me-2" onClick={() => navigate('/employees/add')}>
            Add Employee
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Search Employees</h5>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., IT, Design, Analytics"
                    value={searchDepartment}
                    onChange={(e) => setSearchDepartment(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Engineer, Designer"
                    value={searchPosition}
                    onChange={(e) => setSearchPosition(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Form.Group className="mb-3 w-100">
                  <Button variant="success" type="submit" className="me-2">
                    Search
                  </Button>
                  <Button variant="secondary" onClick={handleClearSearch}>
                    Clear
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.first_name} {employee.last_name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>${employee.salary.toLocaleString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  className="me-2"
                  onClick={() => navigate(`/employees/view/${employee._id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="me-2"
                  onClick={() => navigate(`/employees/edit/${employee._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EmployeeList;
