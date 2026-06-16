import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Category,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/constants/categories";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionType } from "@/types/transaction";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";
  const { addTransaction, updateTransaction, getById } = useTransactions();

  const isEditing = !!id;

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (id) {
      const t = getById(id);
      if (t) {
        setType(t.type);
        setAmount(t.amount.toString());
        setCategory(t.category);
        setDescription(t.description);
        setDate(t.date);
      }
    }
  }, [id]);

  const categories: Category[] =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount greater than 0.",
      );
      return;
    }
    if (!category) {
      Alert.alert("Select Category", "Please select a category.");
      return;
    }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert("Invalid Date", "Please enter date as YYYY-MM-DD.");
      return;
    }

    const data = { type, amount: parsedAmount, category, description, date };

    if (isEditing && id) {
      await updateTransaction(id, data);
    } else {
      await addTransaction(data);
    }
    router.back();
  };

  const bg = isDark ? "#0F172A" : "#F1F5F9";
  const cardBg = isDark ? "#1E293B" : "#fff";
  const textColor = isDark ? "#F1F5F9" : "#1E293B";
  const subColor = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const inputBg = isDark ? "#0F172A" : "#F8FAFC";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: cardBg, borderBottomColor: borderColor },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Type Toggle */}
          <View
            style={[
              styles.typeToggle,
              { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "expense" && styles.typeBtnExpenseActive,
              ]}
              onPress={() => {
                setType("expense");
                setCategory("");
              }}
            >
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={type === "expense" ? "#fff" : subColor}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: type === "expense" ? "#fff" : subColor },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "income" && styles.typeBtnIncomeActive,
              ]}
              onPress={() => {
                setType("income");
                setCategory("");
              }}
            >
              <MaterialIcons
                name="arrow-upward"
                size={16}
                color={type === "income" ? "#fff" : subColor}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: type === "income" ? "#fff" : subColor },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View style={[styles.amountCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.amountLabel, { color: subColor }]}>
              Amount
            </Text>
            <View style={styles.amountRow}>
              <Text
                style={[
                  styles.currencySymbol,
                  { color: type === "income" ? "#10B981" : "#EF4444" },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { color: type === "income" ? "#10B981" : "#EF4444" },
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={isDark ? "#334155" : "#CBD5E1"}
                autoFocus={!isEditing}
              />
            </View>
          </View>

          {/* Category */}
          <View style={[styles.section, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const selected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catItem,
                      { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
                      selected && {
                        backgroundColor: cat.color + "22",
                        borderColor: cat.color,
                        borderWidth: 1.5,
                      },
                    ]}
                    onPress={() => setCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.catIconBox,
                        {
                          backgroundColor: cat.color + (selected ? "33" : "18"),
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={cat.icon as any}
                        size={20}
                        color={cat.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.catLabel,
                        { color: selected ? cat.color : subColor },
                        selected && { fontWeight: "700" },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={[styles.section, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this for? (optional)"
              placeholderTextColor={subColor}
            />
          </View>

          {/* Date */}
          <View style={[styles.section, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Date
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: inputBg, color: textColor, borderColor },
              ]}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={subColor}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveLargeBtn,
              { backgroundColor: type === "income" ? "#10B981" : "#6366F1" },
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveLargeBtnText}>
              {isEditing ? "Update Transaction" : "Add Transaction"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#6366F1",
    borderRadius: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  typeToggle: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 13,
    gap: 6,
  },
  typeBtnExpenseActive: {
    backgroundColor: "#EF4444",
  },
  typeBtnIncomeActive: {
    backgroundColor: "#10B981",
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  amountCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "700",
    minWidth: 120,
    textAlign: "center",
  },
  section: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catItem: {
    width: "22%",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  catIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  catLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveLargeBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveLargeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
