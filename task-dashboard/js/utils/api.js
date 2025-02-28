export function fetchBoards() {
  const boardData = localStorage.getItem("boards");
  if (boardData) {
    return JSON.parse(boardData);
  } else {
    return [];
  }
}

function createCard(cardData) {
  const boards = fetchBoards();
  const board = boards.find((b) => b.id === cardData.boardId); //cardData(то что будем вводить)
  if (!board.cards) {
    board.cards = [];
  }

  if (board) {
    const newCard = {
      id: Date.now(),
      title: cardData.title,
      description: cardData.description,
    };
    board.cards.push(newCard);
    localStorage.setItem("boards", JSON.stringify(boards));
    return newCard;
  } else {
    console.error("Доска не найдена для boardId:", cardData.boardId);
    return null;
  }
}

function updateCard(cardId, newData) {
  const boards = fetchBoards();
  let updateCard = null;

  boards.forEach((board) => {
    board.cards = board.cards.map((card) => {
      if (card.id === cardId) {
        updateCard = [...card, ...newData];
        return updateCard;
      }
      return card;
    });
  });

  localStorage.setItem("boards", JSON.stringify(boards));
  return updateCard;
}
