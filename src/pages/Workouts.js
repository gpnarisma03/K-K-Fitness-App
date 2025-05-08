import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { FaPlusCircle, FaEdit } from 'react-icons/fa';
import AddWorkout from '../components/addWorkout';
import EditWorkout from '../components/EditWorkout';
import DeleteWorkout from '../components/DeleteWorkout';
import CompleteWorkoutStatus from '../components/CompleteWorkStatus';

export default function Workouts() {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWorkouts = () => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data.workouts)) {
                        setWorkouts(data.workouts);
                    } else if (data.message === "No Workouts found.") {
                        setWorkouts([]); 

                    } else {
                        setError('Invalid data format.');
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching workouts:', error);
                    setError('Error fetching workouts.');
                    setIsLoading(false);
                });
        } else {
            setError('User not authenticated.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleEditWorkout = (workout) => {
        setSelectedWorkout(workout);
        setShowEditModal(true);
    };

    const handleCloseModal = () => setShowModal(false);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedWorkout(null);
    };

    const refreshWorkouts = () => {
        fetchWorkouts();
        setShowModal(false);
        setShowEditModal(false);
    };

    return (
        <Container className="mt-5">
                {workouts.length > 0 && (
                    <Row className="align-items-center mb-4">
                        <Col></Col>
                        <Col className="text-end">
                            <Button
                                id="addWorkout"
                                variant="success"
                                onClick={() => setShowModal(true)}
                            >
                                <FaPlusCircle className="me-2" /> Add Workout
                            </Button>
                        </Col>
                    </Row>
                )}

            {isLoading && <p className='text-center text-warning'>Loading workouts...</p>}
            {error && <p className="text-danger">{error}</p>}

            <Row>
                {workouts.length > 0 ? (
                    workouts.map((workout) => (
                        <Col key={workout._id} md={4} className="mb-4">
                            <Card className="shadow-sm rounded h-100">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title className="fw-bold fs-4">{workout.name}</Card.Title>
                                        <Card.Subtitle className="mb-3 text-muted">
                                            Duration: {workout.duration}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <strong>Status: </strong>
                                            <span className={`badge ${workout.status === 'success' ? 'bg-success' : workout.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {workout.status || 'N/A'}
                                            </span>
                                        </Card.Text>
                                        <Card.Text className="text-muted">
                                            <small>Date Added: {new Date(workout.dateAdded).toLocaleDateString() || 'N/A'}</small>
                                        </Card.Text>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3 gap-2">
                                        <Button
                                            variant="outline-warning"
                                            onClick={() => handleEditWorkout(workout)}
                                            className="flex-fill"
                                        >
                                            <FaEdit /> Edit
                                        </Button>

                                        <DeleteWorkout
                                            workoutId={workout._id}
                                            refreshWorkouts={refreshWorkouts}
                                        />

                                        {workout.status !== 'completed' && (
                                            <CompleteWorkoutStatus
                                                workoutId={workout._id}
                                                refreshWorkouts={refreshWorkouts}
                                            />
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="d-flex justify-content-center">
                        <Card className="text-center p-4 shadow mt-5" style={{ width: '100%', maxWidth: '500px' }}>
                            <Card.Body>
                                <h4 className="text-muted mb-3">No workouts found</h4>
                                <p className="text-secondary">Start building your routine by adding a new workout.</p>
                                <Button variant="success" onClick={() => setShowModal(true)}>
                                    <FaPlusCircle className="me-2" /> Add Your First Workout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Modals */}
            <AddWorkout
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                refreshWorkouts={refreshWorkouts}
            />

            <EditWorkout
                show={showEditModal}
                handleClose={handleCloseEditModal}
                workout={selectedWorkout}
                refreshWorkouts={refreshWorkouts}
            />
        </Container>
    );
}
