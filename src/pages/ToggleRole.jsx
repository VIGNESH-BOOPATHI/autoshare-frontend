import React, { useContext } from 'react'; // Import useContext
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Navigation
import AuthContext from '../context/AuthContext'; // AuthContext for updating token

const ToggleRole = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext); // Context for user and login
  const initialValues = {
    email: user?.email || '', // Default to user's email
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'), // Need password to confirm identity
  });

  const onSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post('https://autoshare-backend.onrender.com/auth/toggle-role', values) // Request to toggle role
      .then((response) => {
        const newToken = response.data.token; // New token with updated role
        login(newToken); // Store the new token
        navigate('/'); // Navigate back to Home
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || 'Toggle role failed'; // Handle error
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
          <h2>Toggle Role</h2>
          {status?.error && <div className="text-danger">{status.error}</div>} // Display error
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
