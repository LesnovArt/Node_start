export type Query = Record<string, string>;
export type Path = string | number;
export const queryBuilder = (query: Query): string => {
  const urlParams = Object.entries(query).map(([key, value]) => `${key}=${value}`);

  return `${urlParams.join("&")}`;
};

export const pathsBuilder = (paths: Path[]) => paths.join("/");

interface UrlBuilderParams {
  baseUrl: string;
  paths?: Path[];
  query?: Query;
}

export const urlBuilder = ({ baseUrl, paths, query }: UrlBuilderParams): string => {
  const hasPaths = paths?.length;
  const hasQuery = !!query;

  if (hasPaths && !hasQuery) {
    return `${baseUrl}/${pathsBuilder(paths)}`;
  }

  if (!hasPaths && hasQuery) {
    return `${baseUrl}?${queryBuilder(query)}`;
  }

  if (hasPaths && hasQuery) {
    return `${baseUrl}/${pathsBuilder(paths)}?${queryBuilder(query)}`;
  }

  return baseUrl;
};
