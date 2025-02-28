import { Store } from "./core/Store.js";
import { Modal } from "./components/Modal.js";
import { Transaction } from "./components/Transaction.js";
import { BudgetSummary } from "./components/BudgetSummary.js";

const store = new Store();
const modal = new Modal();

window.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");
  const transactionContainer = document.getElementById("transaction-container");

  // Функция рендера сводной информации (BudgetSummary)
  function renderSummary(state) {
    // Удаляем существующую сводку
    const existingSummary = document.querySelector(".budget-summary");
    if (existingSummary) {
      existingSummary.remove();
    }
    // Создаем новый блок сводки
    const summary = new BudgetSummary(state.transactions || []);
    mainContainer.insertBefore(summary.render(), mainContainer.firstChild);
  }

  // Подписываемся на обновления в Store
  store.subscribe((newState) => {
    mainContainer.innerHTML = "";
    renderSummary(newState);

    // Отображаем список транзакций
    if (newState.transactions) {
      newState.transactions.forEach((tx) => {
        const transaction = new Transaction(tx, {
          onEdit: openEditTransactionModal,
          onDelete: deleteTransaction,
        });
        transactionContainer.appendChild(transaction.render());
      });
    }
  });

  store.notify(); // Первичный рендер

  // Функция добавления новой транзакции
  function addTransaction() {
    modal.show(`
      <h2>Добавить транзакцию</h2>
      <form id="add-transaction-form">
        <input type="text" id="transaction-title" placeholder="Название транзакции" required />
        <input type="number" id="transaction-amount" placeholder="Сумма" required />
        <input type="text" id="transaction-category" placeholder="Категория" required />
        <input type="date" id="transaction-date" required />
        <button type="submit">Добавить</button>
      </form>
    `);
    const form = document.getElementById("add-transaction-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("transaction-title").value;
      const amount = Number(document.getElementById("transaction-amount").value);
      const category = document.getElementById("transaction-category").value;
      const date = document.getElementById("transaction-date").value;
      const newTransaction = {
        id: Date.now().toString(),
        title,
        amount,
        category,
        date,
      };
      const state = store.getState();
      state.transactions.push(newTransaction);
      store.updateState({ transactions: state.transactions });
      modal.hide();
    });
  }

  // Функция удаления транзакции
  function deleteTransaction(txId) {
    const state = store.getState();
    state.transactions = state.transactions.filter((tx) => tx.id !== txId);
    store.updateState({ transactions: state.transactions });
  }

  // Функция редактирования транзакции
  function editTransaction(txId, newData) {
    const state = store.getState();
    state.transactions = state.transactions.map((tx) => {
      if (tx.id === txId) {
        return { ...tx, ...newData };
      }
      return tx;
    });
    store.updateState({ transactions: state.transactions });
  }

  // Функция открытия модального окна редактирования транзакции
  function openEditTransactionModal(txId) {
    let txToEdit = null;
    const state = store.getState();
    state.transactions.forEach((tx) => {
      if (tx.id === txId) {
        txToEdit = tx;
      }
    });
    if (!txToEdit) {
      console.error("Транзакция не найдена для id:", txId);
      return;
    }
    modal.show(`
      <h2>Редактировать транзакцию</h2>
      <form id="edit-transaction-form">
        <input type="text" id="edit-transaction-title" value="${txToEdit.title}" required />
        <input type="number" id="edit-transaction-amount" value="${txToEdit.amount}" required />
        <input type="text" id="edit-transaction-category" value="${txToEdit.category}" required />
        <input type="date" id="edit-transaction-date" value="${txToEdit.date}" required />
        <button type="submit">Сохранить</button>
      </form>
    `);

    setTimeout(() => {
      const form = document.getElementById("edit-transaction-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const newTitle = document.getElementById("edit-transaction-title").value.trim();
          const newAmount = Number(document.getElementById("edit-transaction-amount").value);
          const newCategory = document.getElementById("edit-transaction-category").value.trim();
          const newDate = document.getElementById("edit-transaction-date").value;
          editTransaction(txId, { title: newTitle, amount: newAmount, category: newCategory, date: newDate });
          modal.hide();
        });
      } else {
        console.error("Форма редактирования не найдена");
      }
    }, 0);
  }

  // Обработчик кнопки добавления транзакции в index.html
  const addTransactionBtn = document.getElementById("add-btn");
  addTransactionBtn.addEventListener("click", addTransaction);

  // Обработчик поиска по транзакциям
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const state = store.getState();
    const filtered = state.transactions.filter((tx) => tx.title.toLowerCase().includes(query));
    transactionContainer.innerHTML = "";
    renderSummary({ transactions: filtered });
    filtered.forEach((tx) => {
      const transaction = new Transaction(tx, {
        onEdit: openEditTransactionModal,
        onDelete: deleteTransaction,
      });
      transactionContainer.appendChild(transaction.render());
    });
  });
});
