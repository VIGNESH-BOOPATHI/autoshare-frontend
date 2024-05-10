import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const VehicleManagement = () => {
  const [error, setError] = useState(null); // Error state
  const { user } = useContext(AuthContext); // Access user role
  const navigate = useNavigate(); // Navigation for redirection

  if (!user || (user.role !== 'host' && user.role !== 'admin')) {
    return (
      <Container>
        <Alert variant="danger">You do not have permission to access this page.</Alert> {/* Access control */}
      </Container>
    );
  }

  const initialValues = {
    name: '',
    category: '',
    pricePerDay: '',
    available: 'true', // Default to 'available'
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    pricePerDay: Yup.number().required('Required'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    axios
      .post('https://autoshare-backend.onrender.com/vehicles', values) // Add new vehicle
      .then((response) => {
        setError(null); // Reset error state
        navigate('/vehicles'); // Redirect to vehicle listing
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Failed to add vehicle'); // Handle error
      })
      .finally(() => {
        setSubmitting(false); // Re-enable form submission
      });
  };

  return (
    <Container>
      <h2>Manage Vehicles</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="category">Category</label>
              <Field type="text" name="category" className="form-control" />
              <ErrorMessage name="category" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="pricePerDay">Price Per Day</label>
              <Field type="number" name="pricePerDay" className="form-control" />
              <ErrorMessage name="pricePerDay" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="available">Available</label>
              <Field as="select" name="available" className="form-control">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field>
              <ErrorMessage name="available" component="div" className="text-danger" />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              Add Vehicle
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default VehicleManagement;