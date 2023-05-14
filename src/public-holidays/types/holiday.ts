export type HolidayType = "Public" | "Bank" | "School" | "Authorities" | "Optional" | "Observance";

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[];
  launchYear: number;
  types: HolidayType[];
}
