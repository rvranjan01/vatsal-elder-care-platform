import React, { useState } from 'react';
import API from '../../services/api';
import YogaExerciseModal from './YogaExerciseModal';

const YogaExercisesTab = ({ yogaExercises, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setShowModal(true);
  };

  const handleDelete = async (exerciseId) => {
    if (window.confirm('Delete this exercise?')) {
      try {
        await API.delete(`/admin/yoga-exercises/${exerciseId}`);
        onRefresh();
      } catch (err) {
        alert('Failed to delete exercise');
      }
    }
  };

  return (
    <div className="ad-tab-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Yoga Exercises <span className="badge bg-info">{yogaExercises.length}</span></h5>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingExercise(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus"></i> Add Exercise
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {yogaExercises.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No yoga exercises found</td>
              </tr>
            ) : (
              yogaExercises.map((exercise) => (
                <tr key={exercise._id}>
                  <td>{exercise.title}</td>
                  <td>{exercise.duration} min</td>
                  <td>
                    <span className={`badge ${
                      exercise.difficulty === 'beginner' ? 'bg-success' :
                      exercise.difficulty === 'intermediate' ? 'bg-warning text-dark' : 'bg-danger'
                    }`}>
                      {exercise.difficulty?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{exercise.category}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(exercise)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(exercise._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <YogaExerciseModal
          exercise={editingExercise}
          onClose={() => {
            setShowModal(false);
            setEditingExercise(null);
          }}
          onSave={onRefresh}
        />
      )}
    </div>
  );
};

export default YogaExercisesTab;
