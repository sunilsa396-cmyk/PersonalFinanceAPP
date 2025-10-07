import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Transaction } from "../models/Transaction";
import * as api from "../api/transactionsApi";

type State = {
  transactions: Transaction[];
  loading: boolean;
};

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "REMOVE_TRANSACTION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: State = {
  transactions: [],
  loading: false,
};

const TransactionsContext = createContext<{
  state: State;
  fetchAll: () => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}>({
  state: initialState,
  fetchAll: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  removeTransaction: async () => {},
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "REMOVE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAll = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await api.fetchTransactions();
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    } catch (e) {
      console.error("Fetch transactions error:", e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addTransaction = async (tx: Transaction) => {
    const newTx = await api.addTransaction(tx);
    dispatch({ type: "ADD_TRANSACTION", payload: newTx });
  };

  const updateTransaction = async (tx: Transaction) => {
    const updatedTx = await api.updateTransaction(tx);
    dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTx });
  };

  const removeTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    dispatch({ type: "REMOVE_TRANSACTION", payload: id });
  };

  return (
    <TransactionsContext.Provider
      value={{ state, fetchAll, addTransaction, updateTransaction, removeTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error("useTransactions must be used within TransactionsProvider");
  return {
    transactions: context.state.transactions,
    loading: context.state.loading,
    fetchAll: context.fetchAll,
    addTransaction: context.addTransaction,
    updateTransaction: context.updateTransaction,
    removeTransaction: context.removeTransaction,
  };
};
