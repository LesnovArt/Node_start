import axios, { AxiosResponse } from "axios";
import { Holiday } from "../types/holiday";

export interface GetPublicHolidaysByCountryAndYearParams {
  countryCode: Holiday["countryCode"];
  year: Holiday["launchYear"];
}
export const BASE_HOLIDAY_URL = "https://date.nager.at/api/v3";

const fetchData = (url: string) => axios.get(url).then((data) => data);

export const getPublicHolidaysByCountryAndYear = ({
  year,
  countryCode,
}: GetPublicHolidaysByCountryAndYearParams): Promise<AxiosResponse<Holiday[]>> =>
  fetchData(`${BASE_HOLIDAY_URL}/PublicHolidays/${year}/${countryCode}`)
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });

//! Usage of existing on Nager.Date API - V3 endpoints
export const getNextPublicHolidayByCountry = (
  countryCode: Holiday["countryCode"]
): Promise<AxiosResponse<Holiday[]>> =>
  fetchData(`${BASE_HOLIDAY_URL}/NextPublicHolidays/${countryCode}`)
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });

export const checkIsHolidayTodayByCountry = (
  countryCode: Holiday["countryCode"]
): Promise<AxiosResponse> =>
  fetchData(`${BASE_HOLIDAY_URL}/IsTodayPublicHoliday/${countryCode}`)
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
