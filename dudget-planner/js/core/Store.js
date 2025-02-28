export class Store {
  constructor() {
    const savedState = localStorage.getItem("budget-planner-state");
    this.state = savedState
      ? JSON.parse(savedState)
      : {
          transactions: [
            {
              id: "1",
              title: "Кофе",
              amount: -3,
              category: "Food",
              date: "2023-10-24",
            },
            {
              id: "2",
              title: "Зарплата",
              amount: 1500,
              category: "Income",
              date: "2023-10-25",
            },
          ],
        };
    this.subscribers = [];
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.state = { ...this.state, newState };
    this.saveToLocalStorage();
    this.notify();
  }

  saveToLocalStorage() {
    localStorage.setItem("budget-planner-state", JSON.stringify(this.state));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
