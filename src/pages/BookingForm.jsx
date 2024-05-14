import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, FormGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { BookingContext } from '../context/BookingContext';
import AuthContext from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ vehicleId }) => {
  const { createBooking } = useContext(BookingContext);
  const { authToken, user } = useContext(AuthContext); // Access authToken from AuthContext
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const { vehicles, getUserById } = useContext(DataContext);

  const initialValues = {
    duration: 1,
  };

  const validationSchema = Yup.object().shape({
    duration: Yup.number().required('Duration is required').min(1, 'Duration must be at least 1'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Check if user is authenticated
      if (!authToken) {
        // Handle unauthenticated user
        console.error('User is not authenticated');
        return;
      }
  
      const vehicle = vehicles.find((v) => v._id === vehicleId);
      console.log(vehicle);
  
      // Step 1: Create order
      const orderResponse = await fetch('https://autoshare-backend.onrender.com/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount: vehicle.pricePerDay * values.duration * 100, // Set the amount based on your requirement
          currency: 'INR', // Set the currency based on your requirement
          receipt: '', // Set the receipt ID based on your requirement
        }),
      });
  
      const orderData = await orderResponse.json();
      console.log('Order created:', orderData);
      setOrderId(orderData.order.id);
  
      const customer = await getUserById(user.userId);

  console.log(values.duration);
  console.log(vehicle.pricePerDay)
      var options = {
        key: "rzp_test_2A5mcgKW1WIX3V", // Enter the Key ID generated from the Dashboard
        amount: vehicle.pricePerDay * values.duration * 100, // Calculate total amount based on duration
        currency: 'INR',
        name: "Auto share vehicles", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: orderData.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          console.log("this handler :: ", response);
          const body = {
            ...response,
          };

          console.log(options.amount)
  
          console.log(body);
        
          const validateRes = await fetch(
            "https://autoshare-backend.onrender.com/payments/validate",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const jsonRes = await validateRes.json();
          console.log(jsonRes);
        
          // Create booking only if payment is successful
          if (jsonRes.msg === 'success') {
            await createBooking({ vehicleId, duration: values.duration });
            // Navigate to VehicleList after successful booking
            navigate('/vehicles', { replace: true });
          }
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: customer.name, //your customer's name
          email: customer.email,
          contact: customer.phone, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
  
      resetForm();
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <FormGroup>
            <BootstrapForm.Label>Duration (days)</BootstrapForm.Label>
            <Field
              type="number"
              name="duration"
              as={BootstrapForm.Control}
              placeholder="Enter duration"
              isInvalid={(touched, error) => touched && error}
            />
            <ErrorMessage name="duration" component="div" className="text-danger" />
          </FormGroup>
          <Button type="submit" disabled={isSubmitting}>
            Book
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
