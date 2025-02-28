const API_KEY = "3693b754";
const BASE_URL = "http://www.omdbapi.com/";
const moviesContainer = document.getElementById("movies-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const favoritesList = document.getElementById("favorites-list");
let favorites = [];

// ИЗЬБРАННОЕ

if (localStorage.getItem("favorites")) {
  favorites = JSON.parse(localStorage.getItem("favorites"));
}

renderFavorites();

function addToFavorites(movieId) {
  if (!favorites.some((id) => id === movieId)) {
    favorites.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

async function renderFavorites() {
  favoritesList.innerHTML = "";
  for (const movieId of favorites) {
    const movie = await fetchMovieDetails(movieId);

    const listItem = document.createElement("li");
    listItem.textContent = movie.Title;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.addEventListener("click", () => {
      removeFromFavorites(movieId);
    });

    listItem.appendChild(removeButton);
    favoritesList.appendChild(listItem);
  }
}

async function fetchMovieDetails(movieId) {
  const url = `${BASE_URL}?i=${movieId}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const movie = await response.json();

    if (movie.Response === "True") {
      return movie;
    } else {
      console.error("Ошибка в ответе API:", movie.Error);
      return null;
    }
  } catch (error) {
    console.error("Ошибка при загрузке деталей филльма:", error);
    return null;
  }
}

function removeFromFavorites(movieId) {
  favorites = favorites.filter((id) => id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// #####

// ДЕТАДИ

async function showMovieDetails(movieId) {
  const movie = await fetchMovieDetails(movieId);

  if (!movie) {
    console.error("Не удалось получить детали фильма");
    return;
  }
  displayModal(movie);
}

function displayModal(movie) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
  <h2>${movie.Title}</h2>
  <p><strong>Год:</strong> ${movie.Year}</p>
  <p><strong>Жанр:</strong> ${movie.Genre}</p>
  <p><strong>Режиссер:</strong> ${movie.Director}</p>
  <p><strong>Актеры:</strong> ${movie.Actors}</p>
  <p><strong>Описание:</strong> ${movie.Plot}</p>
  <button id="close-modal">Закрыть</button>
`;
  modal.style.display = "block";
  const closeModalBtn = document.getElementById("close-modal");
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
}

// #######

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    const movies = await fetchMovies(searchQuery);
    renderMovies(movies);
  }
});

async function fetchMovies(searchQuery, page = 1, year = "") {
  showLoadingSpinner();
  let url = `${BASE_URL}?s=${encodeURIComponent(searchQuery)}&page=${page}&apikey=${API_KEY}`;
  if (year !== "") {
    url += `&y=${year}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    hideLoadingSpinner();
    if (data.Response === "True") {
      return data.Search;
    } else {
      console.error("Ошибка в ответе API:", data.Error);
      return [];
    }
  } catch (error) {
    hideLoadingSpinner();
    console.error("Ошибка при загрузке фильмов:", error);
    return [];
  }
}

fetchMovies("Batman").then((movies) => {
  console.log(movies);
});

function renderMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const poster = document.createElement("img");
    poster.classList.add("movie-poster");
    poster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";
    poster.alt = movie.Title;
    movieCard.appendChild(poster);

    const details = document.createElement("div");
    details.classList.add("movie-details");

    const title = document.createElement("h3");
    title.classList.add("movie-title");
    title.textContent = movie.Title;

    const year = document.createElement("p");
    year.classList.add("movie-year");
    year.textContent = movie.Year;

    details.appendChild(title);
    details.appendChild(year);

    const addToFavoritesBtn = document.createElement("button");
    addToFavoritesBtn.textContent = "Добавить в избранное";
    addToFavoritesBtn.classList.add("add-to-favorites");
    addToFavoritesBtn.setAttribute("data-movie-id", movie.imdbID);

    const viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.textContent = "Подробнее";
    viewDetailsBtn.classList.add("view-details");
    viewDetailsBtn.setAttribute("data-movie-id", movie.imdbID);

    details.appendChild(addToFavoritesBtn);
    details.appendChild(viewDetailsBtn);

    movieCard.appendChild(details);
    moviesContainer.appendChild(movieCard);

    addToFavoritesBtn.addEventListener("click", () => {
      addToFavorites(movie.imdbID);
    });

    viewDetailsBtn.addEventListener("click", () => {
      showMovieDetails(movie.imdbID);
    });

    if (favorites.includes(movie.imdbID)) {
      addToFavoritesBtn.textContent = "В избранном";
      addToFavoritesBtn.disabled = true;
    }
  });
}

// SPINNER
function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "block";
}

function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

// #####
