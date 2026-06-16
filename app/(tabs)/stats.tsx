import { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTransactions } from '@/hooks/use-transactions';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCategoryById } from '@/constants/categories';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function StatsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const { transactions } = useTransactions();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const monthlyData = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [transactions, month, year]);

  const income = monthlyData
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const expense = monthlyData
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of monthlyData.filter((t) => t.type === 'expense')) {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
    return Object.entries(map)
      .map(([id, total]) => ({ id, total, category: getCategoryById(id) }))
      .sort((a, b) => b.total - a.total);
  }, [monthlyData]);

  const maxCategoryTotal = categoryTotals[0]?.total ?? 1;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  return (
    <SafeAreaView style={[styles.safe, isDark && styles.bgDark]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={[styles.title, isDark && styles.textDark]}>Statistics</Text>

        {/* Month Selector */}
        <View style={[styles.monthSelector, isDark && styles.cardDark]}>
          <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
            <MaterialIcons name="chevron-left" size={24} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
          <Text style={[styles.monthText, isDark && styles.textDark]}>
            {MONTHS[month]} {year}
          </Text>
          <TouchableOpacity
            onPress={nextMonth}
            style={styles.arrowBtn}
            disabled={isCurrentMonth}>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={isCurrentMonth ? '#CBD5E1' : isDark ? '#94A3B8' : '#64748B'}
            />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#10B981' }]}>
            <MaterialIcons name="arrow-upward" size={20} color="#fff" />
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryAmount}>
              ₹{income.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#EF4444' }]}>
            <MaterialIcons name="arrow-downward" size={20} color="#fff" />
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryAmount}>
              ₹{expense.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: net >= 0 ? '#6366F1' : '#F59E0B' }]}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
            <Text style={styles.summaryLabel}>Net</Text>
            <Text style={styles.summaryAmount}>
              ₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        {/* Income vs Expense Bar */}
        {(income > 0 || expense > 0) && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>Income vs Expense</Text>
            <View style={styles.compareBar}>
              <View
                style={[
                  styles.incomePart,
                  { flex: income || 0.01 },
                ]}
              />
              <View
                style={[
                  styles.expensePart,
                  { flex: expense || 0.01 },
                ]}
              />
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.legendText, isDark && styles.descDark]}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={[styles.legendText, isDark && styles.descDark]}>Expense</Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Spending by Category</Text>

          {categoryTotals.length === 0 ? (
            <View style={styles.noCategoryContainer}>
              <MaterialIcons name="bar-chart" size={40} color="#CBD5E1" />
              <Text style={[styles.noCategoryText, isDark && styles.descDark]}>
                No expense data for this month
              </Text>
            </View>
          ) : (
            categoryTotals.map(({ id, total, category }) => (
              <View key={id} style={styles.categoryRow}>
                <View
                  style={[
                    styles.catIcon,
                    { backgroundColor: (category?.color ?? '#8395A7') + '22' },
                  ]}>
                  <MaterialIcons
                    name={(category?.icon as any) ?? 'receipt'}
                    size={16}
                    color={category?.color ?? '#8395A7'}
                  />
                </View>
                <View style={styles.catInfo}>
                  <View style={styles.catLabelRow}>
                    <Text style={[styles.catLabel, isDark && styles.textDark]}>
                      {category?.label ?? id}
                    </Text>
                    <Text style={[styles.catAmount, isDark && styles.textDark]}>
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </Text>
                  </View>
                  <View style={[styles.barBg, isDark && styles.barBgDark]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(total / maxCategoryTotal) * 100}%`,
                          backgroundColor: category?.color ?? '#6366F1',
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  textDark: {
    color: '#F1F5F9',
  },
  descDark: {
    color: '#94A3B8',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  cardDark: {
    backgroundColor: '#1E293B',
  },
  arrowBtn: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  compareBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  incomePart: {
    backgroundColor: '#10B981',
  },
  expensePart: {
    backgroundColor: '#EF4444',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catInfo: {
    flex: 1,
  },
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  catAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  barBgDark: {
    backgroundColor: '#334155',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  noCategoryContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  noCategoryText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
