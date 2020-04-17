import Transaction from '../models/Transaction';
import { removeAllListeners } from 'cluster';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initialBalance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const balance = this.transactions.reduce(function (
      allTransactions,
      transaction,
    ) {
      if (transaction.type === 'income') {
        allTransactions.income = allTransactions.income + transaction.value;
      } else {
        allTransactions.outcome = allTransactions.outcome + transaction.value;
      }
      allTransactions.total = allTransactions.income - allTransactions.outcome;

      return allTransactions;
    },
    initialBalance);

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance().total;

    if (balance <= 0 && type === 'outcome') {
      const message = 'There are no possible founds';
      const statusMessage = 400;
      const objMessage = { message, statusMessage };

      throw objMessage;
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
