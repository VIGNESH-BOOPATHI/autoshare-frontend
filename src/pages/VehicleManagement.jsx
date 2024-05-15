import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

const VehicleManagement = () => {
  const [error, setError] = useState(null); // Error state
  const { user } = useContext(AuthContext); // Access user role
  const navigate = useNavigate(); // Navigation for redirection
  const { addVehicle } = useContext(DataContext); // Access addVehicle function

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
    vehicleImage: null, // Add photo field
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    pricePerDay: Yup.number().required('Required'),
    vehicleImage: Yup.mixed().required('Required'), // Add photo validation
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await addVehicle(values); // Use addVehicle from DataContext
      setError(null); // Reset error state
      navigate('/'); // Redirect to vehicle listing
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add vehicle'); // Handle error
    } finally {
      setSubmitting(false); // Re-enable form submission
    }
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
       {({ isSubmitting, setFieldValue }) => (
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

            {/* Add photo input */}
            <div className="mb-3">
              <label htmlFor="vehicleImage">Photo</label>
              <input
                type="file"
                name="vehicleImage"
                onChange={(event) => {
                  setFieldValue("vehicleImage", event.currentTarget.files[0]);
                }}
                className="form-control"
              />
              <ErrorMessage name="vehicleImage" component="div" className="text-danger" />
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