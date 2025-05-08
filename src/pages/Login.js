import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, Link, useNavigate  } from 'react-router-dom'; 
import Swal from 'sweetalert2';

import UserContext from '../UserContext'; 

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    e.preventDefault();

    fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
	.then(data => {
		if (data.access !== undefined) {
		  localStorage.setItem('token', data.access);
		  retrieveUserDetails(data.access);
		  setEmail('');
		  setPassword('');
		  Swal.fire({
			icon: 'success',
			title: 'Logged In',
			text: 'You are now logged in',
			confirmButtonColor: '#3085d6'
		  });
		} else if (data.error === "No Email Found") {
		  Swal.fire({
			icon: 'error',
			title: 'Login Failed',
			text: 'Email does not exist',
			confirmButtonColor: '#d33'
		  });
		} else if (data.message === "Email and password do not match") {
		  Swal.fire({
			icon: 'error',
			title: 'Login Failed',
			text: 'Email and password do not match',
			confirmButtonColor: '#d33'
		  });
		} else {
		  Swal.fire({
			icon: 'error',
			title: 'Login Failed',
			text: `${email} does not exist`,
			confirmButtonColor: '#d33'
		  });
		}
	  })
	  
  }

  function retrieveUserDetails(token) {
	fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
	  headers: {
		Authorization: `Bearer ${token}`
	  }
	})
	.then(res => res.json())
	.then(data => {
	  setUser({
		id: data._id,
		email: data.email
	  });
  
	  // Redirect after setting the user
	  navigate('/workouts');
	});
  }
  

  useEffect(() => {
    if(email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    user.id !== null ? 
      <Navigate to="/workouts" />
    : 
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="mx-auto p-4 border rounded shadow-lg bg-white">
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={(e) => authenticate(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            { 
              isActive ? 
                <Button variant="primary" type="submit" className="w-100" id="loginBtn">
                  Login
                </Button>
              : 
                <Button variant="danger" type="submit" className="w-100" id="loginBtn" disabled>
                  Login
                </Button>
            }

            <div className="mt-3 text-center">
              <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
