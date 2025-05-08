import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AddWorkout({ showModal, handleCloseModal, refreshWorkouts  }) {
    const [workoutName, setWorkoutName] = useState('');
    const [duration, setDuration] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);  // Track form validity

    // Effect to validate form whenever fields change
    useEffect(() => {
        if (workoutName.trim() !== '' && duration.trim() !== '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [workoutName, duration]);  // Dependency array to track form field changes

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Create the workout data to send to the API
        const newWorkout = {
            name: workoutName,
            duration: duration
        };
    
        // Fetch API call to add workout
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newWorkout)
        })
        .then(response => response.json())
        .then(data => {
            setWorkoutName('');
            setDuration('');
        
            refreshWorkouts();
            handleCloseModal();  // Close the modal after successful addition
    
            // Show success alert after adding the workout
            Swal.fire({
                icon: 'success',
                title: 'Workout Added',
                text: 'Your workout was successfully added.',
                confirmButtonColor: '#3085d6'
            });
        })
        .catch((error) => {
            console.error('Error adding workout:', error);
    
            // Show error alert if the API call fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to add workout. Please try again.',
                confirmButtonColor: '#d33'
            });
        });
    };
    
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add Workout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="workoutName">
                        <Form.Label>Workout Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter workout name"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="duration">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter duration (e.g., 30 minutes)"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="mt-3" 
                        disabled={!isFormValid}
                    >
                        Add Workout
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
