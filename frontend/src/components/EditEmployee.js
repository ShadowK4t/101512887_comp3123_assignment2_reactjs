import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Image } from 'react-bootstrap';
import { getEmployeeById, updateEmployee } from '../services/api';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: '',
    profile_picture: null
  });
  const [currentPicture, setCurrentPicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeById(id);
      const employee = response.data;
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        position: employee.position,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining.split('T')[0],
        department: employee.department,
        profile_picture: null
      });
      setCurrentPicture(employee.profile_picture);
    } catch (err) {
      setError('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await updateEmployee(id, formData);
      alert('Employee updated successfully!');
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Employee</h2>
                <Button variant="secondary" onClick={() => navigate('/employees')}>
                  Back to List
                </Button>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}

              {currentPicture && (
                <div className="text-center mb-4">
                  <p className="text-muted">Current Profile Picture:</p>
                  <Image
                    src={`${process.env.REACT_APP_API_URL.replace('/api/v1', '')}/uploads/${currentPicture}`}
                    rounded
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        maxLength="50"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        maxLength="50"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position *</Form.Label>
                      <Form.Control
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        maxLength="100"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Department *</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        maxLength="100"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salary *</Form.Label>
                      <Form.Control
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Joining *</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_joining"
                        value={formData.date_of_joining}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Update Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Leave empty to keep current picture. Accepted formats: JPG, PNG, GIF (Max 5MB)
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating Employee...' : 'Update Employee'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditEmployee;
