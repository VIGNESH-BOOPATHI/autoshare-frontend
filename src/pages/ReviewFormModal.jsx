// ReviewFormModal.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const ReviewFormModal = ({ show, handleClose, submitReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = () => {
        // Pass the rating and comment to the parent component for submission
        submitReview({ rating, comment });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="rating">
                    {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => handleRatingClick(ratingValue)}
                                />
                                <FaStar
                                    className="star"
                                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                                    size={30}
                                />
                            </label>
                        );
                    })}
                </div>
                <label>Comment:</label>
                <textarea value={comment} onChange={handleCommentChange}></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit Review
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewFormModal;
