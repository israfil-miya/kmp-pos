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
export type RegexFields = Extract<
  keyof Query,
  'company' | 'name' | 'email' | 'phone' | 'address'
>;
