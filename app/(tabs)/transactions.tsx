import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { TransactionItem } from '@/components/transaction-item';
import { useTransactions } from '@/hooks/use-transactions';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction, TransactionType } from '@/types/transaction';

type Filter = 'all' | TransactionType;

function groupByDate(transactions: Transaction[]): { date: string; items: Transaction[] }[] {
  const map: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    if (!map[t.date]) map[t.date] = [];
    map[t.date].push(t);
  }
  return Object.entries(map)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, items]) => ({ date, items }));
}

function formatGroupDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function TransactionsScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const { transactions, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = transactions
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((t) => filter === 'all' || t.type === filter);

  const groups = groupByDate(filtered);

  const handleEdit = useCallback(
    (t: Transaction) => {
      router.push({ pathname: '/add-transaction', params: { id: t.id } });
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTransaction(id);
    },
    [deleteTransaction]
  );

  type FlatItem =
    | { kind: 'header'; date: string; key: string }
    | { kind: 'transaction'; data: Transaction; key: string };

  const flatData: FlatItem[] = [];
  for (const group of groups) {
    flatData.push({ kind: 'header', date: group.date, key: `h-${group.date}` });
    for (const item of group.items) {
      flatData.push({ kind: 'transaction', data: item, key: item.id });
    }
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  return (
    <SafeAreaView style={[styles.safe, isDark && styles.bgDark]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Transactions</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-transaction')}
          activeOpacity={0.8}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterRow, isDark && styles.filterRowDark]}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterText,
                isDark && styles.filterTextDark,
                filter === f.key && styles.filterTextActive,
              ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {flatData.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="receipt-long" size={60} color="#CBD5E1" />
          <Text style={[styles.emptyText, isDark && styles.descDark]}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            if (item.kind === 'header') {
              return (
                <Text style={[styles.dateHeader, isDark && styles.descDark]}>
                  {formatGroupDate(item.date)}
                </Text>
              );
            }
            return (
              <TransactionItem
                transaction={item.data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          }}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  bgDark: {
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  textDark: {
    color: '#F1F5F9',
  },
  descDark: {
    color: '#94A3B8',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
  },
  filterRowDark: {
    backgroundColor: '#1E293B',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#6366F1',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextDark: {
    color: '#94A3B8',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
