import React, { Component } from "react";
import History from "./components/History";
import Operation from "./components/Operation";
import Total from "./components/Total";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: JSON.parse(localStorage.getItem("key")) || [],
      description: "",
      amount: "",
      resultIncome: 0,
      resultExpenses: 0,
      totalBalance: 0,
    };
  }

  addTransaction = (add) => {
    const transactions = [...this.state.transactions];

    const transaction = {
      id: `id${(+new Date()).toString(16)}`,
      description: this.state.description,
      amount: parseFloat(this.state.amount),
      add,
    };

    transactions.push(transaction);

    this.setState(
      {
        transactions,
        description: "",
        amount: "",
      },
      this.getTotalBalance
    );
  };

  componentWillMount() {
    this.getTotalBalance();
  }

  componentDidUpdate() {
    this.addStorage();
  }

  addAmount = (e) => {
    this.setState({ amount: e.target.value });
  };

  addDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  getIncome = () =>
    this.state.transactions.reduce(
      (acc, item) => (item.add ? item.amount + acc : acc),
      0
    );

  getExpenses = () =>
    this.state.transactions.reduce(
      (acc, item) => (!item.add ? item.amount + acc : acc),
      0
    );

  getTotalBalance() {
    const resultIncome = this.getIncome();
    const resultExpenses = this.getExpenses();
    const totalBalance = resultIncome - resultExpenses;

    this.setState({
      resultIncome,
      resultExpenses,
      totalBalance,
    });
  }

  addStorage() {
    localStorage.setItem("key", JSON.stringify(this.state.transactions));
  }

  deleteTransaction = (key) => {
    const transactions = this.state.transactions.filter(
      (item) => item.id !== key
    );
    this.setState({ transactions }, this.getTotalBalance);
  };

  render() {
    return (
      <>
        <header>
          <h1>Кошелек</h1>
          <h2>Калькулятор расходов</h2>
        </header>

        <main>
          <div className="container">
            <Total
              resultIncome={this.state.resultIncome}
              resultExpenses={this.state.resultExpenses}
              totalBalance={this.state.totalBalance}
            />
            <History
              transactions={this.state.transactions}
              deleteTransaction={this.deleteTransaction}
            />
            <Operation
              addTransaction={this.addTransaction}
              addAmount={this.addAmount}
              addDescription={this.addDescription}
              description={this.state.description}
              amount={this.state.amount}
            />
          </div>
        </main>
      </>
    );
  }
}

export default App;
