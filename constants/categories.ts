export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', label: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', icon: 'directions-car', color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-bag', color: '#45B7D1' },
  { id: 'entertainment', label: 'Entertainment', icon: 'movie', color: '#F7B731' },
  { id: 'health', label: 'Health', icon: 'local-hospital', color: '#FC5C65' },
  { id: 'bills', label: 'Bills', icon: 'receipt', color: '#A55EEA' },
  { id: 'education', label: 'Education', icon: 'school', color: '#26de81' },
  { id: 'other', label: 'Other', icon: 'more-horiz', color: '#8395A7' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary', icon: 'work', color: '#20BF6B' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop', color: '#2D98DA' },
  { id: 'investment', label: 'Investment', icon: 'trending-up', color: '#F7B731' },
  { id: 'gift', label: 'Gift', icon: 'card-giftcard', color: '#FD9644' },
  { id: 'other', label: 'Other', icon: 'more-horiz', color: '#8395A7' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}
