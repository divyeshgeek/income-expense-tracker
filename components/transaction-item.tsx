import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Props {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function TransactionItem({ transaction, onEdit, onDelete }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const category = getCategoryById(transaction.category);

  const handleLongPress = () => {
    Alert.alert(
      transaction.description || category?.label || 'Transaction',
      `₹${transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      [
        { text: 'Edit', onPress: () => onEdit(transaction) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Delete Transaction', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDelete(transaction.id) },
            ]),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.item, isDark && styles.itemDark]}
      onPress={() => onEdit(transaction)}
      onLongPress={handleLongPress}
      activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: (category?.color ?? '#8395A7') + '22' }]}>
        <MaterialIcons
          name={(category?.icon as any) ?? 'receipt'}
          size={22}
          color={category?.color ?? '#8395A7'}
        />
      </View>

      <View style={styles.info}>
        <Text style={[styles.categoryLabel, isDark && styles.textDark]} numberOfLines={1}>
          {category?.label ?? transaction.category}
        </Text>
        {transaction.description ? (
          <Text style={[styles.description, isDark && styles.descDark]} numberOfLines={1}>
            {transaction.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            transaction.type === 'income' ? styles.incomeText : styles.expenseText,
          ]}>
          {transaction.type === 'income' ? '+' : '-'}₹
          {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.date, isDark && styles.descDark]}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemDark: {
    backgroundColor: '#1E293B',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 3,
  },
  textDark: {
    color: '#F1F5F9',
  },
  description: {
    fontSize: 12,
    color: '#64748B',
  },
  descDark: {
    color: '#94A3B8',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  date: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
