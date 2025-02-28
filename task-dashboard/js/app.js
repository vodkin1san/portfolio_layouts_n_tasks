import { Store } from "./core/Store.js";
import { Board } from "./components/Board.js";
import { Modal } from "./components/Modal.js";
import * as API from "./utils/api.js";

const store = new Store();
const modal = new Modal();
const boardsContainer = document.querySelector("main");

// Подписываемся на обновления состояния (Observer)
store.subscribe((newState) => {
  boardsContainer.innerHTML = "";
  newState.boards.forEach((boardData) => {
    // Передаем колбэки для редактирования, удаления, добавления карточек и обработки drop
    const board = new Board(boardData, {
      onEditCard: openEditCardModal,
      onDeleteCard: deleteCard,
      onAddCard: addCard,
      onDrop: moveCard,
    });
    boardsContainer.appendChild(board.render());
  });
});
store.notify(); // Первичный рендер через уведомление

// Функция для удаления карточки
function deleteCard(cardId) {
  const state = store.getState();
  state.boards.forEach((board) => {
    if (board.cards) {
      board.cards = board.cards.filter((card) => card.id !== cardId);
    }
  });
  store.updateState(state);
}

// Функция для редактирования карточки
function editCard(cardId, newData) {
  const state = store.getState();
  state.boards.forEach((board) => {
    if (board.cards) {
      board.cards = board.cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, ...newData };
        }
        return card;
      });
    }
  });
  store.updateState(state);
}

// Функция добавления новой карточки через модальное окно
function addCard(boardId) {
  modal.show(`
    <h2>Добавить новую карточку</h2>
    <form id="add-card-form">
      <input type="text" id="new-card-title" placeholder="Название карточки" required />
      <textarea id="new-card-description" placeholder="Описание"></textarea>
      <button type="submit">Добавить</button>
    </form>
  `);
  const form = document.getElementById("add-card-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-card-title").value;
    const description = document.getElementById("new-card-description").value;
    const newCard = {
      id: Date.now().toString(),
      title,
      description,
    };
    const state = store.getState();
    state.boards.forEach((board) => {
      if (board.id === boardId) {
        board.cards.push(newCard);
      }
    });
    store.updateState(state);
    modal.hide();
  });
}

// Функция открытия модального окна редактирования карточки
function openEditCardModal(cardId) {
  let cardToEdit = null;
  const boards = store.getState().boards;
  boards.forEach((board) => {
    board.cards.forEach((card) => {
      if (card.id == cardId) {
        cardToEdit = card;
      }
    });
  });
  if (!cardToEdit) {
    console.error("Карточка не найдена для id:", cardId);
    return;
  }
  const content = `
    <h2>Редактировать карточку</h2>
    <form id="edit-card-form">
      <input type="text" id="edit-card-title" value="${cardToEdit.title}" required />
      <textarea id="edit-card-description" placeholder="Описание">${cardToEdit.description || ""}</textarea>
      <button type="submit">Сохранить</button>
    </form>
  `;
  modal.show(content);
  const form = document.getElementById("edit-card-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTitle = document.getElementById("edit-card-title").value.trim();
    const newDescription = document.getElementById("edit-card-description").value.trim();
    editCard(cardId, { title: newTitle, description: newDescription });
    modal.hide();
  });
}

// Функция перемещения карточки (drag & drop)
function moveCard(cardId, targetBoardId, dropIndex) {
  const state = store.getState();
  let cardToMove = null;
  state.boards.forEach((board) => {
    const index = board.cards.findIndex((card) => card.id == cardId);
    if (index !== -1) {
      cardToMove = board.cards.splice(index, 1)[0];
    }
  });
  if (cardToMove) {
    const targetBoard = state.boards.find((board) => board.id == targetBoardId);
    if (targetBoard) {
      if (typeof dropIndex === "undefined") {
        targetBoard.cards.push(cardToMove);
      } else {
        targetBoard.cards.splice(dropIndex, 0, cardToMove);
      }
    } else {
      console.error("Целевая доска не найдена для id:", targetBoardId);
    }
    store.updateState(state);
  } else {
    console.error("Карточка не найдена для id:", cardId);
  }
}

const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const allBoards = store.getState().boards;
  const filteredBoards = allBoards.map((board) => ({
    ...board,
    cards: board.cards.filter((card) => card.title.toLowerCase().includes(query)),
  }));
  boardsContainer.innerHTML = "";
  filteredBoards.forEach((boardData) => {
    const board = new Board(boardData, {
      onEditCard: editCard,
      onDeleteCard: deleteCard,
      onAddCard: addCard,
      onDrop: moveCard,
    });
    boardsContainer.appendChild(board.render());
  });
});
