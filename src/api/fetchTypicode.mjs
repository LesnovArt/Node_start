import { fetchData } from "./utils/fetchData.mjs";

const URL = "https://jsonplaceholder.typicode.com/posts/1";

export const fetchTypicode = () => fetchData(URL);
