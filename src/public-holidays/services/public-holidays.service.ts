import { Holiday } from "../types/holiday";
import {
  checkStatusForError,
  filterHolidaysFromDate,
  getCurrentYear,
  isTodayHoliday,
} from "../utils/helpers";
import {
  GetPublicHolidaysByCountryAndYearParams,
  getPublicHolidaysByCountryAndYear,
} from "../api/publicHolidaysApi";

interface PublicHolidaysService {
  getPublicHolidaysByCountryAndYear: (
    params: GetPublicHolidaysByCountryAndYearParams
  ) => Promise<Holiday[] | undefined>;
  getHolidaysFromTodayByCountry: (
    countryCode: Holiday["countryCode"]
  ) => Promise<Holiday[] | undefined>;
  isHolidayTodayByCountry: (countryCode: Holiday["countryCode"]) => Promise<boolean | undefined>;
}

export const publicHolidaysService: PublicHolidaysService = {
  getPublicHolidaysByCountryAndYear: async (params) => {
    try {
      const { status, data } = await getPublicHolidaysByCountryAndYear(params);
      checkStatusForError(status);

      if (data) {
        return data;
      }

      return [];
    } catch (error) {
      throw new Error(
        `Error occurs while retrieving holidays by passed code: ${params.countryCode}, for ${params.year} year. ${error}`
      );
    }
  },

  // implement own API based on getAll endpoint to have more functionality for covering as a part of module testing
  getHolidaysFromTodayByCountry: async (countryCode) => {
    try {
      const currentYear = getCurrentYear();
      const { status, data } = await getPublicHolidaysByCountryAndYear({
        year: currentYear,
        countryCode,
      });
      checkStatusForError(status);

      if (data && data.length > 0) {
        const currentDate = new Date().toISOString();

        return filterHolidaysFromDate(currentDate, data);
      }

      return [];
    } catch (error) {
      throw new Error(
        `Error while retrieving holidays from today's date by passed code: ${countryCode}. ${error}`
      );
    }
  },

  // implement own API based on getAll endpoint to have more functionality for covering as a part of module testing
  isHolidayTodayByCountry: async (countryCode) => {
    try {
      const currentYear = getCurrentYear();
      const { status, data } = await getPublicHolidaysByCountryAndYear({
        year: currentYear,
        countryCode,
      });
      checkStatusForError(status);

      if (data && data.length > 0) {
        return isTodayHoliday(data);
      }

      throw new Error(`No valid data by passed code: ${countryCode}`);
    } catch (error) {
      throw new Error(
        `Error occurs while checking today for a holidays by passed code: ${countryCode}. ${error}`
      );
    }
  },
};
