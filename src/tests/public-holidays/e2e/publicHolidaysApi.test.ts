import {
  getPublicHolidaysByCountryAndYear,
  getNextPublicHolidayByCountry,
  checkIsHolidayTodayByCountry,
} from "../../../public-holidays/api/publicHolidaysApi";
import { HolidayType } from "../../../public-holidays/types/holiday";
import { InvalidCountryCode, UACountryCode, currentYear } from "../constants";
import { getIsHolidayStatus, isDateLater } from "../expect-utils";

describe("integration with DB e2e testing", () => {
  describe("getPublicHolidaysByCountryAndYear", () => {
    it("fetch public holidays by country and year", async () => {
      const { status, data } = await getPublicHolidaysByCountryAndYear({
        year: currentYear,
        countryCode: UACountryCode,
      });

      data?.forEach((holiday) => {
        expect(holiday).toEqual(
          expect.objectContaining({
            countryCode: UACountryCode,
            date: expect.any(String),
            name: expect.any(String),
            localName: expect.any(String),
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            types: expect.any(Array<HolidayType>),
          })
        );
        expect(holiday.date).toContain(currentYear.toString());
      });

      expect(status).toEqual(200);
    });

    it("throw error", async () => {
      await expect(
        getPublicHolidaysByCountryAndYear({ year: currentYear, countryCode: InvalidCountryCode })
      ).rejects.toThrow();
    });
  });

  describe("getNextPublicHolidayByCountry", () => {
    it("fetches the next public holidays by country", async () => {
      const { status, data } = await getNextPublicHolidayByCountry(UACountryCode);

      data?.forEach((holiday) => {
        expect(holiday).toEqual(
          expect.objectContaining({
            countryCode: UACountryCode,
            date: expect.any(String),
            name: expect.any(String),
            localName: expect.any(String),
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            types: expect.any(Array<HolidayType>),
          })
        );
        expect(isDateLater(holiday.date)).toBe(true);
      });

      expect(status).toEqual(200);
    });

    it("throw error", async () => {
      await expect(getNextPublicHolidayByCountry(InvalidCountryCode)).rejects.toThrow();
    });
  });

  describe("checkIsHolidayTodayByCountry", () => {
    it("checks if today is a public holiday by country", async () => {
      const expectedStatus = await getIsHolidayStatus(currentYear, UACountryCode);
      const { status } = await checkIsHolidayTodayByCountry(UACountryCode);

      expect(expectedStatus).toBe(status);
    });

    it("throw error", async () => {
      await expect(checkIsHolidayTodayByCountry(InvalidCountryCode)).rejects.toThrow();
    });
  });
});
