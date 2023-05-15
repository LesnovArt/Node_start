import { publicHolidaysService } from "../../../public-holidays/services/public-holidays.service";
import { InvalidCountryCode, UACountryCode, currentYear } from "../constants";
import {
  checkIsHoliday,
  testHolidaysDatesMatch,
  testHolidaysYearAndCountryMatch,
} from "../expect-utils";

describe("PublicHolidaysService", () => {
  describe("getPublicHolidaysByCountryAndYear", () => {
    it("should return holidays only for a given country and year", async () => {
      const holidays =
        (await publicHolidaysService.getPublicHolidaysByCountryAndYear({
          countryCode: UACountryCode,
          year: currentYear,
        })) || [];

      testHolidaysYearAndCountryMatch(holidays, UACountryCode, currentYear);
    });

    it("should handle thrown error", async () => {
      await expect(
        publicHolidaysService.getPublicHolidaysByCountryAndYear({
          countryCode: InvalidCountryCode,
          year: currentYear,
        })
      ).rejects.toThrow(
        `Error occurs while retrieving holidays by passed code: ${InvalidCountryCode}, for ${currentYear} year. Error: AxiosError:`
      );
    });
  });

  describe("getHolidaysFromTodayByCountry", () => {
    it("should return holidays from today for a given country", async () => {
      const holidays =
        (await publicHolidaysService.getHolidaysFromTodayByCountry(UACountryCode)) || [];

      testHolidaysDatesMatch(holidays, UACountryCode);
    });

    it("should handle thrown error", async () => {
      await expect(
        publicHolidaysService.getHolidaysFromTodayByCountry(InvalidCountryCode)
      ).rejects.toThrow(
        `Error while retrieving holidays from today's date by passed code: ${InvalidCountryCode}. Error: AxiosError:`
      );
    });
  });

  describe("isHolidayTodayByCountry", () => {
    it("should return boolean value if today is a holiday", async () => {
      const expectedResult = await checkIsHoliday(currentYear, UACountryCode);
      const isHolidayToday = await publicHolidaysService.isHolidayTodayByCountry(UACountryCode);

      expect(expectedResult).toEqual(isHolidayToday);
    });

    it("should handle thrown error", async () => {
      await expect(
        publicHolidaysService.isHolidayTodayByCountry(InvalidCountryCode)
      ).rejects.toThrow(
        `Error occurs while checking today for a holidays by passed code: ${InvalidCountryCode}. Error: AxiosError:`
      );
    });
  });
});
