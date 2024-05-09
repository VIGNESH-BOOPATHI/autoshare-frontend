import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom'; // For navigation
import * as Yup from 'yup'; // For validation
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); // React Router navigation hook

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post('https://autoshare-backend.onrender.com/auth/login', values) // Send login request
      .then((response) => {
        const otpMessage = 'OTP sent. Please enter it to complete the login.';
        const isOtpSent = response.data.message === otpMessage; // Check if OTP was sent

        if (isOtpSent) {
          // Navigate to VerifyOTP, passing the email
          navigate('/verify-otp', { state: { email: values.email } });
        } else {
          setStatus({ error: 'Login failed' }); // Default error handling
        }
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'Login failed'; // Handle error
        setStatus({ error: errorMsg });
      })
      .finally(() => {
        setSubmitting(false); // Re-enable form submission
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, status }) => (
        <div className="container">
          <h2>Login</h2>
          {status?.error && <div className="text-danger">{status.error}</div>} // Display error message
          <Form>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Send OTP
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default Login;
