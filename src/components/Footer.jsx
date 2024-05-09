import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer bg-light text-center py-3">
    <div className="container">
      <span>&copy; {new Date().getFullYear()} AutoShare. All rights reserved.</span>
      <div className="mt-2">
        <Link to="/page/about" className="text-muted me-2">About</Link>
        <Link to="/page/contact" className="text-muted me-2">Contact</Link>
        <Link to="/page/terms-conditions" className="text-muted me-2">Terms</Link>
        <Link to="/page/privacy-policy" className="text-muted me-2">Privacy</Link>
      </div>
      <div className="mt-2">
        <a href="https://facebook.com" className="text-muted me-2">Facebook</a>
        <a href="https://twitter.com" className="text-muted me-2">Twitter</a>
        <a href="https://instagram.com" className="text-muted">Instagram</a>
      </div>
    </div>
  </footer>
);

export default Footer;
