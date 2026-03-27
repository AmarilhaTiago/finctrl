export type TransactionType = "income" | "expense";
export type AccountType = "checking" | "savings" | "investment" | "wallet";
export type Frequency = "weekly" | "monthly" | "yearly";
export type CategoryType = "expense" | "income" | "both";

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  bank: string | null;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string;
  monthly_limit: number | null;
  type: CategoryType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  credit_card_id: string | null;
  date: string;
  recurring_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionWithRelations extends Transaction {
  category: Category;
  account: Account;
  credit_card: CreditCard | null;
}

export interface Recurring {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  credit_card_id: string | null;
  frequency: Frequency;
  start_date: string;
  end_date: string | null;
  total_installments: number | null;
  current_installment: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringWithRelations extends Recurring {
  category: Category;
  account: Account;
  credit_card: CreditCard | null;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  account_id: string | null;
  color: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  date: string;
  created_at: string;
}
