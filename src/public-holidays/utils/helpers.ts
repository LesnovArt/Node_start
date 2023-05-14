import { Holiday } from "../types/holiday";

export const getCurrentYear = () => new Date().getFullYear();

export const isTodayHoliday = (publicHolidays: Holiday[]) => {
  const today = new Date().toDateString();

  return publicHolidays.some(({ date }) => new Date(date).toDateString() === today);
};

export const filterHolidaysFromDate = (dateFrom: string, holidays: Holiday[]): Holiday[] =>
  holidays.filter(({ date }) => new Date(dateFrom) < new Date(date));

export const checkStatusForError = (status: number) => {
  if (status === 404) {
    throw new Error("Country Code is unknown");
  }

  if (status === 400) {
    throw new Error("Validation failure");
  }

  return;
};
