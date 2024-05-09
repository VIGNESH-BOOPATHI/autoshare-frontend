import React from 'react';
import { useLocation } from 'react-router-dom'; // For accessing passed data
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const VerifyOTP = () => {
  const location = useLocation(); // Access location data
  const email = location.state?.email; // Retrieve the email passed from Login

  const initialValues = {
    otp: '',
  };

  const validationSchema = Yup.object({
    otp: Yup.string().required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    const data = { email, otp: values.otp }; // Include email in the request
    
    axios
      .post('https://autoshare-backend.onrender.com/auth/verify-otp', data) // Verify OTP with email
      .then((response) => {
        const token = response.data.token;
        // Handle successful verification (e.g., store token, navigate to a new page)
        console.log("OTP comfirmed");
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'OTP verification failed'; // Handle error
        setStatus({ error: errorMsg });
      })
      .finally(() => {
        setSubmitting(false); // Re-enable form submission
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, status }) => (
        <div className="container">
          <h2>Verify OTP</h2>
          {status?.error && <div className="text-danger">{status.error}</div>} // Display error
          <Form>
            <div className="mb-3">
              <label htmlFor="otp">Enter OTP</label>
              <Field type="text" name="otp" className="form-control" />
              <ErrorMessage name="otp" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Verify
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default VerifyOTP;
