export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  batch?: RegexQuery;
  name?: RegexQuery;
  supplier?: RegexQuery;
  category?: RegexQuery;
  store?: RegexQuery;
  mft_date?: { $gte?: string; $lte?: string };
  exp_date?: { $gte?: string; $lte?: string };
}
type RegexFields = Extract<
  keyof Query,
  'batch' | 'name' | 'supplier' | 'category' | 'store'
>;

// Helper function to create a regex query
export const createRegexQuery = (
  value?: string,
  exactMatch: boolean = false,
): RegexQuery | undefined =>
  value
    ? { $regex: exactMatch ? `^${value}$` : value, $options: 'i' }
    : undefined;

// Helper function to add regex fields to the query
export const addRegexField = (
  query: Query,
  key: RegexFields,
  value?: string,
  exactMatch: boolean = false,
) => {
  const regexQuery = createRegexQuery(value, exactMatch);
  if (regexQuery) {
    query[key] = regexQuery;
  }
};

// Helper function to add fields if they are defined
export const addIfDefined = (query: Query, key: keyof Query, value: any) => {
  if (value !== undefined && value !== null && value !== '') {
    query[key] = value;
  }
};
