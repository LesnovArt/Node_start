import { Holiday } from "../types/holiday";

const defaultHoliday: Holiday = {
  date: "2023-05-13",
  localName: "string",
  name: "string",
  countryCode: "UA",
  fixed: true,
  global: true,
  counties: ["UA", "UK"],
  launchYear: 1788,
  types: ["Public"],
};

export const generateHolidayMock = (override: Partial<Holiday>): Holiday => ({
  ...defaultHoliday,
  ...override,
});
