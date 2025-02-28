export class Store {
  constructor() {
    const savedState = localStorage.getItem("appState");
    this.state = savedState
      ? JSON.parse(savedState)
      : {
          boards: [
            {
              id: "11",
              title: "To Do",
              cards: [
                {
                  id: "1",
                  title: "card1",
                },
                {
                  id: "22",
                  title: "card2",
                },
              ],
            },
            { id: "2", title: "In Progress", cards: [] },
            { id: "3", title: "Done", cards: [] },
          ],
        };

    this.subscribers = [];
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.saveToLocalStorage();
    this.notify();
  }

  saveToLocalStorage() {
    localStorage.setItem("appState", JSON.stringify(this.state));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
