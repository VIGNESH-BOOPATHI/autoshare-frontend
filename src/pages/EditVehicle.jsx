import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const EditVehicle = ({refreshVehicleList}) => {
  const { id } = useParams(); // Get the vehicle ID from URL parameters
  const { updateVehicle } = useContext(DataContext); // Get the updateVehicle function from context
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Navigation for redirection
  const [vehicle, setVehicle] = useState(null); // Vehicle details state
  const { vehicles} = useContext(DataContext);
  const [refreshKey, setRefreshKey] = useState(true); // State to toggle component refresh


  useEffect(() => {
    const vehicleDetails = vehicles.find((v) => v._id === id); // Find the vehicle in the context data
    if (vehicleDetails) {
      setVehicle(vehicleDetails);
    } else {
      setError('Vehicle not found');
    }
  }, [id, vehicles, refreshKey]);

  const initialValues = {
    name: vehicle ? vehicle.name : '', // Fill with vehicle name if available
    category: vehicle ? vehicle.category : '', // Fill with vehicle category if available
    pricePerDay: vehicle ? vehicle.pricePerDay : '', // Fill with vehicle pricePerDay if available
    available: vehicle ? vehicle.available.toString() : 'true', // Convert to string if available
    vehicleImage: null, // Add photo field
  };

  const validationSchema = Yup.object({
    name: Yup.string(),
    category: Yup.string(),
    pricePerDay: Yup.number(),
    vehicleImage: Yup.mixed().test('file', 'Please select a file', value => {
      if (value === null) {
        return true; // Allow null value
      }
      return !!value; // Check if a file is selected
    }),
  });
  

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove vehicleImage field if it's null
      if (values.vehicleImage === null) {
        delete values.vehicleImage;
      }
      // Update the vehicle, including the image, by calling the updateVehicle function
      await updateVehicle(id, values);
      setError(null); // Reset error state
      navigate(`/vehicles`); // Redirect to vehicle listing
      refreshVehicleList();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update vehicle'); // Handle error
    } finally {
      setSubmitting(false); // Re-enable form submission
      if (!error) {
        setRefreshKey((prevKey) => !prevKey); // Toggle refresh key to force remounting
      }
    }
  };
  

  return (
    <Container key={refreshKey ? '1' : '2'}>
      <h2>Edit Vehicle</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error */}
      {vehicle && (
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
                Save Changes
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default EditVehicle;
