import { publicHolidaysService } from "../../public-holidays/services/public-holidays.service";
import { Holiday } from "../../public-holidays/types/holiday";
import { generateHolidayMock } from "./mock-utils";
import { currentDate } from "./constants";

const overrides = [
  {
    name: "Day of Independence",
    date: "2023-05-13",
  },
  {
    name: "Day of Collaboration",
    date: "2023-04-10",
  },
  {
    name: "Day of Culture",
    date: "2023-10-17",
  },
  {
    name: "Day of Science",
    date: "2023-01-01",
  },
];
export const countryHolidays = overrides.map((override) => generateHolidayMock(override));
export const filteredHolidays = countryHolidays.filter(
  (holiday) => new Date(holiday.date).getDate() > new Date(currentDate).getDate()
);
export const isDateLater = (checkingDate: string, date?: Date) =>
  new Date(checkingDate) > (date || new Date());

export const testHolidaysYearAndCountryMatch = (
  holidays: Holiday[],
  countryCode: string,
  year: number
) => {
  const yearToString = year.toString();

  holidays?.forEach((holiday) => {
    expect(holiday?.date).toContain(yearToString);
    expect(holiday?.countryCode).toEqual(countryCode);
  });
};

export const testHolidaysDatesMatch = (holidays: Holiday[], countryCode: string) =>
  holidays.forEach((holiday) => {
    expect(holiday.countryCode).toEqual(countryCode);
    expect(isDateLater(holiday.date)).toBe(true);
  });

export const checkIsHoliday = async (year: number, countryCode: string): Promise<boolean> => {
  const allHolidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
    year,
    countryCode,
  });

  return Boolean(
    allHolidays?.some(
      (holiday) => new Date(holiday.date)?.toDateString() === new Date().toDateString()
    )
  );
};

export const getIsHolidayStatus = async (year: number, countryCode: string) => {
  const isHoliday = await checkIsHoliday(year, countryCode);

  return isHoliday ? 200 : 204;
};
