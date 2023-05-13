import fetch from "node-fetch";

export const fetchData = async (url) => {
  return await fetch(url)
    .then((data) => data.json())
    .catch((error) =>
      console.log(`Error occurs while retrieving data from URL: ${url}, Error: ${error}`)
    );
};
