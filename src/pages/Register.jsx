import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Register = () => {
  const initialValues = {
    email: '',
    password: '',
    name: '',
    location: '',
    phone: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    name: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post('https://autoshare-backend.onrender.com/auth/register', values)
      .then((response) => {
        setStatus({ success: response.data.message });
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'Registration failed';
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
          <h2>Register</h2>
          {status?.error && <div className="text-danger">{status.error}</div>}
          {status?.success && <div className="text-success">{status.success}</div>}
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
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="location">Location</label>
              <Field type="text" name="location" className="form-control" />
              <ErrorMessage name="location" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Phone</label>
              <Field type="text" name="phone" className="form-control" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default Register;
