import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import BookingForm from "./components/BookingForm";
import ToDoList from "./components/ToDoList";
import Reviews from "./components/Reviews";
import "./App.css";

function App() {
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addBooking = (booking) => {
    setBookings([...bookings, booking]);
  };

  const deleteBooking = (index) => {
    const newBookings = bookings.filter((_, i) => i !== index);
    setBookings(newBookings);
  };

  const addReview = (review) => {
    setReviews([...reviews, review]);
  };

  const deleteReview = (index) => {
    const newReviews = reviews.filter((_, i) => i !== index);
    setReviews(newReviews);
  };

  return (
    <div className="App">
      <Header />
      <Navigation />
      <main>
        <BookingForm addBooking={addBooking} />
        <ToDoList bookings={bookings} deleteBooking={deleteBooking} />
        <Reviews
          reviews={reviews}
          addReview={addReview}
          deleteReview={deleteReview}
        />
      </main>
    </div>
  );
}

export default App;
