import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const VerifyOTP = ({ email, setAuthToken }) => {
  const initialValues = {
    otp: '',
  };

  const validationSchema = Yup.object({
    otp: Yup.string().required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    const data = { email, otp: values.otp };
    
    axios
      .post('https://autoshare-backend.onrender.com/auth/verify-otp', data)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('authToken', token); // Store JWT in localStorage
        setAuthToken(token); // Set the token in context or state
        setStatus({ success: 'OTP verified successfully' });
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'OTP verification failed';
        setStatus({ error: errorMsg });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, status }) => (
        <div className="container">
          <h2>Verify OTP</h2>
          {status?.error && <div className="text-danger">{status.error}</div>}
          {status?.success && <div className="text-success">{status.success}</div>}
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
