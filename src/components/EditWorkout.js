import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const EditWorkout = ({ show, handleClose, refreshWorkouts, workout }) => {
    const [workoutData, setWorkoutData] = useState({
        name: workout?.name || '',
        duration: workout?.duration || ''
    });

    useEffect(() => {
        if (workout) {
            setWorkoutData({
                name: workout.name,
                duration: workout.duration
            });
        }
    }, [workout]); // Update when workout changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkoutData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!workout) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No workout selected for update.',
                confirmButtonColor: '#d33'
            });
        }

        try {
            const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${workout._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutData)
            });

            const data = await response.json();
            if (data.message === 'Workout updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Workout Updated',
                    text: 'The workout was successfully updated.',
                    confirmButtonColor: '#3085d6'
                });
                refreshWorkouts(); // Refresh the list after update
                handleClose(); // Close the modal after updating
            } else {
                showError('Unable to update workout. Please try again.');
            }
        } catch (error) {
            console.error('Update error:', error);
            showError('Unable to update workout. Please try again.');
        }
    };

    const showError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#d33'
        });
    };

    // Disable the button if the workout name or duration is empty
    const isButtonDisabled = !workoutData.name || !workoutData.duration;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Workout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formWorkoutName">
                        <Form.Label>Workout Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={workoutData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formWorkoutDuration" className="mt-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                            type="text"
                            name="duration"
                            value={workoutData.duration}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="mt-4"
                        disabled={isButtonDisabled}  // Disable button if either field is empty
                    >
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditWorkout;
