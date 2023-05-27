/**
 * This file is just to test request for correct response. For testing Get request, do it in browser.
 * For other methods uncomment one of corresponding helper and run command `yarn server:test`.
 * Check console inside terminal and updated data in browser with `http://localhost:8080/users` url.
 * In case you need to check the next one comment previous helper back
 */

import axios, { AxiosResponse } from "axios";

import { urlBuilder } from "../public-holidays/utils/urlUtils";

export const postData = (url: string, body?: unknown) =>
  axios.post(url, { body }).then((data) => data);
export const patchData = (url: string, body?: unknown) =>
  axios.patch(url, { body }).then((data) => data);
export const deleteData = (url: string) => axios.delete(url).then((data) => data);

const url = "http://localhost:8080";

export const postNewUser = (): Promise<AxiosResponse<any[]>> =>
  postData(
    urlBuilder({
      baseUrl: url,
      paths: ["users"],
    }),
    {
      name: "Art",
      email: "west@test.com",
      hobbies: ["swimming", "sleeping"],
    }
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
// test create a user uncomment it
// postNewUser();

export const patchUser = (): Promise<AxiosResponse<any[]>> =>
  patchData(
    urlBuilder({
      baseUrl: url,
      paths: ["users", 2],
    }),
    {
      email: "newEmail@com",
    }
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
// test update user data uncomment it
// patchUser();

export const deleteUser = (): Promise<AxiosResponse<any[]>> =>
  deleteData(
    urlBuilder({
      baseUrl: url,
      paths: ["users", 2],
    })
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
// test delete user uncomment it
// deleteUser();

export const addNewHobby = (): Promise<AxiosResponse<any[]>> =>
  postData(
    urlBuilder({
      baseUrl: url,
      paths: ["users", 2, "hobbies"],
    }),
    "dance"
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
// test add new hobby for user uncomment it
// addNewHobby();

export const deleteHobby = (): Promise<AxiosResponse<any[]>> =>
  patchData(
    urlBuilder({
      baseUrl: url,
      paths: ["users", 2, "hobbies"],
    }),
    "series"
  )
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
// test delete user hobby uncomment it
// deleteHobby();
