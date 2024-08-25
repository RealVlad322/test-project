export function buildQuery(queryParams: BuildQueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (isArray(value)) {
      for (const v of value) {
        searchParams.append(key, `${v}`);
      }
    } else if (value !== undefined) {
      searchParams.append(key, `${value}`);
    }
  }

  return searchParams.toString();
}

export interface BuildQueryParams {
  [key: string]: string | number | boolean | (string | number | boolean)[] | undefined;
}
