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
}

export type RegexFields = Extract<
  keyof Query,
  'batch' | 'name' | 'supplier' | 'category' | 'store'
>;
