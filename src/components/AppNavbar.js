import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4">
          K&K Fitness App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.id !== null && (
              <>
                <Nav.Link as={NavLink} to="/workouts">Workouts</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
