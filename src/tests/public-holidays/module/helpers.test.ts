import {
  isTodayHoliday,
  filterHolidaysFromDate,
  checkStatusForError,
} from "../../../public-holidays/utils/helpers";
import { currentDate } from "../constants";
import { countryHolidays } from "../expect-utils";

describe("isTodayHoliday", () => {
  beforeAll(() => jest.useFakeTimers().setSystemTime(new Date(currentDate)));

  afterEach(() => jest.resetAllMocks());
  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns true if today is a holiday", () => {
    const todayIsHoliday = isTodayHoliday(countryHolidays);

    expect(todayIsHoliday).toBe(true);
  });

  it("returns false if today is not a holiday", () => {
    const todayIsHoliday = isTodayHoliday([countryHolidays[1], countryHolidays[2]]);

    expect(todayIsHoliday).toBe(false);
  });
});

describe("filterHolidaysFromDate", () => {
  it("returns holidays after the specified date", () => {
    const dateFrom = "2023-05-10";
    const filteredHolidays = filterHolidaysFromDate(dateFrom, countryHolidays);

    expect(filteredHolidays.length).toBe(2);
    expect(filteredHolidays[0].name).toBe(countryHolidays[0].name);
    expect(filteredHolidays[1].name).toBe(countryHolidays[2].name);
  });
});

describe("checkStatusForError", () => {
  it('throws an error with message "Country Code is unknown" for status 404', () => {
    expect(() => {
      checkStatusForError(404);
    }).toThrow("Country Code is unknown");
  });

  it('throws an error with message "Validation failure" for status 400', () => {
    expect(() => {
      checkStatusForError(400);
    }).toThrow("Validation failure");
  });

  it("does not throw an error for other status codes", () => {
    [200, 300, 500].forEach((statusCode) =>
      expect(() => {
        checkStatusForError(statusCode);
      }).not.toThrow()
    );
  });
});
