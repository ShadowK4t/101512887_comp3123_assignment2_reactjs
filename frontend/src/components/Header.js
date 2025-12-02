import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="secondary" variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand className="mx-auto">
          <h4 className="mb-0">Employee Management App</h4>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
