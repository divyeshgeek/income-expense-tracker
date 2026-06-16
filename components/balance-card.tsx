import { StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Props {
  balance: number;
  income: number;
  expense: number;
}

export function BalanceCard({ balance, income, expense }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text style={[styles.label, isDark && styles.labelDark]}>Total Balance</Text>
      <Text style={[styles.balance, isDark && styles.balanceDark]}>
        ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </Text>

      <View style={styles.row}>
        <View style={styles.statBox}>
          <View style={styles.incomeIcon}>
            <Text style={styles.arrowText}>↑</Text>
          </View>
          <View>
            <Text style={[styles.statLabel, isDark && styles.labelDark]}>Income</Text>
            <Text style={styles.incomeAmount}>
              ₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, isDark && styles.dividerDark]} />

        <View style={styles.statBox}>
          <View style={styles.expenseIcon}>
            <Text style={styles.arrowText}>↓</Text>
          </View>
          <View>
            <Text style={[styles.statLabel, isDark && styles.labelDark]}>Expense</Text>
            <Text style={styles.expenseAmount}>
              ₹{expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  cardDark: {
    backgroundColor: '#4F46E5',
  },
  label: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 6,
  },
  labelDark: {
    color: 'rgba(255,255,255,0.65)',
  },
  balance: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  balanceDark: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  incomeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239,68,68,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 2,
  },
  incomeAmount: {
    color: '#6EE7B7',
    fontSize: 15,
    fontWeight: '600',
  },
  expenseAmount: {
    color: '#FCA5A5',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  dividerDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
