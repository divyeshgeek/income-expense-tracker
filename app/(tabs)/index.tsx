import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { BalanceCard } from '@/components/balance-card';
import { TransactionItem } from '@/components/transaction-item';
import { useTransactions } from '@/hooks/use-transactions';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction } from '@/types/transaction';

export default function DashboardScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const { transactions, loading, balance, totalIncome, totalExpense, deleteTransaction, reload } =
    useTransactions();

  const recent = transactions
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

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

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (loading) {
    return (
      <View style={[styles.loader, isDark && styles.bgDark]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, isDark && styles.bgDark]}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.greeting, isDark && styles.textDark]}>{greeting()} 👋</Text>
                <Text style={[styles.dateText, isDark && styles.descDark]}>{today}</Text>
              </View>
            </View>

            {/* Balance Card */}
            <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />

            {/* Section title */}
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                Recent Transactions
              </Text>
              {transactions.length > 5 && (
                <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              )}
            </View>

            {recent.length === 0 && (
              <View style={styles.empty}>
                <MaterialIcons name="receipt-long" size={52} color="#CBD5E1" />
                <Text style={[styles.emptyText, isDark && styles.descDark]}>
                  No transactions yet
                </Text>
                <Text style={[styles.emptySubText, isDark && styles.descDark]}>
                  Tap + to add your first transaction
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-transaction')}
        activeOpacity={0.85}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  listContent: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  textDark: {
    color: '#F1F5F9',
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  descDark: {
    color: '#94A3B8',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAll: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  emptySubText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
