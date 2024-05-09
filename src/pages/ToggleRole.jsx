import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ToggleRole = ({ setAuthToken }) => {
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
      .post('https://autoshare-backend.onrender.com/auth/toggle-role', values)
      .then((response) => {
        setStatus({ success: response.data.message });
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'Role toggle failed';
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
          <h2>Toggle Role</h2>
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Toggle Role
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ToggleRole;
