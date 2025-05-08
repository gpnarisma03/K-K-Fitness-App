import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const CompleteWorkoutStatus = ({ workoutId, refreshWorkouts }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCompleteWorkout = () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            setIsLoading(true);
            fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${workoutId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Completed'
                }),
            })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                if (data.message === "Workout status updated successfully") {
                    // Show success notification
                    Swal.fire({
                        icon: 'success',
                        title: 'Workout Completed!',
                        text: 'The workout status has been updated to Completed.',
                    });
                    refreshWorkouts(); // Refresh workouts list after the update
                } else {
                    // Show error notification
                    setError('Failed to update workout status');
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update the workout status. Please try again later.',
                    });
                }
            })
            .catch((error) => {
                console.error('Error completing workout:', error);
                setError('Error completing workout');
                setIsLoading(false);
                // Show error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error processing your request. Please try again later.',
                });
            });
        } else {
            setError('User not authenticated');
            setIsLoading(false);
            // Show authentication error notification
            Swal.fire({
                icon: 'warning',
                title: 'Not Authenticated',
                text: 'You must be logged in to complete the workout.',
            });
        }
    };

    return (
        <div>
            {isLoading ? (
                    <button disabled className="btn btn-info">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...
                </button>
            ) : (
                <button onClick={handleCompleteWorkout} className="btn btn-success">
                    Mark as Completed
                </button>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default CompleteWorkoutStatus;
