import React from 'react';
import Swal from 'sweetalert2';

const DeleteWorkout = ({ workoutId, refreshWorkouts }) => {
    // Function to delete the workout after confirmation
    const deleteWorkout = () => {
        // Trigger SweetAlert confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            // Proceed with deletion if confirmed
            if (result.isConfirmed) {
                const token = localStorage.getItem('token'); // Get token from localStorage

                if (token) {
                    fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${workoutId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Workout deleted successfully') {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Workout Deleted',
                                    text: 'The workout was successfully deleted.',
                                    confirmButtonColor: '#3085d6'
                                });
                                refreshWorkouts();  // Refresh workouts after deletion
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Unable to delete workout. Please try again.',
                                    confirmButtonColor: '#d33'
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting workout:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Unable to delete workout. Please try again.',
                                confirmButtonColor: '#d33'
                            });
                        });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unauthorized',
                        text: 'You need to be logged in to delete a workout.',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        });
    };

    return (
        <button onClick={deleteWorkout} className="btn btn-danger">
            Delete
        </button>
    );
};

export default DeleteWorkout;
