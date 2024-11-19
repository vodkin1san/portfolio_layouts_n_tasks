import React, { useState } from "react";

function BookingForm({ addBooking }) {
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const booking = {
      checkinDate,
      checkoutDate,
      roomType,
      guestCount,
    };
    addBooking(booking);
    setCheckinDate("");
    setCheckoutDate("");
    setRoomType("");
    setGuestCount(1);
  };

  return (
    <section id="booking">
      <h2>Форма бронирования</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="checkin-date">Дата заезда:</label>
        <input
          type="date"
          id="checkin-date"
          value={checkinDate}
          onChange={(e) => setCheckinDate(e.target.value)}
          required
        />
        <label htmlFor="checkout-date">Дата выезда:</label>
        <input
          type="date"
          id="checkout-date"
          value={checkoutDate}
          onChange={(e) => setCheckoutDate(e.target.value)}
          required
        />
        <label htmlFor="room-type">Тип номера:</label>
        <select
          id="room-type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
        >
          <option value="">Выберите тип номера</option>
          <option value="single">Одноместный</option>
          <option value="double">Двухместный</option>
          <option value="suite">Люкс</option>
        </select>
        <label htmlFor="guest-count">Количество гостей:</label>
        <input
          type="number"
          id="guest-count"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          min="1"
          required
        />
        <button type="submit">Забронировать</button>
      </form>
    </section>
  );
}

export default BookingForm;
