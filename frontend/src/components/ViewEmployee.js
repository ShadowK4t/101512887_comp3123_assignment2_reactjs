import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import { getEmployeeById } from '../services/api';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeById(id);
      setEmployee(response.data);
    } catch (err) {
      setError('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!employee) return <Alert variant="warning" className="mt-5">Employee not found</Alert>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Employee Details</h2>
                <div>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => navigate(`/employees/edit/${employee._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/employees')}
                  >
                    Back to List
                  </Button>
                </div>
              </div>

              <Row>
                <Col md={4} className="text-center mb-4">
                  {employee.profile_picture ? (
                    <Image
                      src={`${process.env.REACT_APP_API_URL.replace('/api/v1', '')}/uploads/${employee.profile_picture}`}
                      roundedCircle
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                  ) : (
                    <div
                      className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-circle mx-auto"
                      style={{ width: '200px', height: '200px', fontSize: '48px' }}
                    >
                      {employee.first_name[0]}{employee.last_name[0]}
                    </div>
                  )}
                </Col>
                <Col md={8}>
                  <h3>{employee.first_name} {employee.last_name}</h3>
                  <hr />
                  <Row className="mb-3">
                    <Col md={4}><strong>Email:</strong></Col>
                    <Col md={8}>{employee.email}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Position:</strong></Col>
                    <Col md={8}>{employee.position}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Department:</strong></Col>
                    <Col md={8}>{employee.department}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Salary:</strong></Col>
                    <Col md={8}>${employee.salary.toLocaleString()}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Date of Joining:</strong></Col>
                    <Col md={8}>{formatDate(employee.date_of_joining)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Created:</strong></Col>
                    <Col md={8}>{formatDate(employee.created_at)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}><strong>Last Updated:</strong></Col>
                    <Col md={8}>{formatDate(employee.updated_at)}</Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewEmployee;
