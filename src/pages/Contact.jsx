import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // For form validation
import { Button } from 'react-bootstrap'; // Use Bootstrap components

const Contact = () => {
  // Validation schema for the form using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

  // Initial values for the form
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  // Submit handler for the form
  const onSubmit = (values, { setSubmitting }) => {
    // Simulate form submission
    console.log('Form values:', values);

    // Simulate async action
    setTimeout(() => {
      setSubmitting(false); // Enable the submit button again
    }, 1000);
  };

  return (
    <div className="container">
      <h2>Contact Us</h2>
      <p>If you have any questions, please reach out at contact@autoshare.com.</p>

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
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="message">Message</label>
              <Field as="textarea" name="message" className="form-control" rows={3} />
              <ErrorMessage name="message" component="div" className="text-danger" />
            </div>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>

      {/* Example map */}
      <div className="mt-4">
        <iframe
          title="Location"
          width="100%"
          height="400"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.835434514723!2d-122.39997228469105!3d37.788249979757604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e201d23e083%3A0x7d0f1c73d42d8dd1!2sGoogle%20San Francisco!5e0!3m2!1sen!2sus!4v1638574701376!5m2!1sen!2sus"
          frameBorder="0"
          allowFullScreen=""
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
