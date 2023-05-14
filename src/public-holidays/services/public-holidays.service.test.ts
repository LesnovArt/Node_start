import { publicHolidaysService } from "./public-holidays.service";
import * as HolidaysApi from "../api/publicHolidaysApi";
import * as helpers from "../utils/helpers";
import { generateHolidayMock } from "../utils/testUtils";
import { AxiosResponse } from "axios";

describe("PublicHolidaysService", () => {
  const currentDate = "2022-01-01T00:00:00.000Z";
  const currentYear = 2023;

  beforeEach(() => {
    jest.resetAllMocks();
  });

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
      date: "2023-11-01",
    },
  ];

  const countryHolidays = overrides.map((override) => generateHolidayMock(override));

  describe("module", () => {
    beforeAll(() => jest.useFakeTimers().setSystemTime(new Date(currentDate)));

    afterAll(() => {
      jest.useRealTimers();
    });

    describe("getPublicHolidaysByCountryAndYear, module testing", () => {
      it("should return holidays for a given country and year", async () => {
        const year = 2023;
        const countryCode = "UA";

        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());

        const holidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
          countryCode,
          year,
        });

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          countryCode,
          year,
        });
        expect(holidays).toEqual(countryHolidays);
      });

      it("should return empty array when no holidays found for a given country and year", async () => {
        const year = 2021;
        const countryCode = "POL";

        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200 } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());

        const holidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
          countryCode,
          year,
        });

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          countryCode,
          year,
        });
        expect(holidays).toEqual([]);
      });

      it("should throw an error when invalid country code is passed", async () => {
        const year = 2023;
        const countryCode = "INVALID";

        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 404 } as AxiosResponse);

        const checkStatusForErrorMock = jest
          .spyOn(helpers, "checkStatusForError")
          .mockImplementation(() => {
            throw new Error("country not found");
          });

        await expect(
          publicHolidaysService.getPublicHolidaysByCountryAndYear({
            countryCode,
            year,
          })
        ).rejects.toThrow(
          `Error occurs while retrieving holidays by passed code: ${countryCode}, for ${year} year. Error: country not found`
        );

        expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
      });

      it("should throw an error when validation failed", async () => {
        const year = 1212;
        const countryCode = "UA";

        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 400 } as AxiosResponse);

        const checkStatusForErrorMock = jest
          .spyOn(helpers, "checkStatusForError")
          .mockImplementation(() => {
            throw new Error("validation error");
          });

        await expect(
          publicHolidaysService.getPublicHolidaysByCountryAndYear({
            countryCode,
            year,
          })
        ).rejects.toThrow(
          `Error occurs while retrieving holidays by passed code: ${countryCode}, for ${year} year. Error: validation error`
        );

        expect(checkStatusForErrorMock).toHaveBeenCalledWith(400);
      });
    });

    describe("getHolidaysFromTodayByCountry, module testing", () => {
      it("should return holidays from today for a given country", async () => {
        const result = countryHolidays.filter(
          (holiday) => new Date(holiday.date).getDate() > new Date(currentDate).getDate()
        );
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        const filterHolidaysFromDateSpy = jest
          .spyOn(helpers, "filterHolidaysFromDate")
          .mockReturnValue(result);
        const countryCode = "UA";

        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          year: currentYear,
          countryCode,
        });
        expect(filterHolidaysFromDateSpy).toHaveBeenCalledWith(currentDate, countryHolidays);
        expect(holidays).toEqual(result);
      });

      it("should return empty result if there is no holidays from today for a given country", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        const filterHolidaysFromDateSpy = jest
          .spyOn(helpers, "filterHolidaysFromDate")
          .mockReturnValue([]);
        const countryCode = "UA";

        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          year: currentYear,
          countryCode,
        });
        expect(filterHolidaysFromDateSpy).toHaveBeenCalledWith(currentDate, countryHolidays);
        expect(holidays).toEqual([]);
      });

      it("should return empty result and should not call filter func if there is no holidays for a given country", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: [] } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        const filterHolidaysFromDateSpy = jest
          .spyOn(helpers, "filterHolidaysFromDate")
          .mockImplementation(jest.fn());
        const countryCode = "UA";

        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          year: currentYear,
          countryCode,
        });
        expect(filterHolidaysFromDateSpy).not.toHaveBeenCalled();
        expect(holidays).toEqual([]);
      });

      it("should return empty result and should not call filter func if there is no holidays for a given country", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: [] } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        const filterHolidaysFromDateSpy = jest
          .spyOn(helpers, "filterHolidaysFromDate")
          .mockImplementation(jest.fn());
        const countryCode = "UA";

        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          year: currentYear,
          countryCode,
        });
        expect(filterHolidaysFromDateSpy).not.toHaveBeenCalled();
        expect(holidays).toEqual([]);
      });

      it("should throw an error when invalid country code is passed", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 404 } as AxiosResponse);
        const checkStatusForErrorMock = jest
          .spyOn(helpers, "checkStatusForError")
          .mockImplementation(() => {
            throw new Error("country not found");
          });
        const countryCode = "INVALID";

        await expect(
          publicHolidaysService.getHolidaysFromTodayByCountry(countryCode)
        ).rejects.toThrow(
          `Error while retrieving holidays from today's date by passed code: ${countryCode}. Error: country not found`
        );

        expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
      });
    });

    describe("isHolidayTodayByCountry", () => {
      it("should return true if today is a holiday", async () => {
        const getCurrentYearSpy = jest
          .spyOn(helpers, "getCurrentYear")
          .mockReturnValue(currentYear);
        const getPublicHolidaysByCountryAndYearSpy = jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        const isTodayHolidaySpy = jest.spyOn(helpers, "isTodayHoliday").mockReturnValue(true);
        const countryCode = "UA";

        const result = await publicHolidaysService.isHolidayTodayByCountry(countryCode);

        expect(getCurrentYearSpy).toHaveBeenCalled();
        expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
          year: currentYear,
          countryCode,
        });
        expect(isTodayHolidaySpy).toHaveBeenCalledWith(countryHolidays);
        expect(result).toBe(true);
      });

      it("should return false if today is not a holiday", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
        jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
        jest.spyOn(helpers, "isTodayHoliday").mockReturnValue(false);
        const countryCode = "UA";

        const result = await publicHolidaysService.isHolidayTodayByCountry(countryCode);

        expect(result).toBe(false);
      });

      it("should throw an error if countryCode is unknown", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 404 } as AxiosResponse);
        const checkStatusForErrorMock = jest
          .spyOn(helpers, "checkStatusForError")
          .mockImplementation(() => {
            throw new Error("country not found");
          });
        const isTodayHolidaySpy = jest
          .spyOn(helpers, "isTodayHoliday")
          .mockImplementation(jest.fn());
        const countryCode = "INVALID";

        await expect(publicHolidaysService.isHolidayTodayByCountry(countryCode)).rejects.toThrow(
          `Error occurs while checking today for a holidays by passed code: ${countryCode}. Error: country not found`
        );

        expect(isTodayHolidaySpy).not.toHaveBeenCalled();
        expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
      });

      it("should throw an error if no valid data is returned", async () => {
        jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
        jest
          .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
          .mockResolvedValue({ status: 404, data: [] } as AxiosResponse);
        const checkStatusForErrorMock = jest
          .spyOn(helpers, "checkStatusForError")
          .mockImplementation(jest.fn());
        const isTodayHolidaySpy = jest
          .spyOn(helpers, "isTodayHoliday")
          .mockImplementation(jest.fn());
        const countryCode = "FR";

        await expect(publicHolidaysService.isHolidayTodayByCountry(countryCode)).rejects.toThrow(
          `Error occurs while checking today for a holidays by passed code: ${countryCode}. Error: No valid data by passed code: ${countryCode}`
        );

        expect(isTodayHolidaySpy).not.toHaveBeenCalled();
        expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
      });
    });
  });

  describe("integration", () => {
    describe("getPublicHolidaysByCountryAndYear", () => {
      it("should return holidays only for a given country and year", async () => {
        const year = 2023;
        const countryCode = "UA";

        const holidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
          countryCode,
          year,
        });

        holidays?.forEach((holiday) => {
          expect(holiday.date).toContain(year.toString());
          expect(holiday.countryCode).toEqual(countryCode);
        });
      });

      it("should handle thrown error", async () => {
        const year = 1223;
        const countryCode = "UA";

        await expect(
          publicHolidaysService.getPublicHolidaysByCountryAndYear({
            countryCode,
            year,
          })
        ).rejects.toThrow(
          `Error occurs while retrieving holidays by passed code: ${countryCode}, for ${year} year. Error: AxiosError:`
        );
      });
    });

    describe("getHolidaysFromTodayByCountry", () => {
      it("should return holidays from today for a given country", async () => {
        const countryCode = "UA";
        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        holidays?.forEach((holiday) => {
          expect(holiday.countryCode).toEqual(countryCode);
          expect(new Date(holiday.date) > new Date()).toBe(true);
        });
      });

      it("should return holidays from today for a given country", async () => {
        const countryCode = "UA";
        const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(countryCode);

        holidays?.forEach((holiday) => {
          expect(holiday.countryCode).toEqual(countryCode);
          expect(new Date(holiday.date) > new Date()).toBe(true);
        });
      });

      it("should handle thrown error", async () => {
        const countryCode = "INVALID";

        await expect(
          publicHolidaysService.getHolidaysFromTodayByCountry(countryCode)
        ).rejects.toThrow(
          `Error while retrieving holidays from today's date by passed code: ${countryCode}. Error: AxiosError:`
        );
      });
    });

    describe("isHolidayTodayByCountry", () => {
      it("should return boolean value if today is a holiday", async () => {
        const year = 2023;
        const countryCode = "UA";

        const allHolidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
          year,
          countryCode,
        });
        const isHolidayToday = await publicHolidaysService.isHolidayTodayByCountry(countryCode);
        const checkIsHoliday = () =>
          allHolidays?.some(
            (holiday) => new Date(holiday.date).toDateString() === new Date().toDateString()
          );

        expect(checkIsHoliday()).toEqual(isHolidayToday);
      });

      it("should handle thrown error", async () => {
        const countryCode = "INVALID";

        await expect(publicHolidaysService.isHolidayTodayByCountry(countryCode)).rejects.toThrow(
          `Error occurs while checking today for a holidays by passed code: ${countryCode}. Error: AxiosError:`
        );
      });
    });
  });
});
