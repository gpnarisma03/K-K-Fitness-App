import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const RegistrationPage = () => {
  const navigate = useNavigate();

  // State variables for email, password, and confirm password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, confirmPassword]);

  function registerUser(e) {
    e.preventDefault();

    fetch('https://fitnessapp-api-ln8u.onrender.com/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Registered Successfully") {
          setEmail("");
          setPassword("");
          setConfirmPassword("");

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: data.message || "Registered Successfully",
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/workout');
          });
        } else {
          // Display error message from data.message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Something went wrong',
            confirmButtonColor: '#d33',
          });
        }
      })
      .catch((error) => {
        // Catch network errors or other issues
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'There was an issue with the registration process.',
          confirmButtonColor: '#d33',
        });
      });
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-center">
              <h3>Register</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={registerUser}>
                {/* Email */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                {/* Password and Confirm Password */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formConfirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  {isActive ? (
                    <Button variant="success" type="submit" id="submitBtn">
                      Submit
                    </Button>
                  ) : (
                    <Button variant="danger" type="submit" id="submitBtn" disabled>
                      Submit
                    </Button>
                  )}
                </div>
              </Form>

              {/* "Already Have an Account?" section */}
              <div className="mt-3 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="btn btn-link">
                    Click here to login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationPage;
