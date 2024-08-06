import React from 'react';
import { Nav, Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container id="footer">
        <Nav className="ml-auto" />
        <div style={{ textAlign: 'center' }}></div>
      </Container>
    </footer>
  );
};

export default Footer;
