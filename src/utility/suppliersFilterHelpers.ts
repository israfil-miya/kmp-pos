export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  company?: RegexQuery;
  name?: RegexQuery;
  email?: RegexQuery;
  phone?: RegexQuery;
  address?: RegexQuery;
}
type RegexFields = Extract<
  keyof Query,
  'company' | 'name' | 'email' | 'phone' | 'address'
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
