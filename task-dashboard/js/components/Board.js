import { Card } from "./Card.js";

export class Board {
  constructor(boardData, callbacks = {}) {
    this.id = boardData.id;
    this.title = boardData.title;
    this.cards = boardData.cards || [];
    this.onEditCard = callbacks.onEditCard;
    this.onDeleteCard = callbacks.onDeleteCard;
    this.onAddCard = callbacks.onAddCard;
    this.onDrop = callbacks.onDrop;
  }

  render() {
    const boardElement = document.createElement("section");
    boardElement.classList.add("board");
    boardElement.dataset.boardId = this.id;

    const header = document.createElement("h2");
    header.textContent = this.title;
    boardElement.appendChild(header);

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");
    boardElement.appendChild(cardsContainer);

    const addCardBtn = document.createElement("button");
    addCardBtn.textContent = "+ Добавить карточку";
    addCardBtn.classList.add("add-card-btn");
    boardElement.appendChild(addCardBtn);

    addCardBtn.addEventListener("click", () => {
      if (typeof this.onAddCard === "function") {
        this.onAddCard(this.id);
      } else {
        console.log("Добавить карточку в доску", this.id);
      }
    });

    this.cards.forEach((cardData) => {
      const card = new Card(cardData, {
        onEdit: this.onEditCard,
        onDelete: this.onDeleteCard,
      });
      cardsContainer.appendChild(card.render());
    });

    // Обработчики событий для drag & drop c подсветкой
    cardsContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const cardElements = Array.from(cardsContainer.children);
      cardElements.forEach((child) => child.classList.remove("drag-hover"));
      let dropIndex = 0;
      cardElements.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        if (e.clientY > rect.top + rect.height / 2) {
          dropIndex = index + 1;
        }
      });
      if (cardElements[dropIndex]) {
        cardElements[dropIndex].classList.add("drag-hover");
      } else if (cardElements.length > 0) {
        cardElements[cardElements.length - 1].classList.add("drag-hover");
      }
    });

    cardsContainer.addEventListener("dragleave", (e) => {
      const cardElements = Array.from(cardsContainer.children);
      cardElements.forEach((child) => child.classList.remove("drag-hover"));
    });

    cardsContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      const cardElements = Array.from(cardsContainer.children);
      cardElements.forEach((child) => child.classList.remove("drag-hover"));
      const cardId = e.dataTransfer.getData("text/plain");
      let dropIndex = 0;
      cardElements.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        if (e.clientY > rect.top + rect.height / 2) {
          dropIndex = index + 1;
        }
      });
      console.log(`Карточка с id ${cardId} будет вставлена на позицию ${dropIndex} в доске ${this.id}`);
      if (typeof this.onDrop === "function") {
        this.onDrop(cardId, this.id, dropIndex);
      }
    });

    return boardElement;
  }
}
