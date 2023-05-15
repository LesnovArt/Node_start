import axios, { AxiosResponse } from "axios";
import { Holiday } from "../types/holiday";
import { Query, urlBuilder } from "../utils/urlUtils";

export interface GetPublicHolidaysByCountryAndYearParams {
  countryCode: string;
  year: number;
  query?: Query;
}
export const BASE_HOLIDAY_URL = "https://date.nager.at/api/v3";
export const PATH = {
  publicHolidays: "PublicHolidays",
  nextPublicHolidays: "NextPublicHolidays",
  isTodayPublicHoliday: "IsTodayPublicHoliday",
};

const fetchData = (url: string) => axios.get(url).then((data) => data);

export const getPublicHolidaysByCountryAndYear = ({
  year,
  countryCode,
  query,
}: GetPublicHolidaysByCountryAndYearParams): Promise<AxiosResponse<Holiday[]>> =>
  fetchData(
    urlBuilder({
      baseUrl: BASE_HOLIDAY_URL,
      paths: [PATH.publicHolidays, year, countryCode],
      query,
    })
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });

//! Usage of existing on Nager.Date API - V3 endpoints
export const getNextPublicHolidayByCountry = (
  countryCode: string,
  query?: Query
): Promise<AxiosResponse<Holiday[]>> =>
  fetchData(
    urlBuilder({
      baseUrl: BASE_HOLIDAY_URL,
      paths: [PATH.nextPublicHolidays, countryCode],
      query,
    })
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });

export const checkIsHolidayTodayByCountry = (
  countryCode: string,
  query?: Query
): Promise<AxiosResponse> =>
  fetchData(
    urlBuilder({
      baseUrl: BASE_HOLIDAY_URL,
      paths: [PATH.isTodayPublicHoliday, countryCode],
      query,
    })
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
