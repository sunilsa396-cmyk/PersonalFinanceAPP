import { Transaction } from "../models/Transaction";

const BASE_URL = "https://www.makeitunique.in/transactions.php";

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  return json.status === "success" ? json.data : [];
}

// Dummy API simulation for add/edit/delete (since API doesn’t expose endpoints)
export async function addTransaction(tx: Transaction): Promise<Transaction> {
  return { ...tx, id: Date.now().toString() }; // generate fake id
}

export async function updateTransaction(tx: Transaction): Promise<Transaction> {
  return tx; // just return updated transaction
}

export async function deleteTransaction(id: string): Promise<string> {
  return id; // just return deleted id
}
