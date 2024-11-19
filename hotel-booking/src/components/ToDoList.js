import React from "react";

function ToDoList({ bookings, deleteBooking }) {
  return (
    <section id="todo">
      <h2>Ваучер</h2>
      <ul id="todo-list">
        {bookings.map((booking, index) => (
          <li key={index} className="todo-item">
            <span>
              Вы забронировали {booking.roomType} номер на {booking.guestCount}{" "}
              гостей с {booking.checkinDate} по {booking.checkoutDate}.
            </span>
            <button
              onClick={() => deleteBooking(index)}
              className="delete-button"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ToDoList;
