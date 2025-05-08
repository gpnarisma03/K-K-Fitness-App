import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import { UserProvider } from './UserContext'; 
import AppNavbar from './components/AppNavbar';
import RegistrationPage from './pages/RegisterPage';
import Logout from './pages/Logout';
import Workouts from './pages/Workouts.js';

function App() {
    const [user, setUser] = useState({
        id: null,
        email: null
    });

    const [loading, setLoading] = useState(true);

    function unsetUser() {
        localStorage.clear();
    }

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser({
                        id: data._id,
                        email: data.email
                    });
                    setLoading(false);
                });
        } else {
            setUser({
                id: null,
                email: null
            });
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const isLoggedIn = user.id !== null;

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to={isLoggedIn ? "/workouts" : "/login"} replace />} />
                        <Route path="/login" element={isLoggedIn ? <Navigate to="/workouts" replace /> : <Login />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/workouts" element={isLoggedIn ? <Workouts /> : <Navigate to="/login" replace />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
