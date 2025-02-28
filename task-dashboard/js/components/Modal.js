export class Modal {
  constructor() {
    this.modalElement = document.createElement("div");
    this.modalElement.classList.add("modal");
    this.modalElement.style.display = "none";

    this.modalElement.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <!-- Здесь будет динамически подставлено содержимое -->
        <button class="modal-close">Закрыть</button>
      </div>
    `;

    document.body.appendChild(this.modalElement);
    this.modalElement.querySelector(".modal-close").addEventListener("click", () => this.hide());
    this.modalElement.querySelector(".modal-overlay").addEventListener("click", () => this.hide());
  }

  show(content) {
    const contentContainer = this.modalElement.querySelector(".modal-content");

    contentContainer.innerHTML = `
      ${content}
      <button class="modal-close">Закрыть</button>
    `;

    contentContainer.querySelector(".modal-close").addEventListener("click", () => {
      this.hide();
    });

    const form = contentContainer.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = form.querySelector("#edit-card-title");
        if (!titleInput.value.trim()) {
          alert("Название карточки не может быть пустым!");
          return;
        }
        this.hide();
      });
    }

    this.modalElement.style.display = "block";
  }

  hide() {
    this.modalElement.style.display = "none";
  }
}
