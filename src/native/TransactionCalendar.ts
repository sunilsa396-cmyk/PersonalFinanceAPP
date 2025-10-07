import { NativeModules } from 'react-native';
const { TransactionCalendarModule } = NativeModules;

export const addTransactionReminder = async (title: string, date: string) => {
  try {
    const result = await TransactionCalendarModule.addTransactionReminder(title, date);
    console.log(result);
    return result;
  } catch (err) {
    console.error('Error adding reminder:', err);
  }
};

export const fetchReminders = async () => {
  try {
    const reminders = await TransactionCalendarModule.fetchReminders();
    console.log(reminders);
    return reminders;
  } catch (err) {
    console.error('Error fetching reminders:', err);
  }
};
