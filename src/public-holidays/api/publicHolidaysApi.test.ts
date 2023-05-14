import {
  getPublicHolidaysByCountryAndYear,
  getNextPublicHolidayByCountry,
  checkIsHolidayTodayByCountry,
} from "./publicHolidaysApi";
import { HolidayType } from "../types/holiday";

describe("integration with DB e2e testing", () => {
  describe("getPublicHolidaysByCountryAndYear", () => {
    it("fetch public holidays by country and year", async () => {
      const year = 2023;
      const countryCode = "US";
      const { status, data } = await getPublicHolidaysByCountryAndYear({ year, countryCode });

      data?.forEach((holiday) => {
        expect(holiday).toEqual(
          expect.objectContaining({
            countryCode: expect.any(String),
            date: expect.any(String),
            name: expect.any(String),
            localName: expect.any(String),
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            types: expect.any(Array<HolidayType>),
          })
        );
        expect(holiday.countryCode).toEqual(countryCode);
        expect(holiday.date).toContain(year.toString());
      });

      expect(status).toEqual(200);
    });

    it("throw error", async () => {
      const year = 2023;
      const countryCode = "INVALID";
      await expect(getPublicHolidaysByCountryAndYear({ year, countryCode })).rejects.toThrow();
    });
  });

  describe("getNextPublicHolidayByCountry", () => {
    it("fetches the next public holidays by country", async () => {
      const countryCode = "UA";
      const { status, data } = await getNextPublicHolidayByCountry(countryCode);

      data?.forEach((holiday) => {
        expect(holiday).toEqual(
          expect.objectContaining({
            countryCode: expect.any(String),
            date: expect.any(String),
            name: expect.any(String),
            localName: expect.any(String),
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            types: expect.any(Array<HolidayType>),
          })
        );
        expect(holiday.countryCode).toEqual(countryCode);
        expect(new Date(holiday.date) > new Date()).toBe(true);
      });

      expect(status).toEqual(200);
    });

    it("throw error", async () => {
      const countryCode = "INVALID";
      await expect(getNextPublicHolidayByCountry(countryCode)).rejects.toThrow();
    });
  });

  describe("checkIsHolidayTodayByCountry", () => {
    it("checks if today is a public holiday by country", async () => {
      const countryCode = "UA";
      const year = 2023;
      const { data: allHolidays } = await getPublicHolidaysByCountryAndYear({ year, countryCode });
      const { status } = await checkIsHolidayTodayByCountry(countryCode);

      const checkHolidayStatus = () => {
        if (allHolidays?.length < 0) {
          return 204;
        }

        const today = allHolidays.find((holiday) => {
          return new Date(holiday.date) === new Date();
        });

        return Boolean(today) ? 200 : 204;
      };

      expect(checkHolidayStatus()).toBe(status);
    });

    it("throw error", async () => {
      const countryCode = "INVALID";
      await expect(checkIsHolidayTodayByCountry(countryCode)).rejects.toThrow();
    });
  });
});
