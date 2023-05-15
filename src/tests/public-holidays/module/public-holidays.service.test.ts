import { publicHolidaysService } from "../../../public-holidays/services/public-holidays.service";
import * as HolidaysApi from "../../../public-holidays/api/publicHolidaysApi";
import * as helpers from "../../../public-holidays/utils/helpers";
import { AxiosResponse } from "axios";
import { countryHolidays, filteredHolidays } from "../expect-utils";
import { InvalidCountryCode, UACountryCode, currentDate, currentYear } from "../constants";

describe("PublicHolidaysService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => jest.useFakeTimers().setSystemTime(new Date(currentDate)));

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("getPublicHolidaysByCountryAndYear", () => {
    it("should return holidays for a given country and year", async () => {
      const getPublicHolidaysByCountryAndYearSpy = jest
        .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
        .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
      jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());

      const holidays = await publicHolidaysService.getPublicHolidaysByCountryAndYear({
        countryCode: UACountryCode,
        year: currentYear,
      });

      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        countryCode: UACountryCode,
        year: currentYear,
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
          countryCode: InvalidCountryCode,
          year: currentYear,
        })
      ).rejects.toThrow(
        `Error occurs while retrieving holidays by passed code: ${InvalidCountryCode}, for ${currentYear} year. Error: country not found`
      );

      expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
    });

    it("should throw an error when validation failed", async () => {
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
          countryCode: UACountryCode,
          year: 1212,
        })
      ).rejects.toThrow(
        `Error occurs while retrieving holidays by passed code: ${UACountryCode}, for 1212 year. Error: validation error`
      );

      expect(checkStatusForErrorMock).toHaveBeenCalledWith(400);
    });
  });

  describe("getHolidaysFromTodayByCountry", () => {
    it("should return holidays from today for a given country", async () => {
      jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
      const getPublicHolidaysByCountryAndYearSpy = jest
        .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
        .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
      jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
      const filterHolidaysFromDateSpy = jest
        .spyOn(helpers, "filterHolidaysFromDate")
        .mockReturnValue(filteredHolidays);

      const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(UACountryCode);

      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        year: currentYear,
        countryCode: UACountryCode,
      });
      expect(filterHolidaysFromDateSpy).toHaveBeenCalledWith(currentDate, countryHolidays);
      expect(holidays).toEqual(filteredHolidays);
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

      const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(UACountryCode);

      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        year: currentYear,
        countryCode: UACountryCode,
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

      const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(UACountryCode);

      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        year: currentYear,
        countryCode: UACountryCode,
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

      const holidays = await publicHolidaysService.getHolidaysFromTodayByCountry(UACountryCode);

      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        year: currentYear,
        countryCode: UACountryCode,
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

      await expect(
        publicHolidaysService.getHolidaysFromTodayByCountry(InvalidCountryCode)
      ).rejects.toThrow(
        `Error while retrieving holidays from today's date by passed code: ${InvalidCountryCode}. Error: country not found`
      );

      expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
    });
  });

  describe("isHolidayTodayByCountry", () => {
    it("should return true if today is a holiday", async () => {
      const getCurrentYearSpy = jest.spyOn(helpers, "getCurrentYear").mockReturnValue(currentYear);
      const getPublicHolidaysByCountryAndYearSpy = jest
        .spyOn(HolidaysApi, "getPublicHolidaysByCountryAndYear")
        .mockResolvedValue({ status: 200, data: countryHolidays } as AxiosResponse);
      jest.spyOn(helpers, "checkStatusForError").mockImplementation(jest.fn());
      const isTodayHolidaySpy = jest.spyOn(helpers, "isTodayHoliday").mockReturnValue(true);

      const result = await publicHolidaysService.isHolidayTodayByCountry(UACountryCode);

      expect(getCurrentYearSpy).toHaveBeenCalled();
      expect(getPublicHolidaysByCountryAndYearSpy).toHaveBeenCalledWith({
        year: currentYear,
        countryCode: UACountryCode,
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

      const result = await publicHolidaysService.isHolidayTodayByCountry(UACountryCode);

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
      const isTodayHolidaySpy = jest.spyOn(helpers, "isTodayHoliday").mockImplementation(jest.fn());

      await expect(
        publicHolidaysService.isHolidayTodayByCountry(InvalidCountryCode)
      ).rejects.toThrow(
        `Error occurs while checking today for a holidays by passed code: ${InvalidCountryCode}. Error: country not found`
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
      const isTodayHolidaySpy = jest.spyOn(helpers, "isTodayHoliday").mockImplementation(jest.fn());

      await expect(
        publicHolidaysService.isHolidayTodayByCountry(InvalidCountryCode)
      ).rejects.toThrow(
        `Error occurs while checking today for a holidays by passed code: ${InvalidCountryCode}. Error: No valid data by passed code: ${InvalidCountryCode}`
      );

      expect(isTodayHolidaySpy).not.toHaveBeenCalled();
      expect(checkStatusForErrorMock).toHaveBeenCalledWith(404);
    });
  });
});
