export class Transaction {
  constructor(data, callbacks = {}) {
    this.id = data.id;
    this.title = data.title;
    this.amount = data.amount;
    this.category = data.category;
    this.date = data.date;
    this.onEdit = callbacks.onEdit;
    this.onDelete = callbacks.onDelete;
  }

  render() {
    const element = document.createElement("div");
    element.classList.add("transaction");
    // Добавим класс в зависимости от того, доход или расход
    element.classList.add(this.amount >= 0 ? "income" : "expense");

    // Создаём разметку для отображения данных транзакции
    element.innerHTML = `
      <h3>${this.title}</h3>
      <p>Сумма: ${this.amount}</p>
      <p>Категория: ${this.category}</p>
      <p>Дата: ${this.date}</p>
      <button class="transaction-edit-btn">Редактировать</button>
      <button class="transaction-delete-btn">Удалить</button>
    `;

    element.querySelector(".transaction-edit-btn").addEventListener("click", () => {
      if (typeof this.onEdit === "function") {
        this.onEdit(this.id);
      } else {
        console.log(`Редактировать транзакцию с id ${this.id}`);
      }
    });

    // Обработка события удаления
    element.querySelector(".transaction-delete-btn").addEventListener("click", () => {
      if (typeof this.onDelete === "function") {
        this.onDelete(this.id);
      } else {
        console.log(`Удалить транзакцию с id ${this.id}`);
      }
    });

    return element;
  }
}
