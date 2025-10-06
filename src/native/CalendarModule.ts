import { NativeModules } from 'react-native';

const { CalendarModule } = NativeModules;

export default {
  requestAccess: (): Promise<boolean> => CalendarModule.requestAccess(),
  addTransactionReminder: (title: string, dateISO: string): Promise<{ id: string }> =>
    CalendarModule.addTransactionReminder(title, dateISO),
};
