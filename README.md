# 💰 Personal Finance App

A cross-platform **React Native (Expo)** app for tracking transactions, analyzing expenses, and setting reminders — built as part of an advanced mobile development assignment.

---

## 📱 Features

- 📊 Track income & expenses by category  
- 💾 Store transactions locally with React Context API  
- 📈 View category-wise spending charts  
- 🔔 Native Calendar Reminders (via iOS Swift Module)  
- ⚙️ RESTful integration with mock API using Axios  
- 🧮 Compound interest & total savings calculator  
- 🧪 Unit and integration tested (Jest, JUnit, XCTest)  
- ⚡ Infinite scroll & responsive UI with TypeScript  

---

## 🧩 Project Structure

PersonalFinanceApp/
|
├── App.tsx # Root app component
├── index.ts # Entry point
├── app.json # Expo config
│
├── src/
│ ├── api/
│ │ ├── transactionsApi.ts # Axios mock server
│ │ └── TransactionCalendar.ts # Native module interface
│ │
│ ├── components/ # UI components
│ │ ├── TransactionForm.tsx
│ │ ├── TransactionItem.tsx
│ │ ├── TransactionChart.tsx
│ │ ├── CategoryTotals.tsx
│ │ └── BatteryMonitor.tsx
│ │
│ ├── context/
│ │ └── TransactionsContext.tsx # Global state management
│ │
│ ├── models/
│ │ └── Transaction.ts # TypeScript model
│ │
│ ├── screens/
│ │ └── TransactionsScreen.tsx # Main UI screen
│ │
│ └── utils/
│ └── finance.ts # Helper algorithms
│
├── ios/ # Native Swift calendar module
│ ├── CalendarModule.swift
│ └── CalendarModuleBridge.m
│
├── android/ # Kotlin native modules (optional)
│
├── package.json
└── tsconfig.json


---

## ⚙️ Dependencies

| Category | Package | Purpose |
|-----------|----------|----------|
| Core | `react`, `react-native`, `expo` | Core framework |
| Navigation | `@react-navigation/native` | Screen navigation |
| Charts | `react-native-chart-kit` | Expense charts |
| API | `axios` | REST API calls |
| State | `context` / `useReducer` | Global state |
| Testing | `jest`, `@testing-library/react-native` | Unit testing |
| Native Bridge | Swift (iOS), Kotlin (Android) | Native modules |

---

## 🧪 Testing Instructions

### ✅ Unit Tests (React Native)
Run tests with:
```bash
🧩 iOS Native Module Tests

Open ios/PersonalFinanceApp.xcworkspace in Xcode, select the test scheme, and press Cmd + U.

🤖 Android Native Module Tests

Run JUnit tests from Android Studio’s Run → Run Tests option.

📱 Integration Tests (End-to-End)

With Appium configured:

npx appium
npm run e2e


🗂 Version Control

Each feature is developed on a separate branch:

git checkout -b feature/add-reminders
git commit -m "Added transaction reminder module"


Merge with main after review:

git checkout main
git merge feature/add-reminders
