export class Card {
  constructor(cardData, callbacks = {}) {
    this.id = cardData.id;
    this.title = cardData.title;
    this.description = cardData.description;
    this.onEdit = callbacks.onEdit;
    this.onDelete = callbacks.onDelete;
  }

  render() {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("draggable", "true");

    const titleElement = document.createElement("h3");
    titleElement.textContent = this.title;
    cardElement.appendChild(titleElement);

    if (this.description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = this.description;
      cardElement.appendChild(descriptionElement);
    }

    const editBtn = document.createElement("button");
    editBtn.classList.add("card-edit-btn");
    editBtn.textContent = "Редактировать";
    cardElement.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("card-delete-btn");
    deleteBtn.textContent = "Удалить";
    cardElement.appendChild(deleteBtn);

    cardElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", this.id);
    });

    editBtn.addEventListener("click", () => {
      if (typeof this.onEdit === "function") {
        this.onEdit(this.id);
      } else {
        console.log(`Редактировать карточку с id ${this.id}`);
      }
    });

    deleteBtn.addEventListener("click", () => {
      if (typeof this.onDelete === "function") {
        this.onDelete(this.id);
      } else {
        console.log(`Удалить карточку с id ${this.id}`);
      }
    });

    return cardElement;
  }
}
