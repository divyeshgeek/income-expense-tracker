import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Transaction } from '@/types/transaction';

const STORAGE_KEY = '@expense_tracker_transactions';

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'salary',
    description: 'Monthly Salary',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: '2',
    type: 'expense',
    amount: 120,
    category: 'food',
    description: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: '3',
    type: 'expense',
    amount: 45,
    category: 'transport',
    description: 'Uber ride',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: '4',
    type: 'expense',
    amount: 250,
    category: 'shopping',
    description: 'New clothes',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: '5',
    type: 'income',
    amount: 800,
    category: 'freelance',
    description: 'Design project',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000,
  },
  {
    id: '6',
    type: 'expense',
    amount: 60,
    category: 'entertainment',
    description: 'Movie night',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 500000,
  },
  {
    id: '7',
    type: 'expense',
    amount: 200,
    category: 'bills',
    description: 'Electricity bill',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 300000,
  },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTransactions(JSON.parse(raw));
      } else {
        // Seed demo data on first launch
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TRANSACTIONS));
        setTransactions(DEMO_TRANSACTIONS);
      }
    } catch {
      setTransactions(DEMO_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (list: Transaction[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setTransactions(list);
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newT: Transaction = {
      ...t,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    const updated = [newT, ...transactions];
    await save(updated);
  };

  const updateTransaction = async (id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const updated = transactions.map((x) =>
      x.id === id ? { ...x, ...t } : x
    );
    await save(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((x) => x.id !== id);
    await save(updated);
  };

  const getById = (id: string) => transactions.find((x) => x.id === id);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getById,
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
    monthlyTransactions,
    reload: load,
  };
}
