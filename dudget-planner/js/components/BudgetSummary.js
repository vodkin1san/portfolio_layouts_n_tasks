export class BudgetSummary {
  constructor(transactions) {
    this.transactions = transactions;
  }

  render() {
    const totalIncome = this.transactions.filter((t) => t.amount >= 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = this.transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome + totalExpense;

    const summaryElement = document.createElement("div");
    summaryElement.classList.add("budget-summary");
    summaryElement.innerHTML = `
        <h2>Общий бюджет</h2>
        <p>Доходы: ${totalIncome}</p>
        <p>Расходы: ${Math.abs(totalExpense)}</p>
        <p>Баланс: ${balance}</p>
      `;
    return summaryElement;
  }
}
