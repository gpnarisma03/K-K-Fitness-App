import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

function AppNavbar() {
  const { user } = useContext(UserContext);

  

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="position-relative" style={{ minHeight: '70px' }}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="center-brand d-flex align-items-center" style={{ height: '100%' }}>
          <h1 className="fs-3 mb-0">K&K Fitness App</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            
            {user.id !== null ? (
              <>

                <Nav.Link as={NavLink} to="/workouts">Workouts</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
