export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  cashier?: RegexQuery;
  payment_method?: RegexQuery;
  invoice_no?: RegexQuery;
  shop_name?: RegexQuery;
  'customer.name'?: RegexQuery;
}

export type RegexFields = Extract<
  keyof Query,
  'cashier' | 'payment_method' | 'invoice_no' | 'shop_name' | 'customer.name'
>;
