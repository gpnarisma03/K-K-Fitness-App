import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import { UserProvider } from './UserContext'; 
import AppNavbar from './components/AppNavbar';
import RegistrationPage from './pages/RegisterPage';
import Logout from './pages/Logout';
import Workouts from './pages/Workouts.js';

// App can be considered as our Mother component
function App() {
    // State hook for the user state for global scope
    const [user, setUser] = useState({
        id: null,
        email: null
    });

    // State hook to track if user data is loaded
    const [loading, setLoading] = useState(true);

    // Function for clearing the local storage
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
                    console.log('user', data);
                    setUser({
                        id: data._id,
                        email: data.email
                    });
                    setLoading(false); // Set loading to false once the data is fetched
                });
        } else {
            setUser({
                id: null,
                email: null
            });
            setLoading(false); // Ensure loading is false if no user is authenticated
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Optional: show loading indicator while fetching user data
    }

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
