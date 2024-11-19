import React, { useState } from "react";

function Reviews({ reviews, addReview, deleteReview }) {
  const [newReview, setNewReview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addReview(newReview);
    setNewReview("");
    setIsModalOpen(false);
  };

  return (
    <section id="reviews">
      <h2>Отзывы</h2>
      <button onClick={() => setIsModalOpen(true)}>Добавить отзыв</button>
      <div id="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <p>{review}</p>
            <button
              onClick={() => deleteReview(index)}
              className="delete-button"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-review">Ваш отзыв:</label>
            <textarea
              id="new-review"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            ></textarea>
            <div className="button-group">
              <button type="submit">Добавить</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Reviews;
