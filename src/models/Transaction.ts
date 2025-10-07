export type Transaction = {
  id: string;
  date: string; 
  transaction_type: "income" | "expense";
  transaction_amount: string;
  transaction_category: string;
};
