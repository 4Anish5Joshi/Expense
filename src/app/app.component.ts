import { Component } from '@angular/core';
import { Transaction } from './transcation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentType: 'income' | 'expense' | '' = '';
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  amount: number | null = null;
  date: Date | null = null;
  name: string = '';
  filterMonth: string = '';  
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;

  constructor() {
    this.filteredTransactions = this.transactions;
    this.loadTransactions();
    this.calculateTotals();
  }

  loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
    this.filteredTransactions = this.transactions;
  }

  saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  calculateTotals() {
    this.totalIncome = this.filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    this.totalExpense = this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    this.balance = this.totalIncome - this.totalExpense;
  }

  addTransaction() {
    if (!this.currentType || !this.amount || !this.date || !this.name) {
      alert('Please fill all fields');
      return;
    }
    const newTransaction: Transaction = {
      id: this.transactions.length + 1,
      type: this.currentType,
      amount: Number(this.amount),
      date: this.date,
      name: this.name
    };
    this.transactions.push(newTransaction);
    this.filteredTransactions = this.transactions;
    this.saveTransactions();
    this.calculateTotals();
  }

  deleteTransaction(id: number) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.filteredTransactions = this.transactions;
    this.saveTransactions();
    this.calculateTotals();
  }
  filterTransactionsByMonth(month: string) {
    if (month === '') {
      // If 'All records' is selected, show all transactions
      this.filteredTransactions = this.transactions;
    } else {
      const monthNumber = parseInt(month, 10);
      this.filteredTransactions = this.transactions.filter(t => new Date(t.date).getMonth() === monthNumber);
    }
    this.calculateTotals();
  }
}
