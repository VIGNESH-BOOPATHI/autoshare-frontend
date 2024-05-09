import React from 'react';
import { useParams } from 'react-router-dom';
import About from '../pages/About';
import Contact from '../pages/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import CancellationRefund from '../pages/CancellationRefund';

const pageComponents = {
  about: About,
  contact: Contact,
  'privacy-policy': PrivacyPolicy,
  'terms-conditions': TermsConditions,
  'cancellation-refund': CancellationRefund,
};

const Page = () => {
  const { pageName } = useParams(); // Get the dynamic parameter from the URL

  const PageComponent = pageComponents[pageName]; // Find the correct component to render

  if (!PageComponent) {
    return <div>Page not found</div>; // Handle invalid page names
  }

  return <PageComponent />; // Render the appropriate component
};

export default Page;
